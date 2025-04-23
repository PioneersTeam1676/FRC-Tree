<script>
    export let data;
    import { onMount } from 'svelte';
    import { docTitle, isWhite } from '$lib/frontendutil';
    import "@fortawesome/fontawesome-free/css/all.min.css";

    let loaded = false;
    let team = null;

    docTitle("Team " + data.data.info[0].team_num);

    //if the primary or secondary color is blank then set to white and black
    if (data.data.info[0].primary_col == "" || data.data.info[0].primary_col == null || data.data.info[0].primary_col == undefined) {
        data.data.info[0].primary_col = "#FFFFFF";
    }
    if (data.data.info[0].secondary_col == "" || data.data.info[0].secondary_col == null || data.data.info[0].secondary_col == undefined) {
        data.data.info[0].secondary_col = "#000000";
    }

    const primIsWhite = isWhite(data.data.info[0].primary_col);
    const secIsWhite = isWhite(data.data.info[0].secondary_col);

    onMount(async () => {
        // Ensure data is defined before accessing its properties
        if (data?.data?.info?.[0]) {
            document.documentElement.style.setProperty('--primary-col', data.data.info[0].primary_col);
            document.documentElement.style.setProperty('--secondary-col', data.data.info[0].secondary_col);
            loaded = true;
        }
    });

    
</script>

{#if loaded == false}
<h1>Loading...</h1>
{:else}
    <div class="main">
        <div class="pfp-div">
            <h1>Team {data.data.info[0].team_num}</h1>
            <h2>{data.data.info[0].team_full_name}</h2>
            <p><i class="fa-solid fa-location-dot"></i>&nbsp;{data.data.info[0].location}</p>
            <img class="pfp" src="{data.data.info[0].pfp}" alt="pfp not found" />
            <p class="description">{data.data.info[0].description}</p>
            {#if data.data.autofilled}
                <i class="description">Team Information autofilled</i>
            {/if}
        </div>

        <div class="all-links">
            {#each data.data.links as link}
                <!-- <a href="{link.url}" target="_blank"> -->
                    <button class="tree-buttons" onclick={() => { window.open(link.url, "_blank").focus(); }}>
                        <div class="tree-container">
                            <img class="button-logo" src="{link.icon}" alt="button logo">
                            <div class="link-content">
                                <p style="color: {primIsWhite ? "black" : "white"}" class="tree-header">{link.title}</p>
                                <p style="color: {primIsWhite ? "black" : "white"}" class="bg-info">{link.description}</p>
                            </div>
                        </div>
                    </button>
                <!-- </a> -->
            {/each}
        </div>
    </div>
{/if}

<style>
    /* :root {
        --color1: #007acc;
        --color2: #3e3e42;
        --color3: #2d2d30;
        --color4: #252526;
        --color5: #1e1e1e;
        --primary-col: #3E7B27;
        --secondary-col: #85A947;
    } */
    
    :global(html) {color: var(--color2);}
    :global(body) {margin:0px; background: var(--color3);}
    

    .main {
        display: grid;
        margin: 0px;
        width: 100%;
        min-height: 100%;
        /* background: var(--secondary-col); */
    }

    .description {
        font-family: 'Helvetica', 'Arial', sans-serif;
        color: white;
        width: 40%;
        margin: auto;
        text-align: center;
        padding: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
    }


    .pfp-div {
        margin-top: 10vh;
        text-align: center;
    }

    .pfp {
        width: 200px;
        height: 200px;
        border-radius: 10px;
        object-fit: cover;
    }

  

    .all-links {
        display: flex;
        flex-direction: column;
        margin: auto;
        gap: 15px; /* Reduced gap for smaller spacing */
        width: 50%; /* Adjusted width for responsiveness */
        max-width: 600px; /* Limit the maximum width */
    }

    .tree-buttons {
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease;
        background: none;
        width: 100%; /* Make buttons take full width of the container */
    }

    .tree-buttons:hover {
        transform: scale(1.01);
    }

    .tree-buttons:active {
        transform: scale(0.99);
    }

    .tree-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: var(--primary-col);
        border-radius: 0.5em; /* Slightly smaller border radius */
        box-shadow: 0 0 8px 1px var(--secondary-col); /* Reduced shadow size */
        padding: 10px; /* Add padding for better spacing */
    }

    .button-logo {
        width: 60px; /* Smaller logo size */
        height: 60px;
        border-radius: 5px;
        padding: 5px;
        object-fit: contain;
    }

    .link-content {
        margin-left: 10px; /* Add spacing between logo and text */
        flex: 1; /* Allow text to take up remaining space */
    }

    .tree-header {
        color: white;
        font-family: 'Helvetica', 'Arial', sans-serif;
        font-weight: bold;
        font-size: 1.5em; /* Smaller font size */
        margin: 0;
    }

    .bg-info {
        margin-top: 0.5vh;
        color: white;
        font-family: 'Helvetica', 'Arial', sans-serif;
        font-size: 1.2em; /* Smaller font size */
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {

        .main {
            padding: 0px;
            padding-bottom: 20px;
        }

        .description {
            width: 80%; /* Full width on smaller screens */
            font-size: 0.9em; /* Adjust font size */
        }

        .all-links {
            width: 50%; /* Full width on smaller screens */
        }

        .tree-container {
            flex-direction: column; /* Stack content vertically */
            align-items: center;
            padding: 15px; /* Increase padding for better spacing */
        }

        .button-logo {
            width: 50px; /* Adjust logo size for smaller screens */
            height: 50px;
        }

        .tree-header {
            font-size: 1em; /* Adjust font size */
        }

        .bg-info {
            font-size: 0.8em; /* Adjust font size */
        }
    }
 
</style>