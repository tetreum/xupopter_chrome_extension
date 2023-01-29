<script>
    import { shadowDOM } from "src/stores/shadow";
    import { select } from 'optimal-select-x'

    export let block;
    export let inspector;

    let fieldName;
    let matchesCount = 0;

    function saveName () {
        block.details.name = fieldName;
    }

    function calculateMatches() {
        matchesCount = document.querySelectorAll(block.details.selector).length;
    }

    function changeSelector () {
        inspector.cancel();
        inspector.enable((el) => {
            onSelect(el);
        });
    }

    function onSelect (el) {
        // @ts-ignore
        block.details.selector = select(el, {
            ignore: {
                attribute: (e,t,n=(()=>{})) => {
                    return !/(^class$)|(^id$)/.test(e) || ["style", "data-reactid", "data-react-checksum"].indexOf(e) > -1;
                }
            },
        });

        switch (el.tagName.toLowerCase()) {
            case "img":
                block.details.property = "src";
            break;
            default:
                block.details.property = "text";
            break;
        }
    }

    function onchange(block) {
        if (block.details.selector) {
            calculateMatches();
        }
    }

    $: onchange(block);

    // if its a new block, start element selector
    if (!block.details.selector) {
        changeSelector();
    }
</script>
<div class="text-center">
    <div class="mb-1">
        <strong>extract - </strong>
        <strong contenteditable="true" bind:textContent={fieldName} on:focusout={saveName} class="cursor-text">{block.details.name ? block.details.name : "data" + Math.floor(Math.random() * (20 - 1 + 1) + 1)}</strong>
        <div on:mousedown={changeSelector} class="bg-info p-1 float-end text-small cursor-crosshair" title="Amount of matches. Click to edit the selector">{matchesCount}</div>
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
</style>