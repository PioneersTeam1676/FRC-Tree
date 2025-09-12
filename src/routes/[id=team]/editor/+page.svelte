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

    function addLink() {
        links = [...links, { id: undefined, title: "", description: "", url: "", icon: "" }];
    }

    function removeLink(idx) {
        const link = links[idx];
        if (link && link.id) {
            deletedIds = [...deletedIds, link.id];
        }
        links = links.filter((_, i) => i !== idx);
    }

    async function save() {
        const payload = { ...formData, links, deletedIds };
        toast.promise(
            (async () => {
                const res = await post(window.location.pathname, payload);
                if (res.isSuccess()) {
                    if (res.data?.info?.[0]) {
                        formData = { ...res.data.info[0] };
                    }
                    if (Array.isArray(res.data?.links)) {
                        links = res.data.links.map(l => ({ ...l }));
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
                            <label for={"link_icon_"+i}>Icon URL</label>
                            <input id={"link_icon_"+i} type="url" bind:value={link.icon} />
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

</style>