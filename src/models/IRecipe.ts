import type IBlock from "./IBlock";

export default interface IRecipe {
    uuid: string;
    name: string;
    schema: number;
    blocks: IBlock[];
}