<script>
    import { select } from 'optimal-select-x'
    import { BlockType } from "src/models/IBlock";

    export let recipe;
    export let block;
    export let inspector;
    export let selectedBlockId;

    let fieldName;
    let matchesCount = 0;
    let isInspecting = false;
    let previousSelector = null;

    function getSelectedBlock () {
        return recipe.blocks.find(block => block.id === selectedBlockId);
    }

    function saveName () {
        block.details.name = fieldName;
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
            showPreview(false);
        }
        if (inspector.isEnabled()) {
            inspector.cancel();
        }
        isInspecting = true;
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

        // make it smarter/capable of crawling lists
        if (selector.includes("nth-of-type")) {
            selector = selector.replace(/:nth-of-type\([0-9]+\)/, '');
        }

        block.details.selector = selector;

        const tagName = el.tagName.toLowerCase();

        // try to understand what user actually wants to extract from that element
        switch (tagName) {
            case "img":
                block.details.property = "src";
            break;
            default:
                block.details.property = "text";
            break;
        }

        // improve the name when possible
        if (isDefaultName()) {
            switch (tagName) {
                case "img":
                    block.details.name = "image";
                break;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                    block.details.name = "title";
                break;
                case "p":
                    block.details.name = "description";
                break;
            }
        }
        
    }

    function isDefaultName () {
        return block.details.name.match(/data[0-9]+$/gm);
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

    function showPreview (show) {
        if (!block.details.selector || isInspecting) {
            return;
        }
        document.querySelectorAll(block.details.selector).forEach(el => {
            if (show) {
                inspector.highlight(el);
            } else {
                inspector.removeHighlight(el);
            }
        });
    }

    $: onChange(block);
    $: onBlockSelected(selectedBlockId == block.id);

    // if its a new block, start element selector
    if (!block.details.selector) {
        changeSelector();
    }
</script>
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="text-center" on:mouseover={e => showPreview(true)} on:mouseleave={e => showPreview(false)}>
    <div class="mb-1">
        <strong>extract - </strong>
        <strong contenteditable="true" bind:textContent={fieldName} on:focusout={saveName} class="cursor-text">{block.details.name ? block.details.name : "data" + Math.floor(Math.random() * (20 - 1 + 1) + 1)}</strong>
        <div class="float-end">
            {#if isInspecting}
            <div on:mousedown={stopInspecting} class="bg-success p-1 text-small d-inline-block cursor-pointer" title="Save choosen selector"><i class="fas fa-check"></i></div>
            <div on:mousedown={cancelNewSelector} class="bg-danger p-1 text-small d-inline-block cursor-pointer" title="Cancel inspector"><i class="fas fa-ban"></i></div>
            {/if}
            <div on:mousedown={changeSelector} class="bg-info p-1 text-small cursor-crosshair d-inline-block" title="Amount of matches. Click to edit the selector">{matchesCount}</div>
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