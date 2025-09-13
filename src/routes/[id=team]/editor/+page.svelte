<script>
    import { onMount } from "svelte";
    import { post } from "$lib/apis";
    import { docTitle, isWhite } from "$lib/frontendutil";
    import { toast } from "svelte-hot-french-toast";
    
    let { data, teamNum } = $props();
    
    let formData = $state({
        team_full_name: null,
        pfp: null,
        description: null,
        primary_col: null,
        secondary_col: null,
        location: null,
        team_num: null
    });
    let links = $state([]);
    let deletedIds = $state([]);
    
    
    let loaded = $state(false);
    
        async function load() {
            // Use provided info if present; otherwise initialize defaults so the editor isn't blank
            if (data?.data?.info?.[0]) {
                formData = { ...data.data.info[0] };
            } else {
                formData = {
                    team_full_name: "",
                    pfp: "",
                    description: "",
                    primary_col: "#00c3ff",
                    secondary_col: "#111111",
                    location: "",
                    team_num: teamNum ?? null
                };
            }

            // Load links (fallback to empty array)
            links = Array.isArray(data?.data?.links) ? data.data.links.map(l => ({ ...l })) : [];

            // Ensure team_num is set from props if missing
            if (!formData.team_num && teamNum) {
                formData.team_num = teamNum;
            }

            loaded = true;
            docTitle(`Editor (Team ${formData.team_num ?? "?"})`);

            let colorPreviewPrimary = document.getElementById("primary_preview");
            let colorPreviewSecondary = document.getElementById("secondary_preview");
            let colorInputPrimary = document.getElementById("primary_color");
            let colorInputSecondary = document.getElementById("secondary_color");

            const p = () => {
                if (!colorPreviewPrimary) return;
                colorPreviewPrimary.innerText = formData.primary_col;
                colorPreviewPrimary.style.backgroundColor = formData.primary_col;
                colorPreviewPrimary.style.color = isWhite(formData.primary_col) ? "black" : "white";
            };

            const s = () => {
                if (!colorPreviewSecondary) return;
                colorPreviewSecondary.innerText = formData.secondary_col;
                colorPreviewSecondary.style.backgroundColor = formData.secondary_col;
                colorPreviewSecondary.style.color = isWhite(formData.secondary_col) ? "black" : "white";
            };

            colorInputPrimary && colorInputPrimary.addEventListener("input", p);
            colorInputSecondary && colorInputSecondary.addEventListener("input", s);

            p();
            s();
        }

    onMount(async () => {
        toast.promise(load(), {
            loading: "Loading data...",
            success: "Data loaded successfully",
            error: "Failed to load data"
        });
    });

    // --- Icon Presets ------------------------------------------------------
    const PRESET_ICONS = [
        { key: 'youtube', label: 'YouTube', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg' },
        { key: 'instagram', label: 'Instagram', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
        { key: 'twitter', label: 'Twitter / X', icon: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png' },
        { key: 'facebook', label: 'Facebook', icon: 'https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico' },
        { key: 'github', label: 'GitHub', icon: 'https://github.githubassets.com/favicons/favicon.png' }
    ];

    function ensureLinkDefaults(link) {
        if (!link) return link;
        if (!link.icon_mode) link.icon_mode = link.icon ? 'custom' : 'preset';
        if (!link.icon_key) link.icon_key = 'youtube';
        if (link.icon_mode === 'preset') {
            const preset = PRESET_ICONS.find(p => p.key === link.icon_key) || PRESET_ICONS[0];
            link.icon = preset.icon;
        } else if (link.icon_mode === 'custom') {
            if (link.custom_icon) link.icon = link.custom_icon;
        }
        return link;
    }

    function addLink() {
        links = [...links, ensureLinkDefaults({ id: undefined, title: "", description: "", url: "", icon: "", icon_mode: 'preset', icon_key: 'youtube', custom_icon: '' })];
    }

    // Override load link mapping with normalization (replaces earlier mapping)
    // NOTE: we reassign inside load after data fetch; easiest by monkey patching load result handler
    const _origLoad = load;
    load = async function() {
        await _origLoad();
        links = links.map(l => ensureLinkDefaults(l));
    }

    // Adjust save to only send required fields to server (strip editor-only metadata)
    async function save() {
        const cleanedLinks = links.map(l => ({ id: l.id, title: l.title, description: l.description, url: l.url, icon: ensureLinkDefaults(l).icon }));
        const payload = { ...formData, links: cleanedLinks, deletedIds };
        toast.promise(
            (async () => {
                const res = await post(window.location.pathname, payload);
                if (res.isSuccess()) {
                    if (res.data?.info?.[0]) {
                        formData = { ...res.data.info[0] };
                    }
                    if (Array.isArray(res.data?.links)) {
                        links = res.data.links.map(l => ensureLinkDefaults({ ...l, custom_icon: '' }));
                        deletedIds = [];
                    }
                } else {
                    throw new Error(res.message || 'Save failed');
                }
                return res;
            })(),
            {
                loading: "Saving changes...",
                success: "Changes saved successfully",
                error: (e) => e?.message || "Failed to save changes"
            }
        );
    }

    async function clear() {

    }

</script>

<div class="main" style:display={loaded ? "block" : "none"}>
    <h1>Edit page for team {formData.team_num}</h1>
    {#if data.data.isAdmin}
        <h2>YOU ARE ADMIN.</h2>
    {/if}

    <form>
        <div class="input-group">
            <label for="team_full_name">Team Full Name</label>
            <input id="team_full_name" type="text" bind:value={formData.team_full_name} />
        </div>
        
        <div class="input-group">
            <label for="pfp">Profile Picture URL</label>
            <input id="pfp" type="url" bind:value={formData.pfp} />
        </div>

        <div class="input-group">
            <label for="description">Description</label>
            <input id="description" type="text" bind:value={formData.description} />
        </div>

        <div class="input-group">
            <label for="primary_color">Primary Color</label>
            <div>
                <span id="primary_preview" class="color-preview"></span>
                <input id="primary_color" type="color" bind:value={formData.primary_col} />
            </div>
        </div>

        <div class="input-group">
            <label for="secondary_color">Secondary Color</label>
            <div>
                <span id="secondary_preview" class="color-preview"></span>
                <input id="secondary_color" type="color" bind:value={formData.secondary_col} />
            </div>
        </div>

        <div class="input-group">
            <label for="location">Location</label>
            <input id="location" type="text" bind:value={formData.location} />
        </div>

        <div class="divider"></div>

        <h2>Links</h2>
        <div class="links">
            {#each links as link, i}
                <div class="link-row">
                    <div class="grid">
                        <div class="input-group">
                            <label for={"link_title_"+i}>Title</label>
                            <input id={"link_title_"+i} type="text" bind:value={link.title} />
                        </div>
                        <div class="input-group">
                            <label for={"link_desc_"+i}>Description</label>
                            <input id={"link_desc_"+i} type="text" bind:value={link.description} />
                        </div>
                        <div class="input-group">
                            <label for={"link_url_"+i}>URL</label>
                            <input id={"link_url_"+i} type="url" bind:value={link.url} />
                        </div>
                        <div class="input-group">
                            <label for={"link_icon_mode_"+i}>Icon</label>
                            <div class="icon-config">
                                <select id={"link_icon_mode_"+i} bind:value={link.icon_mode} onchange={() => { if (link.icon_mode === 'preset') link.custom_icon=''; ensureLinkDefaults(link); links=[...links]; }}>
                                    <option value="preset">Preset</option>
                                    <option value="custom">Custom URL</option>
                                </select>
                                {#if link.icon_mode === 'preset'}
                                    <select bind:value={link.icon_key} onchange={() => { ensureLinkDefaults(link); links=[...links]; }}>
                                        {#each PRESET_ICONS as preset}
                                            <option value={preset.key}>{preset.label}</option>
                                        {/each}
                                    </select>
                                    {#if link.icon}
                                        <div class="icon-preview"><img alt={link.icon_key + ' icon'} src={link.icon} /></div>
                                    {/if}
                                {:else}
                                    <input placeholder="https://example.com/icon.png" type="url" bind:value={link.custom_icon} oninput={() => { link.icon = link.custom_icon; links=[...links]; }} />
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="link-actions">
                        <button type="button" class="btn btn-danger" onclick={() => removeLink(i)}>Remove</button>
                    </div>
                </div>
            {/each}
            <div style="margin-top: var(--space-md)">
                <button type="button" class="btn btn-1" onclick={addLink}>Add Link</button>
            </div>
        </div>

    </form>
    <button onclick={save} class="btn btn-danger">Save Changes</button>
    <button onclick={clear} class="btn btn-1">Clear Changes</button>
</div>

<style>

    .main {
        padding: 20px;
    }
    
    .color-preview {
        color: white;
        border-radius: 5px;
        padding: 0px 5px;
    }

    .links {
        margin-top: 1rem;
    }
    .link-row {
        padding: var(--space-md);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        background: var(--bg-card);
        margin-bottom: var(--space-md);
    }
    .link-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-sm);
        margin-top: var(--space-sm);
    }

    .icon-config { display:flex; gap:.5rem; align-items:center; flex-wrap:wrap; }
    .icon-config select, .icon-config input { flex:0 0 auto; }
    .icon-preview { width:32px; height:32px; display:flex; align-items:center; justify-content:center; }
    .icon-preview img { max-width:100%; max-height:100%; border-radius:4px; box-shadow:0 0 0 1px var(--border-light); }

</style>