export enum BlockType {
    Start = "start",
    Extract = "extract",
    Input = "input",
    Click = "click",
}

export default interface IBlock {
    type: BlockType;
    details: object;
}