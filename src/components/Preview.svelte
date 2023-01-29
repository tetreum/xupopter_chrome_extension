<script>
    import { BlockType } from "src/models/IBlock";
    import { createEventDispatcher } from 'svelte';

    export let recipe;

    let currentTab = "output";
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

    function selectTab (tab) {
        currentTab = tab;
    }

</script>
<div class="modal d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header pb-0 border-bottom-0">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <button on:mousedown={e => selectTab("output")} class="nav-link" class:active={currentTab === 'output'}>Output</button>
                </li>
                <li class="nav-item">
                    <button on:mousedown={e => selectTab("recipe")} class="nav-link" class:active={currentTab === 'recipe'}>Recipe</button>
                </li>
            </ul>
          <button type="button" class="btn btn-link text-white" on:mousedown={close} aria-label="Close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            {#if currentTab === 'output'}
                <pre>{jsonPreview}</pre>
            {:else}
                <pre>{JSON.stringify(recipe, null, 2)}</pre>
            {/if}
        </div>
        <div class="modal-footer">
          <button on:mousedown={close} type="button" class="btn btn-dark border">Close</button>
        </div>
      </div>
    </div>
</div>
<style>
    pre {
        max-height: 80vh;
        overflow-y: auto;
    }
    .nav-link:not(.active) {
        color: white;
    }
</style>