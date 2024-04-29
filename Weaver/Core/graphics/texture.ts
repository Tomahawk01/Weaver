namespace Weaver {

    const LEVEL: number = 0;
    const BORDER: number = 0;
    const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]);

    export class Texture implements IMessageHandler {

        private m_Name: string;
        private m_Handle: WebGLTexture;
        private m_IsLoaded: boolean = false;
        private m_Width: number;
        private m_Height: number;

        public constructor(name: string, width: number = 1, height: number = 1) {
            this.m_Name = name;
            this.m_Width = width;
            this.m_Height = height;

            this.m_Handle = gl.createTexture();
            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_Name, this);
            this.bind();

            gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

            let asset = AssetManager.getAsset(this.name) as ImageAsset;
            if (asset !== undefined) {
                this.loadTextureFromAsset(asset);
            }
        }

        public get name(): string {
            return this.m_Name;
        }

        public get isLoaded(): boolean {
            return this.m_IsLoaded;
        }

        public get width(): number {
            return this.m_Width;
        }

        public get height(): number {
            return this.m_Height;
        }

        public destroy(): void {
            gl.deleteTexture(this.m_Handle);
        }

        public activateAndBind(textureUnit: number = 0): void {
            gl.activeTexture(gl.TEXTURE0 + textureUnit);

            this.bind();
        }

        public bind(): void {
            gl.bindTexture(gl.TEXTURE_2D, this.m_Handle);
        }

        public unbind(): void {
            gl.bindTexture(gl.TEXTURE_2D, undefined);
        }

        public onMessage(message: Message): void {
            if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_Name) {
                this.loadTextureFromAsset(message.context as ImageAsset);
            }
        }

        private loadTextureFromAsset(asset: ImageAsset): void {
            this.m_Width = asset.width;
            this.m_Height = asset.height;

            this.bind();

            gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data);

            if (this.isPowerOf2()) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                // Do not generate mipmap and clamp wrapping to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // u
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // v
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            }

            this.m_IsLoaded = true;
        }

        private isPowerOf2(): boolean {
            return (this.isValuePowerOf2(this.width) && this.isValuePowerOf2(this.height));
        }

        private isValuePowerOf2(value: number): boolean {
            return (value & (value - 1)) == 0;
        }
    }
}