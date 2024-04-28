namespace Weaver {

    /** Represents an image asset */
    export class ImageAsset implements IAsset {

        /** Name of this asset */
        public readonly name: string;
        /** Data of this asset */
        public readonly data: HTMLImageElement;

        /**
         * Creates a new image asset
         * @param name Name of this asset
         * @param data Data of this asset
         */
        public constructor(name: string, data: HTMLImageElement) {
            this.name = name;
            this.data = data;
        }

        /** Width of this image asset */
        public get width(): number {
            return this.data.width;
        }

        /** Height of this image asset */
        public get height(): number {
            return this.data.height;
        }
    }

    /** Represents an image asset loader */
    export class ImageAssetLoader implements IAssetLoader {

        /** Extensions supported by this asset loader */
        public get supportedExtensions(): string[] {
            return ["png", "gif", "jpg"];
        }

        /**
         * Loads an asset with the given name
         * @param assetName Name of the asset to be loaded
         */
        public loadAsset(assetName: string): void {
            let image: HTMLImageElement = new Image();
            image.onload = this.onImageLoaded.bind(this, assetName, image);
            image.src = assetName;
        }

        private onImageLoaded(assetName: string, image: HTMLImageElement): void {
            console.log("onImageLoaded: assetName/image", assetName, image);
            let asset = new ImageAsset(assetName, image);
            AssetManager.onAssetLoaded(asset);
        }
    }
}