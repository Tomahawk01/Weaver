/// <reference path="sprite.ts" />

namespace Weaver {

    class UVInfo {

        public min: Vector2;
        public max: Vector2;

        public constructor(min: Vector2, max: Vector2) {
            this.min = min;
            this.max = max;
        }
    }

    /** Represents a 2D animated sprite which is drawn on the screen */
    export class AnimatedSprite extends Sprite implements IMessageHandler {

        private m_FrameWidth: number;
        private m_FrameHeight: number;
        private m_FrameCount: number;
        private m_FrameSequence: number[];

        private m_FrameTime: number = 333;
        private m_FrameUVs: UVInfo[] = [];
        private m_CurrentFrame: number = 0;
        private m_CurrentTime: number = 0;
        private m_AssetLoaded: boolean = false;
        private m_AssetWidth: number = 2;
        private m_AssetHeight: number = 2;
        private m_IsPlaying: boolean = true;

        /**
         * Creates a new animated sprite
         * @param name Name of this sprite
         * @param materialName Name of the material to use with this sprite
         * @param width Width of this sprite
         * @param height Height of this sprite
         * @param frameWidth Width of each frame in the sprite sheet. Default: 10
         * @param frameHeight Height of each frame in the sprite sheet. Default: 10
         * @param frameCount Total number of frames in the sprite sheet. Default: 1
         * @param frameSequence The sequence of frame indices to use for animation
         */
        public constructor(name: string, materialName: string, width: number = 100, height: number = 100, frameWidth: number = 10, frameHeight: number = 10, frameCount: number = 1, frameSequence: number[] = []) {
            super(name, materialName, width, height);

            this.m_FrameWidth = frameWidth;
            this.m_FrameHeight = frameHeight;
            this.m_FrameCount = frameCount;
            this.m_FrameSequence = frameSequence;

            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_Material.diffuseTextureName, this);
        }

        /** Indicates if this animated sprite is currently playing */
        public get isPlaying(): boolean {
            return this.m_IsPlaying;
        }

        public destroy(): void {
            super.destroy();
        }

        public play(): void {
            this.m_IsPlaying = true;
        }

        public stop(): void {
            this.m_IsPlaying = false;
        }

        /**
         * Sets the desired frame index for the animated sprite
         * @param frameNumber Frame to set
         */
        public setFrame(frameNumber: number): void {
            if (frameNumber >= this.m_FrameCount) {
                throw new Error("Frame is out of range: " + frameNumber + ", frame count: " + this.m_FrameCount);
            }

            this.m_CurrentFrame = frameNumber;
        }

        /**
         * Message handler for this component
         * @param message Message to be handled
         */
        public onMessage(message: Message): void {
            if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_Material.diffuseTextureName) {
                this.m_AssetLoaded = true;
                let asset = message.context as ImageAsset;
                this.m_AssetWidth = asset.width;
                this.m_AssetHeight = asset.height;
                this.calculateUVs();
            }
        }

        /** Performs loading logic on this animated sprite */
        public load(): void {
            super.load();

            if (!this.m_AssetLoaded) {
                this.setupFromMaterial();
            }
        }

        /**
         * Performs update logic on this animated sprite
         * @param time Delta time in milliseconds since the last update call
         */
        public update(time: number): void {
            if (!this.m_AssetLoaded) {
                this.setupFromMaterial();
                return;
            }

            if (!this.m_IsPlaying) {
                return;
            }

            this.m_CurrentTime += time;
            if (this.m_CurrentTime > this.m_FrameTime) {
                this.m_CurrentFrame++;
                this.m_CurrentTime = 0;

                if (this.m_CurrentFrame >= this.m_FrameSequence.length) {
                    this.m_CurrentFrame = 0;
                }

                let frameUVs = this.m_FrameSequence[this.m_CurrentFrame];
                this.m_Vertices[0].texCoords.copyFrom(this.m_FrameUVs[frameUVs].min);
                this.m_Vertices[1].texCoords = new Vector2(this.m_FrameUVs[frameUVs].min.x, this.m_FrameUVs[frameUVs].max.y);
                this.m_Vertices[2].texCoords.copyFrom(this.m_FrameUVs[frameUVs].max);
                this.m_Vertices[3].texCoords.copyFrom(this.m_FrameUVs[frameUVs].max);
                this.m_Vertices[4].texCoords = new Vector2(this.m_FrameUVs[frameUVs].max.x, this.m_FrameUVs[frameUVs].min.y);
                this.m_Vertices[5].texCoords.copyFrom(this.m_FrameUVs[frameUVs].min);

                this.m_Buffer.clearData();
                for (let v of this.m_Vertices) {
                    this.m_Buffer.pushbackData(v.toArray());
                }

                this.m_Buffer.upload();
                this.m_Buffer.unbind();
            }

            super.update(time);
        }

        private calculateUVs(): void {
            let totalWidth: number = 0;
            let yValue: number = 0;
            for (let i = 0; i < this.m_FrameCount; ++i) {
                totalWidth += i * this.m_FrameWidth;
                if (totalWidth > this.m_AssetWidth) {
                    yValue++;
                    totalWidth = 0;
                }

                let uMin = (i * this.m_FrameWidth) / this.m_AssetWidth;
                let vMin = (yValue * this.m_FrameHeight) / this.m_AssetHeight;
                let min: Vector2 = new Vector2(uMin, vMin);

                let uMax = ((i * this.m_FrameWidth) + this.m_FrameWidth) / this.m_AssetWidth;
                let vMax = ((yValue * this.m_FrameHeight) + this.m_FrameHeight) / this.m_AssetHeight;
                let max: Vector2 = new Vector2(uMax, vMax);


                this.m_FrameUVs.push(new UVInfo(min, max));
            }
        }

        private setupFromMaterial(): void {
            if (!this.m_AssetLoaded) {
                let material = MaterialManager.getMaterial(this.m_MaterialName);
                if (material.diffuseTexture.isLoaded) {
                    if (AssetManager.isAssetLoaded(material.diffuseTextureName)) {
                        this.m_AssetHeight = material.diffuseTexture.height;
                        this.m_AssetWidth = material.diffuseTexture.width;
                        this.m_AssetLoaded = true;
                        this.calculateUVs();
                    }
                }
            }
        }
    }
}