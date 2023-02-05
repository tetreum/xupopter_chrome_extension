export enum BlockType {
    Start = "start",
    Extract = "extract",
    Input = "input",
    Click = "click",
    Paginate = "paginate",
}

export default interface IBlock {
    id: string;
    type: BlockType;
    details: object;
}