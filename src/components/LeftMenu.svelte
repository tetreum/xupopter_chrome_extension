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
    <button on:mousedown={() => addBlock(BlockType.Input)} class="btn btn-secondary block-input rounded-0 border-bottom border-dark">
        Input
    </button>
    <button on:mousedown={() => addBlock(BlockType.Click)} class="btn btn-secondary block-click rounded-0 border-bottom border-dark">
        Click
    </button>
    <button on:mousedown={() => addBlock(BlockType.Extract)} class="btn btn-secondary block-extract rounded-0 border-bottom border-dark">
        Extract
    </button>
    <button on:mousedown={() => addBlock(BlockType.JsonSchema)} class="btn btn-secondary block-paginate rounded-0 border-bottom border-dark">
        Schema
    </button>
    <button on:mousedown={() => addBlock(BlockType.Paginate)} class="btn btn-secondary block-paginate rounded-0 border-bottom border-dark">
        Paginate
    </button>
</div>
<style>
    .block-input {
        border-left: 4px solid green !important;
    }
    .block-click {
        border-left: 4px solid #003c80 !important;
    }
    .block-extract {
        border-left: 4px solid red !important;
    }
    .block-paginate {
        border-left: 4px solid #c27ec7 !important;
    }
</style>
