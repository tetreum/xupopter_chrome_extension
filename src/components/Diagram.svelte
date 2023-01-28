<script lang="ts">
    import styleDrawflow from 'drawflow/dist/drawflow.min.css?inline'
    import customStyles from '../content/global.css?inline'
    import { onMount } from 'svelte';
    import RecipeEditor from 'src/lib/RecipeEditor';
    import {editor} from "../stores/editor";
    import { shadowDOM } from "src/stores/shadow";
    import Block from 'src/blocks2/Block.svelte';
    import Inspector from 'inspector-dom';

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
        d.innerHTML = styleDrawflow + customStyles;
        styles.appendChild(d);
    });

    function drawflow(node) {
        $editor = new RecipeEditor(node, $shadowDOM);
	}


    let list = [
        {type: "start"},
        {type: "extract", details: {selector: '.name'}},
        {type: "extract", details: {selector: '.surnames'}},
        {type: "extract", details: {selector: '.email'}},
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
                block={block}
                index={index}
                inspector={inspector}
                bind:hovering={hovering}
                on:dragstart={event => dragstart(event.detail.event, index)}
                on:drop={event => drop(event.detail.event, index)}
            />
        {/each}
    </div>
    <div use:drawflow class="parent-drawflow"></div>
</div>
<div bind:this={styles}></div>
<style>
    .parent-drawflow {
        height: 90vh;
        width: 100%;
        background-color: #313747;
    }
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

