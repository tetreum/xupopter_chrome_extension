<script>
    import { select } from 'optimal-select-x';
    import { BlockType } from "src/models/IBlock";
    import { shadowDOM } from "src/stores/shadow";
    import { onMount } from 'svelte';

    export let recipe;
    export let block;
    export let inspector;
    export let selectedBlockId;
    export let hoveredBlockId;

    let fieldName;
    let matchesCount = 0;
    let isInspecting = false;
    let previousSelector = null;
    let arrowHeight = 0;
    let arrowTop = 0;
    let isConnecting = false;

    onMount(() => {
        const startBlock = $shadowDOM.getElementById('block-' + recipe.blocks[0].id);
        drawArrowTo(startBlock)
    });

    function drawArrowTo (startBlock) {
        const endBlock = $shadowDOM.getElementById('block-' + block.id);
        const startRect = startBlock.getBoundingClientRect();
        const endRect = endBlock.getBoundingClientRect();

        const topY = startRect.bottom - ((startRect.bottom - startRect.top) / 2);
        const bottomY = endRect.bottom - ((endRect.bottom - endRect.top) / 2);

        arrowHeight = bottomY - topY;
        arrowTop = arrowHeight - ((endRect.bottom - endRect.top) / 2) + 13; // can't get it to match properly to 13 is hack
    }

    function getSelectedBlock () {
        return recipe.blocks.find(block => block.id === selectedBlockId);
    }

    function saveName () {
        block.details.text = fieldName;
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
        stopInspecting();
    }

    function onChange(block) {
        calculateMatches();
    }

    function onBlockSelected (isSelected) {
        if (!isSelected) {
            const selectedBlock = getSelectedBlock();

            if (selectedBlock) {
                if (isConnecting && selectedBlockId != block.id) {
                    block.details.startBlock = selectedBlockId;
                    isConnecting = false;
                    return;
                }

                // do not disable inspector if the new selected block also uses it
                if (!([BlockType.Extract, BlockType.Click, BlockType.Input].includes(selectedBlock.type)) && selectedBlockId === (recipe.blocks.length - 1)) {
                    stopInspecting();
                }
            }
        }
    }

    function onHoverBlock (blockId) {
        if (isConnecting && hoveredBlockId != block.id) {
            drawArrowTo($shadowDOM.getElementById('block-' + hoveredBlockId));
            return;
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

    function setConnection () {
        isConnecting = true;
    }

    $: onChange(block);
    $: onHoverBlock(hoveredBlockId);
    $: onBlockSelected(selectedBlockId == block.id);
    $: {
        isInspecting = selectedBlockId == block.id && inspector.isEnabled();
    }

    // if its a new block, start element selector
    if (!block.details.selector) {
        changeSelector();
    }
</script>
<div on:mousedown={setConnection} class="dot-connector float-start rounded-circle mt-4 cursor-pointer"></div>
<div class="text-center position-relative">
    <svg height="{arrowHeight}px" width="15px" class="position-absolute arrow-connector" style="top: -{arrowTop}px">
        <line x1="0" y1="0" x2="10" y2="0" />
        <line x1="0" y1="0" x2="0" y2="{arrowHeight}" />
        <line x1="0" y1="{arrowHeight}" x2="10" y2="{arrowHeight}" />
    </svg>
    <div class="mb-1">
        <strong>paginate - </strong>
        <select class="form-select w-auto d-inline-block py-1">
            <option value="normal">normal</option>
            <option value="infinite">infinite scroll</option>
        </select>
        <div class="float-end">
            {#if isInspecting}
            <div on:mousedown={stopInspecting} class="bg-success p-1 text-small d-inline-block cursor-pointer" title="Save choosen selector"><i class="fas fa-check"></i></div>
            <div on:mousedown={cancelNewSelector} class="bg-danger p-1 text-small d-inline-block cursor-pointer" title="Cancel inspector"><i class="fas fa-ban"></i></div>
            {/if}
            <div on:mousedown={changeSelector} class="bg-info p-1 text-small cursor-crosshair d-inline-block" title="Amount of matches. Click to edit the selector"><i class="fas fa-pencil"></i></div>
        </div>
    </div>
    <div class="text-muted cursor-text" contenteditable="true">{block.details.selector ? block.details.selector : ''}</div>
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
    .dot-connector {
        width: 10px;
        height: 10px;
        margin-left: -12px;
        background-color: white;
    }
    .dot-connector:hover {
        background-color: grey;
    }
    .arrow-connector {
        top: 0px;
        left: -14px;
        pointer-events: none;
    }
    .arrow-connector line, .arrow-connector circle {
        stroke: rgb(255 255 255);
        stroke-width: 4px;
    }
</style>