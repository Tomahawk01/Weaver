namespace Weaver {

    /** Represents an asset */
    export interface IAsset {

        /** Name of this asset. Readonly */
        readonly name: string;
        /** Data of this asset. Readonly */
        readonly data: any;
    }
}