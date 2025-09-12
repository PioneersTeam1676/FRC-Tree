<script>
    import "@fortawesome/fontawesome-free/css/all.min.css";

    let { teamId } = $props();

    async function getTeamInfo(teamId) {
        return {
            teamName: "Pascack Pi-Oneers",
            founded: "2004",
            location: "Pascack Hills High School, New Jersey",
            awards: "1x Impact Award, 1x World Champions",
            logo: "https://team1676.com/main/wp-content/uploads/2021/08/Pacack-Pioneer-Logo-4-copy-1024x1024.png",
            banner: "https://team1676.com/main/wp-content/uploads/2024/02/team24-1-1024x312.jpg",
            links: [
                {
                    name: "<em>FRC</em> Tree",
                    description:
                        "A Linktree-adjacent app that serves as a directory for FRC teams to share their projects, websites, and other links.",
                    urls: [],
                },
                {
                    name: "AceIt",
                    description:
                        "AceIt is a reimagined study tool, among the likes of Quizlet and other flash card tools. It is a free and intelligent alternative to help students study for any kind of project.",
                    urls: [
                        {
                            url: "https://aceit.team1676.com/#/aceit/hubbeta",
                            name: "aceit.team1676.com",
                        },
                        {
                            url: "https://github.com/Team1676Pioneers/aceit",
                            name: "GitHub repository",
                        },
                    ],
                },
                {
                    name: "Team Website",
                    description: "The main page and blog for Team 1676",
                    urls: [
                        {
                            url: "https://team1676.com",
                            name: "team1676.com",
                        },
                    ],
                },
                {
                    name: "GitHub Organization",
                    description:
                        "The organization and list of repositories for our GitHub",
                    urls: [
                        {
                            url: "https://github.com/PioneersTeam1676",
                            name: "github.com",
                        },
                    ],
                },
            ],
        };
    }

    const teamInfo = getTeamInfo(teamId);
</script>

{#snippet link(name, description, urls)}
    <div class="link">
        <h3>{name}</h3>
        <p>{description}</p>
        <div class="urls">
            {#each urls as url}
                <a href={url.url}>{url.name}</a>
            {/each}
        </div>
    </div>
{/snippet}

<div class="content">
    {#await teamInfo}
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: center">
            <img class="loading" alt="Loading GIF" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wpfaster.org%2Fwp-content%2Fuploads%2F2013%2F06%2Floading-gif.gif&f=1&nofb=1&ipt=867bc5560f919a849b4beaa25c77e443c54ef9f4fde1eb5eb91dfc5e9d446522&ipo=images">
        </div>
    {:then teamInfo}
        <div class="title">
            <h2>Team {teamId}</h2>
            <h1>{teamInfo.teamName}</h1>

            <div>
                <i class="fa-solid fa-location-dot"></i>
                <span>{teamInfo.location}</span>
            </div>

            <div>
                <i class="fa-solid fa-award"></i>
                <span>{teamInfo.awards}</span>
            </div>
        </div>

        <div class="images">
            <img
                class="logo"
                src={teamInfo.logo}
                alt="Team {teamId} - {teamInfo.teamName} logo"
            />
            <img
                class="banner"
                src={teamInfo.banner}
                alt="Team {teamId} - {teamInfo.teamName} logo"
            />
        </div>

        {#each teamInfo.links as l}
            {@render link(l.name, l.description, l.urls)}
        {/each}
    {/await}
</div>

<style>

    .loading {
        width: calc(100% - 10px);
        height: var(width);
    }

    .logo {
        position: relative;
        max-width: 10%;
        z-index: 2;
        object-fit: cover;
    }

    .banner {
        width: 100%;
    }

    .title {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .content {
        background: var(--color-2);
        padding: 10px;
        border-radius: 5px;
        width: 400px;
        height: 600px;
        overflow: auto;
        border: 1.25px solid var(--color-0);
    }

    .link {
        background: var(--color-3);
        padding: 20px;
        border-radius: 5px;
        margin: 10px;
        border: 1.25px solid var(--color-1);
    }

    .urls {
        display: flex;
        width: 100%;
        justify-content: center;
        gap: 12.5px;
    }

    h1,
    h2,
    h3 {
        margin: 0;
    }
</style>
