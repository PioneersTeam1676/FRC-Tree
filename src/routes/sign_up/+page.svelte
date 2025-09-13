<script>
    import { post } from "$lib/apis";
    import { docTitle, validatePasswordComplexity } from "$lib/frontendutil";
    import { toast } from "svelte-hot-french-toast";

    docTitle("Sign Up");

    let step = $state(1); // 1=team,2=email,3=password,4=done
    let team_num = $state("");
    let email = $state("");
    let password = $state("");
    let showPassword = $state(false);
    let busy = $state(false);

    function validTeam() {
        const n = Number(team_num);
        return Number.isSafeInteger(n) && n > 0;
    }
    function validEmail() {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validPassword() { return validatePasswordComplexity(password).valid; }
    function passwordIssues() { return validatePasswordComplexity(password).issues; }

    function next() {
        if (step === 1 && !validTeam()) return;
        if (step === 2 && !validEmail()) return;
        if (step === 3 && !validPassword()) return;
        step++;
        if (step === 4) submitWrapper();
    }
    function back() { if (step > 1 && !busy) step--; }

    async function submit() {
        busy = true;
        const res = await post("/sign_up/create", { team_num: Number(team_num), email, password });
        busy = false;
        if (res.isSuccess()) {
            step = 4;
            setTimeout(() => window.location.href = "/sign_in", 900);
        } else {
            throw new Error(res.message);
        }
    }

    function submitWrapper() {
        toast.promise(
            submit(),
            {
                loading: "Creating account...",
                success: "Account created! Redirecting...",
                error: (e) => e?.message || "Failed to sign up"
            }
        );
    }
</script>

<div class="signup-wrapper">
    <div class="card signup-card">
        <div class="steps-bar">
            {#each [1,2,3] as s}
                <div class="step {step>=s ? 'active' : ''} {step===s ? 'current' : ''}">
                    <div class="circle">{s}</div>
                    <div class="label">{s===1 ? 'Team' : s===2 ? 'Email' : 'Password'}</div>
                </div>
            {/each}
        </div>

        {#if step === 1}
            <div class="pane">
                <h1>Create Your Account</h1>
                <p class="helper">Enter your FRC team number</p>
                <div class="field">
                    <label for="team_num">Team Number</label>
                    <input id="team_num" type="number" bind:value={team_num} placeholder="1676" />
                    {#if team_num !== '' && !validTeam()}<div class="error-text">Enter a positive whole number</div>{/if}
                </div>
                <div class="actions">
                    <button class="btn btn-primary" disabled={!validTeam()} onclick={next}>Next</button>
                </div>
            </div>
        {:else if step === 2}
            <div class="pane">
                <h1>Team {team_num}</h1>
                <p class="helper">Use a contact email</p>
                <div class="field">
                    <label for="email">Email</label>
                    <input id="email" type="email" bind:value={email} placeholder="you@example.com" />
                    {#if email !== '' && !validEmail()}<div class="error-text">Enter a valid email address</div>{/if}
                </div>
                <div class="actions">
                    <button class="btn" onclick={back}>Back</button>
                    <button class="btn btn-primary" disabled={!validEmail()} onclick={next}>Next</button>
                </div>
            </div>
        {:else if step === 3}
            <div class="pane">
                <h1>Secure Account</h1>
                <p class="helper">Password must be at least 8 characters and contain two of: uppercase, number, special</p>
                <div class="field">
                    <label for="password">Password</label>
                    <div class="password-wrapper">
                        <input id="password" type={showPassword ? 'text' : 'password'} bind:value={password} placeholder="••••••••" />
                        <button type="button" class="toggle" onclick={() => showPassword=!showPassword}>{showPassword? 'Hide':'Show'}</button>
                    </div>
                    {#if password !== '' && !validPassword()}
                        <ul class="pw-issues">
                            {#each passwordIssues() as issue}
                                <li>{issue}</li>
                            {/each}
                        </ul>
                    {/if}
                </div>
                <div class="actions">
                    <button class="btn" onclick={back}>Back</button>
                    <button class="btn btn-primary" disabled={!validPassword() || busy} onclick={next}>{busy? 'Working...' : 'Create Account'}</button>
                </div>
            </div>
        {:else if step === 4}
            <div class="pane center">
                <h1>Success!</h1>
                <p class="helper">Redirecting to sign in...</p>
            </div>
        {/if}

        <div class="foot-note">Already have an account? <a href="/sign_in">Sign in</a></div>
    </div>
</div>

<style>
    .signup-wrapper { display: flex; justify-content: center; padding: clamp(2rem,5vw,4rem); }
    .signup-card { width: min(520px, 100%); }
    .steps-bar { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .step { text-align: center; flex:1; position: relative; }
    .step:not(:last-child):after { content:""; position:absolute; top:16px; right:-50%; width:100%; height:2px; background: var(--border-light); }
    .step.active:not(:last-child):after { background: var(--primary); }
    .circle { width:32px; height:32px; margin:0 auto .4rem; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.9rem; background: var(--bg-secondary); border:1px solid var(--border-light); }
    .step.active .circle { background: var(--primary); color:#fff; border-color: var(--primary); box-shadow: var(--shadow-glow); }
    .step.current .circle { box-shadow: 0 0 0 4px rgba(0,195,255,0.25); }
    .label { font-size:.65rem; letter-spacing:.5px; text-transform:uppercase; color: var(--text-muted); }
    .step.active .label { color: var(--text-secondary); }
    .pane { animation: fade .25s ease; }
    .pane h1 { margin:0 0 .5rem; font-size:1.6rem; }
    .pane .helper { margin:0 0 1.25rem; font-size:.85rem; color: var(--text-muted); }
    .field { display:flex; flex-direction:column; gap:.4rem; margin-bottom:1.25rem; }
    .field input { width:100%; }
    .actions { display:flex; gap:.75rem; justify-content:flex-end; }
    .password-wrapper { position: relative; display:flex; }
    .password-wrapper input { flex:1; padding-right:80px; }
    .password-wrapper .toggle { position:absolute; right:6px; top:50%; transform:translateY(-50%); background: var(--bg-secondary); border:1px solid var(--border-light); padding:4px 10px; border-radius: var(--radius-sm); cursor:pointer; font-size:.75rem; }
    .password-wrapper .toggle:hover { border-color: var(--border-medium); }
    .foot-note { margin-top:1.5rem; text-align:center; font-size:.75rem; color: var(--text-muted); }
    .foot-note a { color: var(--primary); }
    .center { text-align:center; }
    .error-text { color: var(--danger, #ff5b5b); font-size:.7rem; margin-top:.15rem; }
    .pw-issues { margin:.4rem 0 0; padding-left:1rem; color: var(--danger, #ff5b5b); font-size:.65rem; line-height:1.2; }
    .pw-issues li { list-style: disc; }
    @keyframes fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0);} }
</style>