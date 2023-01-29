<script>
    import { BlockType } from "src/models/IBlock";
    import { createEventDispatcher } from 'svelte';

    export let recipe;

    let jsonPreview = "";
    let data = [];
    const dispatch = createEventDispatcher();

    recipe.blocks.forEach(block => {
        switch (block.type) {
            case BlockType.Extract:
                document.querySelectorAll(block.details.selector).forEach((entry, i) => {
                    if (typeof data[i] === "undefined") {
                        data[i] = {};
                    }
                    let val;

                    switch (block.details.property) {
                        case "src":
                            val = entry.src;
                            break;
                        case "value":
                            val = entry.value;
                            break;
                        case "text":
                            val = entry.innerText;
                            break;
                        case "html":
                            val = entry.innerHTML;
                            break;
                    }

                    data[i][block.details.name] = val;
                });
                break;
        }
    })

    jsonPreview = JSON.stringify(data, null, 2);

    function close () {
        dispatch("close");
    }
</script>
<div class="modal d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Preview</h5>
          <button type="button" class="btn-close" on:mousedown={close} aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <pre>{jsonPreview}</pre>
        </div>
        <div class="modal-footer">
          <button on:mousedown={close} type="button" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
</div>