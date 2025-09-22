<script lang="ts">
    import { docTitle } from "$lib/frontendutil";
    import { goto } from '$app/navigation';
    docTitle("Admin Panel")
</script>

<div class="main">
    <div class="admin-links">
        <button on:click={() => goto('/admin/admins')}>Manage Admin Accounts</button>
    </div>
</div>

<style>
    .main {
        margin: auto;
        width: 100%;
        height: 100%;
    }
    .admin-links { margin-top:20px; }
    .admin-links button { padding:8px 14px; cursor:pointer; }
</style>
