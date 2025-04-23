<script>

    export let data;

    // console.log(data);

    import { onMount } from "svelte";
    import TeamGalleryEntry from "../../../TeamGalleryEntry.svelte";
    import { docTitle } from "$lib/frontendutil";

    docTitle("Search - " + data.query);

    /**
     * Returns a normalized value representing the similarity between two strings.
     * Used for searching and finding results for subreddit queries against the list.
     * @param {string} s1 The first string
     * @param {string} s2 The second string
     * @returns {number} The similarity, between 0.0 and 1.0
     */
    function similarity(s1, s2) {

        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        //if one contains the other, return 1
        if (s1.includes(s2) || s2.includes(s1)) {
            return 1.0;
        }

        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
        }
        return (
            (longerLength - editDistance(longer, shorter)) /
            parseFloat(longerLength)
        );
    }

    /**
     * Levenshtein distance between two strings. Helper function for `similarity(s1:string, s2:string)`.
     * @param {string} s1 The first string
     * @param {string} s2 The second string
     * @returns {number} The amount of edits between two strings. A non-negative integer.
     */
    function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i == 0) costs[j] = j;
                else
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }

            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    //pare the data so that it only includes items that are similar to the query
    let query = data.query;
    console.log(query);
    
    console.log(data.data.info);//

    // let newData = [];

    let similarityValue = 0;
    let newData = data.data.info.filter((item) => {
        similarityValue = similarity(JSON.stringify(item.team_num + item.team_full_name), query);
        console.log(similarityValue);
        return similarityValue > 0.5;
    });
    

    //if nothing is found and the query is a team number, link to a potential blue alliance page
    if (newData.length == 0 && !isNaN(query)) {
        newData = [
            {
                team_num: query,
                team_full_name: "(autofilled data)",
                pfp: "https://www.thebluealliance.com/avatar/2025/frc" + query + ".png",
            }
        ];
    }


</script>

<h1 class="result" id="result">Results for <i>"{query}"</i></h1>



<div class="main-container">
    <div class="container">
        {#each newData as item}
            <TeamGalleryEntry {...item} />
        {/each}
    </div>
</div>


<!-- <div class="main-container">
    <div class="container">
    {#each data.data.info as team}

        <div class="item">
            <img src="{team.pfp}" alt="Team Logo">
            <div class="text-grid">
                <p class="team-number">Team {team.team_num}</p>
                <p class="team-name">{team.description}</p>
            </div>    
        </div>

    {/each}

    </div>
</div> -->


<style>
    /* :root {
    --color1: #007acc;
    --color2: #3e3e42;
    --color3: #2d2d30;
    --color4: #252526;
    --color5: #1e1e1e;
} */

    :global(html) {color: var(--color2)}
    :global(body) {margin:0px; background: var(--color3);}

    .main-container {
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 20px;
        /*height: 100vh;*/ /* Optional: make it full height */
        }

    .container {
        display: flex;
        justify-content: center; /* Center items horizontally */
        flex-wrap: wrap;
        width: 100%;
        max-width: 100vw; /* Adjust as needed */
    }

    .result {  
        font-size: 20px;
    }

    /* .item {
        display: flex;
        align-items: center; 
        width: calc(25% - 50px);
        margin: 30px;
        background: var(--color2);
        border-radius: 5px;
        box-shadow: 0 0 5px 0px black;
        padding: 10px;
        cursor: pointer;
        transition: transform 0.2s ease; 
    }
    .item:hover {
        transform: scale(1.01); 
    }

    .item:active {
        transform: scale(0.99); 
    }


    .item img {
        width: 150px; 
        height: 150px; 
        margin-right: 10px;
        border-radius: 50%;
    }
    
    .text-grid h1, .text-grid h6 {
        margin: 0; 
        font-size: 22px;
        font-weight: bold;
        color: white;
        text-align: center; 
        }
        
    .text-grid {
        flex-direction: column;
        display: flex;
        width: 100%;
    } */
</style>