<script lang="ts">
  import { onMount } from 'svelte';
  import { get, post } from '$lib/apis';
  let admins: { uid:number; email:string; team_num:number; created:string }[] = [];
  let loading = true;
  let errorMsg: string = '';
  let newEmail = '';
  let newPassword = '';
  let creating = false;
  let deleting: Record<number, boolean> = {};

  async function loadAdmins() {
    loading = true;
    errorMsg = '';
    try {
      const res = await fetch('/admin/admins');
      if (!res.ok) throw new Error('Failed to load admins');
      const json = await res.json();
      admins = json.admins.map(a => ({ ...a, created: new Date(a.created).toLocaleString() }));
    } catch (e:any) {
      errorMsg = e.message;
    } finally {
      loading = false;
    }
  }

  async function createAdminAccount() {
    if (!newEmail || !newPassword) { errorMsg = 'Email and password required'; return; }
    creating = true;
    errorMsg='';
    try {
      const res = await fetch('/admin/admins', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email:newEmail, password:newPassword }) });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to create admin');
      newEmail=''; newPassword='';
      await loadAdmins();
    } catch(e:any){ errorMsg = e.message; }
    finally { creating = false; }
  }

  async function deleteAdmin(uid:number){
    if (!confirm('Delete admin '+uid+'?')) return;
    deleting[uid]=true;
    try {
      const res = await fetch('/admin/admins?uid='+uid, { method:'DELETE' });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Delete failed');
      await loadAdmins();
    } catch(e:any){ errorMsg = e.message; }
    finally { deleting[uid]=false; }
  }

  onMount(loadAdmins);
</script>

<h1>Admin Management</h1>
{#if errorMsg}<p style="color:red">{errorMsg}</p>{/if}
{#if loading}
  <p>Loading...</p>
{:else}
  <table class="admins-table">
    <thead><tr><th>UID</th><th>Email</th><th>Team</th><th>Created</th><th></th></tr></thead>
    <tbody>
      {#each admins as a}
        <tr>
          <td>{a.uid}</td>
          <td>{a.email}</td>
          <td>{a.team_num}</td>
          <td>{a.created}</td>
          <td>
            {#if a.team_num === 0 && a.uid === admins[0].uid}
              <em>Protected</em>
            {:else}
              <button disabled={deleting[a.uid]} on:click={() => deleteAdmin(a.uid)}>{deleting[a.uid] ? '...' : 'Delete'}</button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<h2>Create New Admin</h2>
<div class="form">
  <input placeholder="Email" bind:value={newEmail} />
  <input placeholder="Password" type="password" bind:value={newPassword} />
  <button on:click={createAdminAccount} disabled={creating}>{creating ? 'Creating...' : 'Create Admin'}</button>
</div>

<style>
  h1 { margin-top:0; }
  table.admins-table { border-collapse: collapse; width:100%; max-width:800px; }
  table.admins-table th, table.admins-table td { border:1px solid #444; padding:6px 10px; font-size:.85rem; }
  table.admins-table th { background:#222; color:#eee; text-align:left; }
  table.admins-table tbody tr:nth-child(even) { background:#1a1a1a; }
  .form { display:flex; gap:8px; margin-top:10px; max-width:500px; }
  .form input { flex:1; padding:6px 8px; }
  button { cursor:pointer; }
</style>
