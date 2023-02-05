<script>
    import { select } from 'optimal-select-x'
    import { BlockType } from "src/models/IBlock";

    export let recipe;
    export let block;
    export let inspector;
    export let selectedBlockId;

    let matchesCount = 0;
    let isInspecting = false;
    let previousSelector = null;

    function getSelectedBlock () {
        return recipe.blocks.find(block => block.id === selectedBlockId);
    }

    function calculateMatches() {
        if (block.details.selector) {
            matchesCount = document.querySelectorAll(block.details.selector).length;
        } else {
            matchesCount = 0;
        }
    }

    function changeSelector () {
        if (block.details.selector) {
            previousSelector = block.details.selector;
        }
        if (inspector.isEnabled()) {
            inspector.cancel();
        }
        inspector.enable((el) => {
            onSelect(el);
        });
    }

    function onSelect (el) {
        // @ts-ignore
        let selector = select(el, {
            ignore: {
                attribute: (e,t,n=(()=>{})) => {
                    return !/(^class$)|(^id$)/.test(e) || ["style", "data-reactid", "data-react-checksum"].indexOf(e) > -1;
                }
            },
        });

        // try to make a more robust selector
        if (selector === "input") {
            if (el.id) {
                selector = '#' + el.id;
            } else if (el.name) {
                selector += '[name="' + el.name + '"]';
            }
        }

        block.details.selector = selector;
    }

    function onChange(block) {
        calculateMatches();
    }

    function onBlockSelected (isSelected) {
        if (!isSelected) {
            const selectedBlock = getSelectedBlock();
            // do not disable inspector if the new selected block also uses it
            if (selectedBlock && !([BlockType.Extract, BlockType.Click, BlockType.Input].includes(selectedBlock.type)) && selectedBlockId === (recipe.blocks.length - 1)) {
                stopInspecting();
            }
        }
    }

    function cancelNewSelector () {
        stopInspecting();
        
        block.details.selector = previousSelector;
    }

    function stopInspecting () {
        inspector.cancel();
        isInspecting = false;
    }

    $: onChange(block);
    $: onBlockSelected(selectedBlockId == block.id);
    $: {
        isInspecting = selectedBlockId == block.id && inspector.isEnabled();
    }

    // if its a new block, start element selector
    if (!block.details.selector) {
        changeSelector();
    }
</script>
<div class="text-center">
    <div class="mb-1">
        <strong>click</strong>
        <div class="float-end">
            {#if isInspecting}
            <div on:mousedown={stopInspecting} class="bg-success p-1 text-small d-inline-block cursor-pointer" title="Save choosen selector"><i class="fas fa-check"></i></div>
            <div on:mousedown={cancelNewSelector} class="bg-danger p-1 text-small d-inline-block cursor-pointer" title="Cancel inspector"><i class="fas fa-ban"></i></div>
            {/if}
            <div on:mousedown={changeSelector} class="bg-info p-1 text-small cursor-crosshair d-inline-block" title="Amount of matches. Click to edit the selector"><i class="fas fa-pencil"></i></div>
        </div>
    </div>
    <div class="text-muted">{block.details.selector ? block.details.selector : ''}</div>
</div>
<style>
    .cursor-crosshair {
        cursor: crosshair;
    }
    .cursor-text {
        cursor: text;
    }
    .cursor-pointer {
        cursor: pointer;
    }
</style>