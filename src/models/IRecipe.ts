import type IBlock from "./IBlock";

export default interface IRecipe {
    id: string;
    name: string;
    schema: number;
    blocks: IBlock[];
}