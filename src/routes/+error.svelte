<script>
	import { page } from '$app/state';
    import { codenames } from '$lib/apis';
</script>
    
<div class="cont">
    <div class="headers">
        <div class="header">
            <h1>OOPS!</h1>
            <h2><span class="status">{page.status}</span> {codenames[page.status].message}</h2>
        </div>
    </div>
    <div class="content">
        {page.error.message}
    </div>
    <div class="header bot">
        <a class="lnk" href="/"><button class="btn">Return Home</button></a>    
    </div>
</div>

<style>
    .cont {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 50px;
    }

    .headers {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 50%;
        height: 20%;
    }

    button {
        margin: 0;
    }

    h1 {
        font-size: 5em;
        font-weight: 500;
    }
    
    h2 {
        font-size: 3em;
        font-weight: 300;
    }

    .status {
        font-weight: 500;
    }

    .btn {
        padding: 13px;
        font-size: 1.5em;
        margin-bottom: 20px;
    }

    .header {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .content {
        margin-top: 20px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
    }

    .bot {
        position: absolute;
        bottom: 0;
    }
</style>