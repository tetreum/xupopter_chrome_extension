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
        const html = `
            <div class="text-center">
                <div class="mb-1"><strong>input</strong></div>
                <div class="text-muted">-</div>
            </div>
        `;
        const data = {};
        
        
        this.editor.addNode('input', 0, 1, 10, this.getLowestY() + 10, 'block-input', data, html, false); 
    }

    addBlock (type: string) : void {
        switch (type) {
            case "input":
                this.drawInputBlock();
                break;
        }
    }

    getLowestY () : number {
        let y = 0;
        Object.keys(this.editor.drawflow.drawflow.Home.data).forEach(id => {
            const node = this.editor.drawflow.drawflow.Home.data[id];
            if (node.pos_y > y) {
                y = node.pos_y;
            }
        });

        return y;
    }
}