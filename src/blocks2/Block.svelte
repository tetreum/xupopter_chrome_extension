<script>
    import StartBlock from "./StartBlock.svelte";
    import ExtractBlock from "./ExtractBlock.svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let index;
    export let block;
    export let hovering;
    export let inspector;
</script>
<div class="text-white p-2" 
    draggable={true} 
    class:is-active={hovering === index}
    on:dragstart={event => dispatch('dragstart', {event})}
    on:dragover|preventDefault={e => {return false}}
    on:drop|preventDefault={event => dispatch('drop', {event})}
    on:dragenter={() => hovering = index}
>
    <div class="real-block mb-2 p-2 block-{block.type}">
        {#if block.type === 'start'}
            <StartBlock/>
        {:else if block.type === "extract"}
            <ExtractBlock block={block} inspector={inspector}/>
        {:else}
            <ExtractBlock block={block} inspector={inspector}/>
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
    .block-extract {
        border-left: 4px solid red !important;
    }
    .is-active .real-block, .real-block:hover {
        background-color: rgba(52, 57, 68, 1);
        color: #fff;
    }
</style>
