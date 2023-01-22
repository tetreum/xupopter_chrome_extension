<script>
    export let editor;

    const assetUrl = (name) => {
        return "chrome-extension://" + chrome.runtime.id + "/src/assets/" + name;
    }
    const addBlock = () => {
        console.log(editor);
        editor.addBlock("click")
    }
</script>
<div class="d-flex flex-column me-2">
    <button on:mousedown={addBlock} class="btn btn-secondary left-border-green rounded-0">
        Input
    </button>
    <button class="btn btn-secondary left-border-red rounded-0">
        Click
    </button>
    <button class="btn btn-secondary left-border-red rounded-0">
        Extract
    </button>
</div>
<style>
    .left-border-green {
        border-left: 4px solid green;
    }
    .left-border-red {
        border-left: 4px solid red;
    }
</style>