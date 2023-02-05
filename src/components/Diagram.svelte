<script lang="ts">
    import customStyles from '../content/global.css?inline'
    import { onMount } from 'svelte';
    import { shadowDOM } from "src/stores/shadow";
    import Block from 'src/blocks/Block.svelte';
    import Inspector from '../lib/inspector-dom';
    import { BlockType } from 'src/models/IBlock';
    import type IRecipe from 'src/models/IRecipe';
    import Preview from './Preview.svelte';
    import { storage } from 'src/storage';
    import LinkClient from './LinkClient.svelte';
    import { saveRecipe } from 'src/lib/XupopterClient';

    let styles;
    let inspector = Inspector({
        root: 'body',
        excluded: ["#xupopter-extension-container"],
        outlineStyle: '2px solid orange',
        onClick: el => {
            console.log(el);
        }
    });
    let showPreview = false;
    let showLink = false;
    let isSaving = false;
    let parsedUrl = location.host.split(".");
    let recipe : IRecipe = {
        id: generateUUID(),
        name: parsedUrl.length > 2 ? parsedUrl[1] : parsedUrl[0],
        schema: 1,
        blocks: [
            {id: generateUUID(), type: BlockType.Start, details: {type: "url", source: window.location.href}},
        ]
    };

	onMount(async () => {
        const d = document.createElement("style");
        d.innerHTML = customStyles;
        styles.appendChild(d);

        // @ts-ignore
        $shadowDOM.addEventListener('add-block', (e) => { addBlock(e.detail.type) }, false);
    });

    // https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
    function generateUUID() : string {
        // @ts-ignore
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function addBlock (type : BlockType) {
        let block = {id: generateUUID(), type: type, details: {}};

        switch (type) {
            case BlockType.Extract:
                block.details = {
                    name: "data" + Math.floor(Math.random() * (20 - 1 + 1) + 1)
                };
                break;
            case BlockType.Input:
                block.details = {
                    text: "TEXT_TO_WRITE"
                };
                break;
        }

        const newTracklist = recipe.blocks;
        newTracklist.push(block);

        hovering = newTracklist.length - 1;
        recipe.blocks = newTracklist;
    }

    let hovering : number = 0;

    const drop = (event, target) => {
        event.dataTransfer.dropEffect = 'move'; 
        const start = parseInt(event.dataTransfer.getData("text/plain"));
        const newTracklist = recipe.blocks;

        if (start < target) {
            newTracklist.splice(target + 1, 0, newTracklist[start]);
            newTracklist.splice(start, 1);
        } else {
            newTracklist.splice(target, 0, newTracklist[start]);
            newTracklist.splice(start + 1, 1);
        }
        recipe.blocks = newTracklist;
        hovering = null;
    }

    const dragstart = (event, i) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
        const start = i;
        event.dataTransfer.setData('text/plain', start);
    }

    function onBackgroundClick (e) {
        if (e.target.id != "diagram") {
            return;
        }
        hovering = 0;
    }

    function preview () {
        showPreview = true;
    }

    async function save () {
        const data = await storage.get();

        if (!data.xupopterClient) {
            showLink = true;
            return;
        }

        isSaving = true;
        await saveRecipe(recipe);
        isSaving = false;
    }

    function onClientLinked () {
        showLink = false;
        save();
    }
    
</script>
{#if showPreview}
<Preview bind:recipe={recipe} on:close={e => showPreview = false} />
{/if}
{#if showLink}
<LinkClient on:client-linked={e => onClientLinked()} on:close={e => showLink = false} />
{/if}
<div class="w-100">
    <div class="text-white mb-2 d-flex justify-content-between">
        <div class="my-auto">
            <input bind:value={recipe.name} type="text" class="form-control">
        </div>
        <div>
            <button on:mousedown={preview} class="btn btn-link text-white" title="Preview" type="button"><i class="fas fa-eye"></i></button>
            {#if isSaving}
                <i class="fas fa-spinner fa-spin"></i>
            {:else}
                <button on:mousedown={save} class="btn btn-link text-white" title="Save" type="button"><i class="fas fa-save"></i></button>
            {/if}
        </div>
    </div>
    <div id="diagram" on:mousedown={onBackgroundClick}>
        {#each recipe.blocks as block, index  (index)}
            <Block       
                bind:recipe={recipe}
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
        height: 100vh;
    }
</style>

