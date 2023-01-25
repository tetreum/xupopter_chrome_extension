import type IBlock from "./IBlock";

export default class InputBlock implements IBlock {
    public id: number;
    public $html: HTMLElement;
    private editor;

    public html () : string {
        return `
            <div class="text-center">
                <div class="mb-1"><strong>input</strong></div>
                <div class="text-muted">-</div>
            </div>
        `;
    }

    public onSelect(): void {
        this.editor.inspector.enable();
        console.log("onSelect");
    }
}