<script>
    import { docTitle } from "$lib/frontendutil";


    import TeamGalleryEntry from "../../TeamGalleryEntry.svelte";

    // SvelteKit pages receive a single `data` prop containing what load returns
    export let data;
    const gallery = data?.info ?? [];
    const loadError = data?.loadError;

    docTitle("Gallery");

    // Removed debug logs that produced 'undefined' noise in console when empty

    function goToTeam(team_num) {
        window.location.href = "../" + team_num;
    }
</script>

<div class="main-container">
    {#if loadError}
        <div class="error-banner">{loadError}</div>
    {/if}
    <div class="container">
        {#if gallery.length === 0}
            <div class="empty">No teams found yet.</div>
        {:else}
            {#each gallery as team}
                <TeamGalleryEntry {...team} />
            {/each}
        {/if}
    </div>
    <div class="gallery-foot-note">If a team is missing, ask them to create a profile.</div>
</div>

<style>
    /* :root {
        --color1: #007acc;
        --color2: #3e3e42;
        --color3: #2d2d30;
        --color4: #252526;
    } */

    :global(html) {color: var(--color2)}
    :global(body) {margin:0px; background: var(--color3);}

    .main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 20px;
        /*height: 100vh;*/ /* Optional: make it full height */
        }

    .container {
        width: 100%;
        display: grid;
        gap: clamp(.75rem, 2vw, 1.25rem);
        /* Enforce exactly 3 columns on sufficiently wide viewports; degrade to 2/1 with media queries below */
        grid-template-columns: repeat(3, 1fr);
        align-items: stretch;
        justify-items: center;
        padding: 0;
    }

    /* 2 columns for medium screens */
    @media (max-width: 1100px) {
        .container { grid-template-columns: repeat(2, 1fr); }
    }
    /* 1 column for small screens */
    @media (max-width: 640px) {
        .container { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
        .main-container { padding: 12px; }
    }

    .gallery-foot-note { margin-top: 1.25rem; font-size: .7rem; opacity: .65; text-align: center; max-width: 480px; }

    .empty { grid-column: 1 / -1; padding: 2rem 1rem; text-align: center; font-size: .9rem; opacity: .7; }
    .error-banner { width:100%; background: linear-gradient(90deg, #ef4444, #b91c1c); color:#fff; padding:.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size:.8rem; box-shadow: var(--shadow-md); }

    .main-container {
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 20px;
        /*height: 100vh;*/ /* Optional: make it full height */
    }
</style>
