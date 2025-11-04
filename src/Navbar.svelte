<script>
    let { loggedIn, loggedInAs } = $props();
    import logo from "$lib/assets/LinkTreeLogo-02.png";
    import piSmall from "$lib/assets/pi-small.png";

    import { onMount } from "svelte";
    onMount(() => {
        document.title = "<em>FRC</em> Tree";
    });

    function search(event) {
        if (event.key === "Enter") {
            const val = event.target.value?.trim();
            if (val) window.location.href = `/search/${encodeURIComponent(val)}`;
        }
    }

    function signout() {
        fetch('/sign_out').then(() => {
            window.location.href = "/";
        });
    }

    let show = $state(false);

    function dropMenuDown() {
        show = !show;
    }


    // Close menu when clicking outside (more scoped & accessible)
    onMount(() => {
        const handler = (e) => {
            const dropdown = document.getElementById('mobile-menu');
            const toggle = document.getElementById('mobile-menu-toggle');
            if (!dropdown || !toggle) return;
            if (show && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
                show = false;
            }
        };
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    });



</script>

<div class="header">
    <a href="/"><img class="logo-img" src={logo} alt="logo" /></a>
    <a href="/"><div class="header-title font"><em>FRC</em> Tree</div></a>
    <div class="custom-search-container hide-on-small-screen">
        <input 
            type="search" 
            placeholder="Search teams..." 
            onkeydown={search}
            class="custom-search-input"
        />
        <div class="search-underline"></div>
    </div>
    <div class="button-container">
        <a href="/gallery"><button class="btn btn-1 font hide-on-small-screen">Gallery</button></a>
        <button id="mobile-menu-toggle" aria-haspopup="true" aria-expanded={show} aria-controls="mobile-menu" class="btn btn-1 font show-on-small-screen dropbtn" onclick={() => {dropMenuDown()}}>Menu</button>
        <div class="dropdown">
            <div id="mobile-menu" class="dropdown-content show-on-small-screen {show ? "show" : ""}" role="menu">
                <a href="/gallery" class="show-on-small-screen">Gallery</a>
                <hr>
                <a href="/sign_up" class="show-on-small-screen">Sign Up</a>
                <hr>
                <a href="/sign_in" class="show-on-small-screen">Sign In</a>
            </div>
        </div>    


        {#if loggedIn}
            <a href="/{loggedInAs}"><button class="btn btn-1 font">Preview</button></a>
            <a href="/{loggedInAs}/editor"><button class="btn btn-1 font">Editor</button></a>
            <button onclick={signout} class="btn btn-1-outline font">Log Out</button>
        {:else}
            <a href="/sign_up"><button class="btn btn-1 font hide-on-small-screen">Sign Up</button></a>
            <a href="/sign_in"><button class="btn btn-1 font hide-on-small-screen">Sign In</button></a>
        {/if}

        <a href="https://team1676.com"
            ><img
                class="header-pfp"
                src={piSmall}
                alt="profile pic"
            /></a
        >
    </div>
</div>

<style>

    /* Font */
    .font {
        font-family:
            Helvetica Neue,
            Helvetica,
            Arial,
            sans-serif;
    }

    .header {
        display: flex;
        align-items: center;
        width: 100%;
        height: 70px;
        background: var(--bg-card);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-light);
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: 0 var(--space-lg);
    }

    .logo-img {
        height: 40px;
        margin-right: var(--space-sm);
    }

    .header-pfp {
        height: 40px;
        width: 40px;
        border-radius: var(--radius-full);
        border: 2px solid var(--border-light);
        transition: border-color 0.2s ease;
    }

    .header-pfp:hover {
        border-color: var(--primary);
    }

    /* Search styling */
    .custom-search-container {
        flex: 1;
        max-width: 400px;
        margin: 0 var(--space-lg);
    }

    .custom-search-input {
        width: 100%;
        padding: var(--space-sm) var(--space-md);
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        outline: none;
        font-size: 0.875rem;
        transition: all 0.2s ease;
    }

    .custom-search-input:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(0, 195, 255, 0.1);
    }

    .custom-search-input::placeholder {
        color: var(--text-muted);
    }

    :global(html),
    :global(body) {
        margin: 0;
        width: 100%;
        height: 100%;
    }

    a {
        color: var(--text-primary);
        text-decoration: none;
    }



    .header-title {
        font-size: 1.5rem;
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
    }

    .header-title em {
        color: var(--primary);
        font-style: italic;
    }

    .show-on-small-screen {
        display: none;
    }

    @media screen and (max-width: 720px) {
        .hide-on-small-screen {
            display: none;
        }

        .show-on-small-screen{
            display: block;
        }
        
        .dropdown {
            position: relative;
            display: inline-block;
            /* z-index: 10; */
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            min-width: 150px;
            z-index: 10;
            right: 0;
            top: 100%;
            margin-top: var(--space-xs);
        }

        .dropdown-content hr {
            margin: 0;
            border: none;
            border-top: 1px solid var(--border-light);
        }

        /* Links inside the dropdown */
        .dropdown-content a {
            color: var(--text-primary);
            padding: var(--space-md) var(--space-lg);
            text-decoration: none;
            display: block;
            font-size: 0.95rem;
            letter-spacing: .25px;
            transition: background-color 0.15s ease, color 0.15s ease;
        }

        /* Change color of dropdown links on hover */
        .dropdown-content a:hover, .dropdown-content a:focus {
            background-color: var(--bg-tertiary);
            outline: none;
        }

        /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
        .show {display:block;}
    }
</style>
