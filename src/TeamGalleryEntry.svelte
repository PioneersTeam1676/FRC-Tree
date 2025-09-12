<script lang="ts">
    import { onMount } from "svelte";

    let { team_num, pfp, description, secondary_col, team_full_name, primary_color } = $props();
    let btn: HTMLButtonElement;

    function goToTeam(team_num) {
        window.location.href = "../" + team_num;
    }

    onMount(async () => {
        // Ensure data is defined before accessing its properties
        if (team_num != undefined) {
            btn.style.setProperty('box-shadow', "0 0 10px 0px "+secondary_col);
            btn.style.setProperty('border-color', secondary_col);
        }
    });
//  

</script>

<button bind:this={btn} type="button" id="team{team_num}-image" class="item" onclick={() => goToTeam(team_num)} aria-label="Go to team {team_num}">
    <img class="pfp" src={pfp} alt="Team Logo" />
    <div class="text-grid">
        <p class="team-number">Team {team_num}</p>
        <p class="team-name">{team_full_name}</p>
    </div>
</button>

<style>
    .item {
        display: flex;
        align-items: center; /* Center vertically */
        width: calc(25% - 50px); /* 4 items per row with some margin */
        margin: 30px; /* Space between items */
        background: var(--color2);
        border-radius: 5px;
        box-shadow: 0 0 5px 0px black;
        padding: 10px;
        cursor: pointer;
        transition: transform 0.2s ease; /* Smooth transition for scaling */
        border: 2px solid;
        height: 200px; /* Fixed height for all items */
    }
    .item:hover {
        transform: scale(1.01); /* Enlarge the button on hover */
    }

    .item:active {
        transform: scale(0.99); /* Slightly shrink the button */
    }

    .item img {
        width: 150px; /* Adjust image size as needed */
        height: 150px; /* Adjust image size as needed */
        margin-right: 10px; /* Space between image and text */
        border-radius: 50%; /* Make it a circle */

        object-fit: cover;
    }

    .team-number {
        margin: 0; /* Remove default margin */
        font-size: 2em;
        font-weight: bold;
        color: white;
        text-align: center; /* Center the text horizontally */
    }

    .team-name {
        font-size: 1.5em;
        color: white;
        text-align: center;
    }

    .text-grid {
        flex-direction: column;
        display: flex;
        width: 100%;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
    }
    .card:hover { border-color: var(--border-medium); box-shadow: var(--shadow-md); }


    /* Responsive design */
    @media (max-width: 1200px) {
        .item {
            width: calc(33.33% - 50px); /* 3 items per row */
        }
    }
    @media (max-width: 950px) {
        .item {
            width: calc(60% - 50px); /* 2 items per row */
        }
    }
    @media (max-width: 600px) {
        .item {
            width: calc(100% - 50px); /* 1 item per row */
        }
        .item img {
            width: 100px; /* Adjust image size for smaller screens */
            height: 100px; /* Adjust image size for smaller screens */
        }
    }


</style>