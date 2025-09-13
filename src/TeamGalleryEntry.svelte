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

<button
    bind:this={btn}
    type="button"
    id="team{team_num}-tile"
    class="item"
    onclick={() => goToTeam(team_num)}
    aria-label="Go to team {team_num} profile"
>
    <div class="media">
        <img class="pfp" src={pfp} alt="Team {team_num} logo" />
    </div>
    <div class="text">
        <p class="team-number">Team {team_num}</p>
        <p class="team-name" title={team_full_name}>{team_full_name}</p>
    </div>
</button>

<style>
    .item {
        position: relative;
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 1rem;
        width: 100%;
        background: var(--bg-card);
        border: 1.5px solid var(--border-light);
        border-radius: var(--radius-lg);
        padding: 1rem 1.25rem;
        cursor: pointer;
        text-align: left;
        transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
        box-shadow: var(--shadow-sm);
        min-height: 170px;
    }
    .item:hover {
        border-color: var(--border-medium);
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
    }
    .item:active { transform: translateY(0); box-shadow: var(--shadow-sm); }
    .item:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 3px;
    }

    .media { display:flex; align-items:center; justify-content:center; }
    .item img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 3px var(--border-light);
        transition: box-shadow .25s ease;
    }
    .item:hover img { box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 3px var(--primary); }

    .text { display:flex; flex-direction:column; justify-content:center; min-width:0; }
    .team-number { margin:0 0 .25rem 0; font-size:1.15rem; font-weight:600; color: var(--text-primary); letter-spacing:.5px; }
    .team-name { margin:0; font-size:.9rem; line-height:1.2; color: var(--text-muted); overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:3; line-clamp:3; -webkit-box-orient:vertical; }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
    }
    .card:hover { border-color: var(--border-medium); box-shadow: var(--shadow-md); }


    /* Responsive design */
    @media (max-width: 900px) {
        .item { grid-template-columns: 110px 1fr; padding: .85rem 1rem; }
        .item img { width: 100px; height: 100px; }
    }
    @media (max-width: 560px) {
        .item { grid-template-columns: 80px 1fr; }
        .item img { width: 70px; height: 70px; }
        .team-number { font-size:1rem; }
    .team-name { font-size:.8rem; -webkit-line-clamp:4; line-clamp:4; }
    }


</style>