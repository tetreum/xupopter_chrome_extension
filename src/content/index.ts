import { shadowDOM } from "src/stores/shadow";
import { shouldLoadOn } from "src/storage";
import Overlay from "../components/Overlay.svelte";

const showXupopter = () => {
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

    shadowDOM.set(shadow);

    new Overlay({ target: shadow });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (typeof request.showXupopter === "undefined") {
        return;
    }
    const container = document.getElementById("xupopter-extension-container");
    if (request.showXupopter && !container) {
        showXupopter();
    } else if (!request.showXupopter && container) {
        container.remove();
    }
});

shouldLoadOn(window.location.hostname).then(showLoad => {
    if (!showLoad) {
        return;
    }

    showXupopter();
});