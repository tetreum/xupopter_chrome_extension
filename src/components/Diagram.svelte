<script lang="ts">
    import Drawflow from 'drawflow'
    import styleDrawflow from 'drawflow/dist/drawflow.min.css?inline'
    import customStyles from '../content/global.css?inline'
    import { onMount } from 'svelte';
    import RecipeEditor from 'src/lib/RecipeEditor';

    export let editor;

    let styles;

	onMount(async () => {
        const d = document.createElement("style");
        d.innerHTML = styleDrawflow + customStyles;
        styles.appendChild(d);
    });

    function drawflow(node) {
        editor = new RecipeEditor(node);
        console.log(editor)
	}
</script>
<div class="w-100">
    <div>Diagram</div>
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
</style>

