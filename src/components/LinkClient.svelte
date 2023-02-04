<script>
    import { storage } from 'src/storage';
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();
    let uri;
    let data;

    onMount (async () => {
        data = await storage.get();
        uri = data.xupopterClient;
    });
    
    function close () {
        dispatch("close");
    }

    async function save () {
        uri = uri.trim();
        if (uri.length < 1) {
            return;
        }

        data.xupopterClient = uri;

        await storage.set(data);
        dispatch("client-linked");
    }
</script>
<div class="modal d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header pb-0 border-bottom-0">
            Link to Xupopter client
          <button type="button" class="btn btn-link text-white" on:mousedown={close} aria-label="Close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="alert alert-info">
                To store the recipe you must link the extension to a Xupopter Client.
            </div>
            <form method="post">
                <div class="input-group mb-3">
                    <span class="input-group-text">URI</span>
                    <input bind:value={uri} placeholder="je5h4sw39ksgt@localhost:5133" autofocus class="form-control" type="text">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button on:mousedown={save} type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
</div>