<script>
  import StartBlock from "./StartBlock.svelte";
  import ExtractBlock from "./ExtractBlock.svelte";
  import {createEventDispatcher} from 'svelte';
  import {BlockType} from "src/models/IBlock";
  import InputBlock from "./InputBlock.svelte";
  import ClickBlock from "./ClickBlock.svelte";
  import PaginateBlock from "./PaginateBlock.svelte";
  import JsonSchemaBlock from "./JsonSchemaBlock.svelte";

  const dispatch = createEventDispatcher();

  export let recipe;
  export let block;
  export let hovering;
  export let inspector;
  export let hoveredBlockId;
</script>
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div id="block-{block.id}" class="text-white p-2 {block.type === BlockType.Start ? '' : 'cursor-grab'}" 
    draggable={block.type != BlockType.Start} 
    class:is-active={hovering === block.id}
    on:mousedown={() => hovering = block.id}
    on:dragstart={event => dispatch('dragstart', {event})}
    on:dragover|preventDefault={e => {return false}}
    on:drop|preventDefault={event => dispatch('drop', {event})}
    on:dragenter={() => hovering = block.id}
    on:mouseover={() => hoveredBlockId = block.id}
>
    <div class="real-block mb-2 p-2 block-{block.type}">
        {#if block.type === BlockType.Start}
            <StartBlock bind:block={block}/>
        {:else if block.type === BlockType.Extract}
            <ExtractBlock bind:block={block} bind:recipe={recipe} inspector={inspector} bind:selectedBlockId={hovering}/>
        {:else if block.type === BlockType.Input}
            <InputBlock bind:block={block} bind:recipe={recipe} inspector={inspector} bind:selectedBlockId={hovering}/>
        {:else if block.type === BlockType.Click}
            <ClickBlock bind:block={block} bind:recipe={recipe} inspector={inspector} bind:selectedBlockId={hovering}/>
        {:else if block.type === BlockType.JsonSchema}
            <JsonSchemaBlock bind:block={block} bind:recipe={recipe} inspector={inspector} bind:selectedBlockId={hovering}/>
        {:else if block.type === BlockType.Paginate}
            <PaginateBlock bind:block={block} bind:recipe={recipe} inspector={inspector} bind:selectedBlockId={hovering} bind:hoveredBlockId={hoveredBlockId}/>
        {:else}
            <ExtractBlock bind:block={block} bind:recipe={recipe} inspector={inspector} bind:selectedBlockId={hovering}/>
        {/if}
    </div>
</div>
<style>
    .real-block {
        background-color: rgba(62, 69, 84, 1);
        box-shadow: 0 2px 15px 2px #000;
    }
    .block-start {
        border-left: 4px solid grey !important;
    }
    .block-input {
        border-left: 4px solid green !important;
    }
    .block-click {
        border-left: 4px solid #003c80 !important;
    }
    .block-extract {
        border-left: 4px solid red !important;
    }
    .block-paginate {
        border-left: 4px solid #c27ec7 !important;
    }
    .is-active .real-block, .real-block:hover {
        background-color: rgba(52, 57, 68, 1);
        color: #fff;
    }
    .cursor-grab {
        cursor: grab;
    }
</style>
