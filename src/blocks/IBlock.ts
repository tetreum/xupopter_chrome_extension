export default interface IBlock {
    id: number;
    $html : HTMLElement;
    html() : string;
    onSelect() : void;
}