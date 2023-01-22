import Drawflow from "drawflow";

export default class RecipeEditor {

    private editor: Drawflow;

    constructor (node: HTMLElement) {
		this.editor = new Drawflow(node);
		this.editor.start();
        this.drawStartBlock();
    }

    drawStartBlock () : void {
        const html = `
            <div class="text-center">
                <div class="mb-1"><strong>start</strong></div>
                <div class="text-muted">` + location.href + `</div>
            </div>
        `;
        const data = {};
        this.editor.addNode('start', 0, 1, 10, 10, 'block-start', data, html, false); 
    }

    drawInputBlock () : void {
        console.log("dale");
    }

    addBlock (type: string) : void {
        switch (type) {
            case "input":
                this.drawInputBlock();
                break;
        }
    }
}