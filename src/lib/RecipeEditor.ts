import Drawflow from "drawflow";
import type IBlock from "src/blocks/IBlock";
import InputBlock from "src/blocks/InputBlock";


export default class RecipeEditor {

    private editor: Drawflow;
    private shadowDOM : ShadowRoot;
    private blocks: IBlock[] = [];

    constructor (node: HTMLElement, shadowDOM : ShadowRoot) {
		this.shadowDOM = shadowDOM;
        this.setupEditor(node);
        this.drawStartBlock();
    }

    private setupEditor (node: HTMLElement) : void {
        this.editor = new Drawflow(node);
		this.editor.start();
        this.editor.on("nodeSelected", (nodeId: number) => {
            // @ts-ignore
            nodeId = parseInt(nodeId);
            this.getBlock(nodeId).onSelect();
        });
    }

    private getBlock (id : number) : IBlock {
        return this.blocks.find(b => b.id === id);
    }

    drawStartBlock () : void {
        const html = `
            <div class="text-center">
                <div class="mb-1"><strong>start</strong></div>
                <div class="text-muted">` + location.href + `</div>
            </div>
        `;
        const data = {};
        this.addNode('start', this.getLowestY() + 30, data, html);
    }

    addNode (name: string, posY: number, data: any, html: string, inputs?: number, outputs?: number) : number {
        return this.editor.addNode(name, 0, 1, 80, this.getLowestY() + 30, 'block-' + name, data, html, false); 
    }

    addBlock (type: string) : void {
        let block;

        switch (type) {
            case "input":
                block = new InputBlock();
                break;
        }

        const data = {};
        const nodeId = this.addNode('input', this.getLowestY() + 30, data, block.html());

        block.id = nodeId;
        block.$html = this.getNodeHTML(nodeId);
        this.blocks.push(block);

        // @ts-ignore
        this.editor.click({
            target: block.$html
        });
    }

    getNodeHTML (nodeId: number) : HTMLElement {
        return this.shadowDOM.getElementById("node-" + nodeId);
    }

    getLowestY () : number {
        let height = 0;

        Object.keys(this.editor.drawflow.drawflow.Home.data).forEach(id => {
            const node = this.editor.drawflow.drawflow.Home.data[id];
            const el = this.shadowDOM.getElementById("node-" + node.id);
            height += el.clientHeight + 10;
        });

        return height;
    }
}