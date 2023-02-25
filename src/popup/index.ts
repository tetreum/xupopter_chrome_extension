import Options from "src/components/Options.svelte";
import { storage } from "src/storage";

const target = document.getElementById("app");

/*
function render() {
    //storage.get().then(({ count }) => {
        let count = 0;
        new Options({ target, props: { count } });
    //});
}*/

Promise.all([
    chrome.tabs.query({ active: true, currentWindow: true }),
    storage.get()
])
.then((responses) => {
    const currentTab = responses[0][0];
    if (!currentTab.url) {
        return;
    }
    const hostname = (new URL(currentTab.url)).hostname;
    let data = responses[1];

    if (data.visibility.includes(hostname)) {
        data.visibility.splice(data.visibility.indexOf(hostname), 1);
    } else {
        data.visibility.push(hostname);
    }

    chrome.tabs.sendMessage(currentTab.id, {showXupopter: data.visibility.includes(hostname)});

    storage.set(data);
    window.close();
});
