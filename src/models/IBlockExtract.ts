import type IBlock from "./IBlock";

export default interface IBlockExtract extends IBlock {
    details: {
        name: string;
        selector?: string;
        type?: string;
    };
}