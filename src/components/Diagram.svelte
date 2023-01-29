<script lang="ts">
    import customStyles from '../content/global.css?inline'
    import { onMount } from 'svelte';
    import { shadowDOM } from "src/stores/shadow";
    import Block from 'src/blocks/Block.svelte';
    import Inspector from 'inspector-dom';
    import type IBlock from 'src/models/IBlock';
    import { BlockType } from 'src/models/IBlock';

    let styles;
    let inspector = Inspector({
        root: 'body',                       // root element
        excluded: ["#xupopter-extension-container"],
        outlineStyles: '2px solid orange',  // styles
        onClick: el => {
            console.log(el);
        }
    });

	onMount(async () => {
        const d = document.createElement("style");
        d.innerHTML = customStyles;
        styles.appendChild(d);

        // @ts-ignore
        $shadowDOM.addEventListener('add-block', (e) => { addBlock(e.detail.type) }, false);
    });

    function addBlock (type : BlockType) {
        let block = {type: type, details: {}};

        switch (type) {
            case BlockType.Extract:
                block.details = {
                    name: "data" + Math.floor(Math.random() * (20 - 1 + 1) + 1)
                };
                break;
        }

        const newTracklist = list;
        newTracklist.push(block);

        hovering = newTracklist.length - 1;
        list = newTracklist;
    }

    let list : IBlock[] = [
        {type: BlockType.Start, details: {type: "url", source: window.location.href}},
    ];
    let hovering : number = 0;

    const drop = (event, target) => {
        event.dataTransfer.dropEffect = 'move'; 
        const start = parseInt(event.dataTransfer.getData("text/plain"));
        const newTracklist = list

        if (start < target) {
            newTracklist.splice(target + 1, 0, newTracklist[start]);
            newTracklist.splice(start, 1);
        } else {
            newTracklist.splice(target, 0, newTracklist[start]);
            newTracklist.splice(start + 1, 1);
        }
        list = newTracklist
        hovering = null
    }

    const dragstart = (event, i) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
        const start = i;
        event.dataTransfer.setData('text/plain', start);
    }
    
</script>
<div class="w-100">
    <div>Diagram</div>
    <div id="diagram">
        {#each list as block, index  (index)}
            <Block       
                bind:block={block}
                index={index}
                inspector={inspector}
                bind:hovering={hovering}
                on:dragstart={event => dragstart(event.detail.event, index)}
                on:drop={event => drop(event.detail.event, index)}
            />
        {/each}
    </div>
</div>
<div bind:this={styles}></div>
<style>
    :global(.block-start) {
        border-left: 4px solid grey !important;
    }
    .draggable {
        color: white;
        padding: 5px;
    }
    .real-block {
        background-color: rgba(62, 69, 84, 1);
        box-shadow: 0 2px 15px 2px #000;
    }
    #diagram {
        background-color: #313747;
    }
</style>

