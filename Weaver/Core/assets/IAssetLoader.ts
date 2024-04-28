namespace Weaver {

    /** Represents an asset loader */
    export interface IAssetLoader {

        /** Extensions supported by this asset loader (i.e. png, jpg) */
        readonly supportedExtensions: string[];
        /**
         * Loads an asset with the given name
         * @param assetName Name of the asset to be loaded
         */
        loadAsset(assetName: string): void;
    }
}