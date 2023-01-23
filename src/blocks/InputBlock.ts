import type IBlock from "./IBlock";

export default class InputBlock implements IBlock {
    public id: number;
    public $html: HTMLElement;

    public html () : string {
        return `
            <div class="text-center">
                <div class="mb-1"><strong>input</strong></div>
                <div class="text-muted">-</div>
            </div>
        `;
    }

    public onSelect(): void {
        console.log("onSelect");
    }
}