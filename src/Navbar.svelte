<script>
    let { loggedIn, loggedInAs } = $props();
    import logo from "$lib/assets/LinkTreeLogo-02.png";

    import { onMount } from "svelte";
    onMount(() => {
        document.title = "FRTree";
    });

    function search(event) {
        if (event.key === "Enter") {
            console.log(event.target.value);
            window.location.href = `/search/${event.target.value}`;
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


onMount(() => {
    window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
    }
}
})



</script>

<div class="header">
    <a href="/"><img class="logo-img" src={logo} alt="logo" /></a>
    <a href="/"><div class="header-title font">FRTree</div></a>
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
        <button class="btn btn-1 font show-on-small-screen dropbtn" onclick={() => {dropMenuDown()}}>Menu</button>
        <div class="dropdown">
            <div id="myDropdown" class="dropdown-content show-on-small-screen {show ? "show" : ""}">
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
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2Fa%2FAGF-l7-mM82_wzV3-rb20GXvq8nDm-8dFzEYPBY9%3Ds900-c-k-c0xffffffff-no-rj-mo&f=1&nofb=1&ipt=258c65eef72ceda28dcc447625cfa9c935e781108d34fd1d1affe361e8c6aa90&ipo=images"
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
        align-items: center; /* Center vertically */
        width: 100vw;
        height: 10vh;
        /* background: linear-gradient(135deg, var(--color2) 0%, var(--color5) 100%) !important; */
        background: var(--color4);
        position: relative;
        /*overflow: hidden;*/
        position: sticky; 
        top: 0; 
        z-index: 1000;
    }

    /* .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 30%, rgba(0, 195, 255, 0.05) 40%, rgba(0, 195, 255, 0.05) 60%, transparent 70%);
        background-size: 200% 200%;
        animation: shimmer 10s infinite linear;
        pointer-events: none;
    } */

    /* @keyframes shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: -100% 0; }
    } */

    .logo-img {
        margin-left: 0.7vw;
        height: 60px;
    }

    .header-pfp {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        margin-right: 1vw;
    }

    /* Custom search styling with inline gradient underline */
    .custom-search-container {
        position: relative;
        margin: 0 1rem;
        min-width: 200px;
    }

    .custom-search-input {
        width: 100%;
        padding: 8px 12px;
        background: rgba(10, 17, 40, 0.5);
        color: white;
        border: none;
        border-radius: 4px;
        outline: none;
        font-size: 1em;
    }

    .search-underline {
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        height: 2px;
        width: 0;
        background: linear-gradient(to right, transparent, var(--color1), transparent);
        border-radius: 3px;
        transition: all 0.3s ease;
    }

    .custom-search-input:focus + .search-underline {
        width: 100%;
        height: 3px;
        box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
        animation: pulsateSearch 2s infinite alternate;
    }

    .custom-search-container:hover .search-underline {
        width: 80%;
    }

    .custom-search-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .custom-search-input:focus::placeholder {
        color: rgba(0, 195, 255, 0.7);
    }

    @keyframes pulsateSearch {
        0% { opacity: 0.7; box-shadow: 0 0 5px rgba(0, 195, 255, 0.3); }
        100% { opacity: 1; box-shadow: 0 0 15px rgba(0, 195, 255, 0.5); }
    }

    :global(html),
    :global(body) {
        margin: 0;
        width: 100%;
        height: 100%;
    }

    a {
        color: black;
        text-decoration: none;
    }

    .header-pfp {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        margin-right: 1vw;
    }

    .header-title {
        padding-left: 10px;
        font-size: 2em;
        color: var(--color1);
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
            background-color: #007acc;
            min-width: 85px; /* You can set this to match the button width */
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 10;
            left: -90px; /* Align with the left edge of the button */
            top: 20px; /* Position it directly below the button */
            margin: 3px;
            border-radius: 5px;
        }

        .dropdown-content a {
            color: white !important;
        }

        .dropdown-content hr {
            margin: 0px;
        }

        /* Links inside the dropdown */
            .dropdown-content a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }

        /* Change color of dropdown links on hover */
        .dropdown-content a:hover {background-color: #ddd;}

        /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
        .show {display:block;}
    }
</style>
