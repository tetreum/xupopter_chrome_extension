<script lang="ts">
    import { onMount } from "svelte";
    import Diagram from "./Diagram.svelte";
    import LeftMenu from "./LeftMenu.svelte";
    import * as BootstrapJS from "../content/bootstrap";
    import BootstrapCSS from "../content/bootstrap.min.css?inline";
    import FontAwesome from "../content/fa.css?inline";

    let styles;

	onMount(async () => {
        fetch('chrome-extension://' + chrome.runtime.id + '/src/assets/webfonts/fa-solid-900.woff2').then(async response => {
            let font = new FontFace('Font Awesome 6 Pro', await response.arrayBuffer());
            document.fonts.add(font)
        });

        const d = document.createElement("style");
        d.innerHTML = BootstrapCSS + FontAwesome;
        styles.appendChild(d);
    });
</script>

<div class="overlay d-flex">
    <LeftMenu />
    <Diagram />
    <div bind:this={styles} class="bootstrap"></div>
</div>


<style>
    .overlay {
        position: fixed;
        top: 0;
        right: 0;
        background-color: #161b26;
        border: 1px solid black;
        padding: 4px;
        z-index: 9999999;
        width: 30vw;
        height: 100vh;
        font-family: sans-serif;
        box-shadow: 0px 0px 10px #232931;
    }
</style>
