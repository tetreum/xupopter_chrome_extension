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
        inspector.enable((el) => {
            console.log("CLCIK BIX", select(el, {
                ignore: {
                    attribute: (e,t,n=(()=>{})) => {
                        return !/(^class$)|(^id$)/.test(e) || ["style", "data-reactid", "data-react-checksum"].indexOf(e) > -1;
                    }
                },
            }));
        });
    }

    function onchange(block) {
        if (block.details.selector) {
            calculateMatches();
        }
    }

    $: onchange(block);
</script>
<div class="text-center">
    <div class="mb-1">
        <strong>extract - </strong>
        <strong contenteditable="true" bind:textContent={fieldName} on:focusout={saveName}>{block.details.name ? block.details.name : "data1"}</strong>
        <div on:mousedown={changeSelector} class="bg-info p-1 float-end text-small" title="Amount of matches. Click to edit the selector">{matchesCount}</div>
    </div>
    <div class="text-muted">{block.details.selector}</div>
</div>