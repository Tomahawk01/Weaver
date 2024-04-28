namespace Weaver {

    /** Represents a 2D sprite which is drawn on the screen */
    export class Sprite {

        private m_Name: string;
        private m_Width: number;
        private m_Height: number;

        private m_Buffer: GLBuffer;
        private m_TextureName: string;
        private m_Texture: Texture;

        /** Position of this sprite */
        public position: Vector3 = new Vector3();

        /**
         * Creates a new sprite
         * @param name Name of this sprite
         * @param textureName Name of the texture to use with this sprite
         * @param width Width of this sprite
         * @param height Height of this sprite
         */
        public constructor(name: string, textureName: string, width: number = 100, height: number = 100) {
            this.m_Name = name;
            this.m_Width = width;
            this.m_Height = height;
            this.m_TextureName = textureName;
            this.m_Texture = TextureManager.getTexture(this.m_TextureName);
        }

        public get name(): string {
            return this.m_Name;
        }

        public destroy(): void {
            this.m_Buffer.destroy();
            TextureManager.releaseTexture(this.m_TextureName);
        }

        /** Performs loading logic on this sprite */
        public load(): void {
            this.m_Buffer = new GLBuffer(5);

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this.m_Buffer.addAttributeLocation(positionAttribute);

            let texCoordAttribute = new AttributeInfo();
            texCoordAttribute.location = 1;
            texCoordAttribute.offset = 3;
            texCoordAttribute.size = 2;
            this.m_Buffer.addAttributeLocation(texCoordAttribute);

            let vertices = [
                // x,y,z,   u,v
                0, 0, 0, 0, 0,
                0, this.m_Height, 0, 0, 1.0,
                this.m_Width, this.m_Height, 0, 1.0, 1.0,

                this.m_Width, this.m_Height, 0, 1.0, 1.0,
                this.m_Width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0
            ];

            this.m_Buffer.pushbackData(vertices);
            this.m_Buffer.upload();
            this.m_Buffer.unbind();
        }

        /**
         * Performs update logic on this sprite
         * @param time Delta time in milliseconds since the last update call
         */
        public update(time: number): void {

        }

        /** Draws this sprite */
        public draw(shader: Shader): void {
            this.m_Texture.activateAndBind(0);
            let diffuseLocation = shader.getUniformLocation("u_diffuse");
            gl.uniform1i(diffuseLocation, 0);

            this.m_Buffer.bind();
            this.m_Buffer.draw();
        }
    }
}