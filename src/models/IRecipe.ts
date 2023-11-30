import type IBlock from "./IBlock";

export enum ExpectedOutputType {
    Item = "item",
    List = "list",
}

export default interface IRecipe {
    id: string;
    name: string;
    schema: number;
    expected_output: ExpectedOutputType;
    blocks: IBlock[];
}
