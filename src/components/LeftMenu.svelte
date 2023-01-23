<script>
    import {editor} from "../stores/editor";

    const assetUrl = (name) => {
        return "chrome-extension://" + chrome.runtime.id + "/src/assets/" + name;
    }
</script>
<div class="d-flex flex-column me-2">
    <button on:mousedown={() => $editor.addBlock("input")} class="btn btn-secondary left-border-green rounded-0">
        Input
    </button>
    <button on:mousedown={() => $editor.addBlock("click")} class="btn btn-secondary left-border-red rounded-0">
        Click
    </button>
    <button on:mousedown={() => $editor.addBlock("extract")} class="btn btn-secondary left-border-red rounded-0">
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