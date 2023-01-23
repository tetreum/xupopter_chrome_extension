import { shadowDOM } from "src/stores/shadow";
import Overlay from "../components/Overlay.svelte";
import { storage } from "../storage";


// Some svelte component on the page
const wrapper = document.createElement('div');
wrapper.id = "xupopter-extension-container";

wrapper.style.all = 'initial';
/*
wrapper.style.position = "absolute";
wrapper.style.top = "0";
wrapper.style.right = "0";
wrapper.style.zIndex = "2147483647";
wrapper.style.height = "100vh";
*/

document.body.append(wrapper);
const shadow = wrapper.attachShadow({mode: "open"});

// @ts-ignore
shadowDOM.set(shadow);

new Overlay({ target: shadow });
