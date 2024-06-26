﻿namespace Weaver {

    export const MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED::";

    /** Manages all assets in the engine */
    export class AssetManager {

        private static s_Loaders: IAssetLoader[] = [];
        private static s_LoadedAssets: { [name: string]: IAsset } = {};

        /** Private to enforce static method calls and prevent instantiation*/
        private constructor() {
        }

        /** Initialize this manager */
        public static initialize(): void {
            AssetManager.s_Loaders.push(new ImageAssetLoader());
            AssetManager.s_Loaders.push(new JsonAssetLoader());
            AssetManager.s_Loaders.push(new TextAssetLoader());
        }

        /**
         * Registers provided loader with the asset manager
         * @param loader Loader to be registered
         */
        public static registerLoader(loader: IAssetLoader): void {
            AssetManager.s_Loaders.push(loader);
        }

        /**
         * A callback to be made from an asset loader when an asset is loaded
         * @param asset
         */
        public static onAssetLoaded(asset: IAsset): void {
            AssetManager.s_LoadedAssets[asset.name] = asset;
            Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
        }

        /**
         * Attempts to load an asset using a registered asset loader
         * @param assetName Name/url of the asset to be loaded
         */
        public static loadAsset(assetName: string): void {
            let extension = assetName.split('.').pop().toLowerCase();
            for (let l of AssetManager.s_Loaders) {
                if (l.supportedExtensions.indexOf(extension) !== -1) {
                    l.loadAsset(assetName);
                    return;
                }
            }

            console.warn("Unable to load asset with extension " + extension + ". There is no loader associated with it")
        }

        /**
         * Indicates if an asset with provided name has been loaded
         * @param assetName Asset name to check
         */
        public static isAssetLoaded(assetName: string): boolean {
            return AssetManager.s_LoadedAssets[assetName] !== undefined;
        }

        /**
         * Attempts to get an asset with provided name
         * @param assetName Asset name to get
         * @returns If found it is returned; otherwise undefined is returned
         */
        public static getAsset(assetName: string): IAsset {
            if (AssetManager.s_LoadedAssets[assetName] !== undefined) {
                return AssetManager.s_LoadedAssets[assetName];
            }
            else {
                AssetManager.loadAsset(assetName);
            }

            return undefined;
        }
    }
}