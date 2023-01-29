<script>
    import { BlockType } from "src/models/IBlock";
    import { shadowDOM } from "src/stores/shadow";

    const assetUrl = (name) => {
        return "chrome-extension://" + chrome.runtime.id + "/src/assets/" + name;
    }

    function addBlock (type) {
        const event = new CustomEvent('add-block', {detail: {type}});

        // @ts-ignore
        $shadowDOM.dispatchEvent(event);
    }
</script>
<div class="d-flex flex-column me-2">
    <button on:mousedown={() => addBlock(BlockType.Input)} class="btn btn-secondary left-border-green rounded-0">
        Input
    </button>
    <button on:mousedown={() => addBlock(BlockType.Click)} class="btn btn-secondary left-border-red rounded-0">
        Click
    </button>
    <button on:mousedown={() => addBlock(BlockType.Extract)} class="btn btn-secondary left-border-red rounded-0">
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