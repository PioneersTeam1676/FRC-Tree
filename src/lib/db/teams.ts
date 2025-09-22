import 'dotenv/config';
const TBA_KEY = process.env.TBA_KEY || ""; // empty string if not provided
import { error } from "@sveltejs/kit";
import { mysqlConnection, mysqlPool } from "./mysql";

export type Team = {
    links: {
        url: string,
        icon: string,
        title: string,
        description: string,
    }[],
    info: {
        primary_color: string,
        secondary_color: string,
        team_num: number,
        team_full_name: string,
        pfp: string,
        description: string,
        location: string,
    }[],
}

export async function getTeamFromDB(teamNum: number): Promise<Team | undefined> {
    // let connection = await mysqlConnection();
    let connection = await mysqlPool();


    let links, info;
    try {
        links = await connection
            .query(`SELECT * FROM frclink_links WHERE team_num = ?`, teamNum)
            .then(([rows, fields]) => {
                return rows;
            });
        info = await connection
            .query(`SELECT * FROM frclink_info WHERE team_num = ? LIMIT 1`, teamNum)
            .then(([rows, fields]) => {
                return rows;
            });

    } catch (error) {
        console.error("we got an error!")
        console.log(error)
        return undefined;
    }

    // Return whatever exists. If info row exists but no links yet, we still want to show user-entered info.
    if (info.length === 0) {
        return undefined; // no info row means we truly have nothing stored
    }

    return { links, info };
}

export async function getTeamFromTBA(teamNum: number): Promise<Team | undefined> {
    if (!TBA_KEY) {
        console.error("TBA_KEY not set in environment. Set TBA_KEY in your .env file.");
        return undefined;
    }
    const path = `https://www.thebluealliance.com/api/v3/team/frc${teamNum}`;
    const json = await fetch(path, {
        method: "GET",
        headers: {
            "X-TBA-Auth-Key": TBA_KEY
        }
    }).then(res => res.json());

    console.log("TBA JSON", json);

    if (json.Error) {
        return error(404, "Team not found: " + json.Error);
    }

    const json_links = await fetch(path + "/social_media", {
        method: "GET",
        headers: {
            "X-TBA-Auth-Key": TBA_KEY
        }
    }).then(res => res.json());

    const stuff = {
        "facebook-profile": {
            name: "Facebook",
            url: "https://www.facebook.com/",
            icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F020%2F964%2F386%2Foriginal%2Ffacebook-circle-icon-for-web-design-free-png.png&f=1&nofb=1&ipt=8888f278e445a14d8cc21da16ff0667598481d17c53ed724b24634afee6775b4&ipo=images",
        },
        "github-profile": {
            name: "GitHub",
            url: "https://www.github.com/",
            icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic-00.iconduck.com%2Fassets.00%2Fgithub-icon-2048x2048-91rgqivh.png&f=1&nofb=1&ipt=5c842f4ec230f47f6ca5a6b41360b7ca6506a575212d7d72c95a62f126b713b3&ipo=images",
        },
        "instagram-profile": {
            name: "Instagram",
            url: "https://www.instagram.com/",
            icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreepngimg.com%2Fdownload%2Flogo%2F69768-logo-computer-layout-instagram-icons-png-file-hd.png&f=1&nofb=1&ipt=9314d88ade917343e7c9dce0e375d447c6f3288a8d1ee8bbbc93388724089a13&ipo=images",
        },
        "twitter-profile": {
            name: "Twitter",
            url: "https://www.twitter.com/",
            icon: "https://webstockreview.net/images/twitter-icons-png-1.png",
        },
        "youtube-channel": {
            name: "YouTube",
            url: "https://www.youtube.com/",
            icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F09%2FYouTube_full-color_icon_(2017).svg%2F2560px-YouTube_full-color_icon_(2017).svg.png&f=1&nofb=1&ipt=322d59662b32cb6e1a306b21ce32f17c1244dbe878adfcc53599b94e769ab60e&ipo=images",
        },
    };

    const githubIcon = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic-00.iconduck.com%2Fassets.00%2Fgithub-icon-2048x2048-91rgqivh.png&f=1&nofb=1&ipt=5c842f4ec230f47f6ca5a6b41360b7ca6506a575212d7d72c95a62f126b713b3&ipo=images";

    const links = json_links.map(link => {
        const data = stuff[link.type];
        let url: string;
        let icon: string;
        let title: string;
        let description: string;
        if (data) {
            url = data.url + link.foreign_key;
            icon = data.icon;
            title = data.name;
            description = "@" + link.foreign_key;
        } else {
            url = link.direct_url;
            icon = "";
            title = link.type;
            description = link.foreign_url;
        }
        // Fallback: if URL indicates a GitHub link but no icon assigned (non github-profile type)
        if (!icon && typeof url === 'string' && url.includes('github.com')) {
            icon = githubIcon;
            title = title === link.type ? 'GitHub' : title; // improve title if it's just the raw type
        }
        return { url, icon, title, description };
    });

    const year = new Date().getFullYear();

    const info = [{
        primary_color: "#fff",
        secondary_color: "#000",
        team_num: teamNum,
        team_full_name: json.nickname,
        pfp: `https://thebluealliance.com/avatar/${year}/frc${teamNum}.png`,
        description: `If you are an administrator or member of Team ${teamNum}, you can add links to this page by reaching out.`,
        location: json.city + ", " + json.state_prov + ", " + json.country,
    }];

    return {
        links,
        info,
    }
}