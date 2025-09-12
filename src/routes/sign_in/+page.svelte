<script>
    import { post } from "$lib/apis";
    import { docTitle } from "$lib/frontendutil";
    import { toast } from "svelte-hot-french-toast";

    let identifier = $state("");
    let password = $state("");
    let showPassword = $state(false);

    docTitle("Sign In");

    async function submit() {
        const res = await post("/sign_in/create", {
            identifier,
            password
        });
        if (res.isSuccess()) {
            window.location.href = "/";
        } else {
            alert("Error: " + res.message);
        }
    }

    function submitWrapper() {
        toast.promise(
            submit(),
            {
                loading: "Signing in...",
                success: "Signed in successfully",
                error: "Failed to sign in"
            }
        )
    }
</script>

<div class="main">
    <div class="form">
        <h1>Sign In</h1>
        <p class="helper">Use your email or team number</p>
        <div class="input-group column">
            <label for="identifier">Email or Team Number</label>
            <input bind:value={identifier} id="identifier" type="text" placeholder="you@example.com or 1676" />
        </div>

        <div class="input-group column">
            <label for="password">Password</label>
            <div class="password-wrapper">
                <input bind:value={password} id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                <button type="button" class="toggle" onclick={() => showPassword = !showPassword}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
        </div>
        <button id="submit" class="btn btn-primary full" onclick={submitWrapper}>Sign In</button>
        <a class="alt" href="/sign_up">Need an account? Create one</a>
    </div>
</div>

<style>
    .main {
        margin: auto;
        width: 100%;
        height: 100%;
    }

    h1 {
        font-size: 2.5em;
        margin-bottom: 20px;
    }

    label { font-size: .9rem; font-weight: var(--font-weight-medium); }
    input { font-size: 1rem; }
    button { font-size: 1rem; }

    .form {
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        width: min-content;
        text-align: center;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid var(--border-light);
        background-color: var(--bg-card);
        color: var(--text-secondary);
        box-shadow: var(--shadow-md);
    }

    .input-group { width: 100%; }
    .input-group.column { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1rem; }
    .password-wrapper { position: relative; display: flex; }
    .password-wrapper input { flex: 1; padding-right: 80px; }
    .password-wrapper .toggle { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: var(--bg-secondary); border: 1px solid var(--border-light); padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; font-size: .75rem; }
    .password-wrapper .toggle:hover { border-color: var(--border-medium); }
    h1 { margin-bottom: .5rem; }
    .helper { margin-top: 0; margin-bottom: 1.25rem; color: var(--text-muted); font-size: .85rem; }
    .full { width: 100%; }
    .alt { display: block; margin-top: 1rem; font-size: .8rem; color: var(--text-muted); text-align: center; }
</style>
