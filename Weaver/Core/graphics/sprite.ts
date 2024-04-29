namespace Weaver {

    /** Represents a 2D sprite which is drawn on the screen */
    export class Sprite {

        private m_Name: string;
        private m_Width: number;
        private m_Height: number;

        private m_Buffer: GLBuffer;
        private m_MaterialName: string;
        private m_Material: Material;

        /** Position of this sprite */
        public position: Vector3 = new Vector3();

        /**
         * Creates a new sprite
         * @param name Name of this sprite
         * @param materialName Name of the material to use with this sprite
         * @param width Width of this sprite
         * @param height Height of this sprite
         */
        public constructor(name: string, materialName: string, width: number = 100, height: number = 100) {
            this.m_Name = name;
            this.m_Width = width;
            this.m_Height = height;
            this.m_MaterialName = materialName;
            this.m_Material = MaterialManager.getMaterial(this.m_MaterialName);
        }

        public get name(): string {
            return this.m_Name;
        }

        public destroy(): void {
            this.m_Buffer.destroy();
            MaterialManager.releaseMaterial(this.m_MaterialName);
            this.m_Material = undefined;
            this.m_MaterialName = undefined;
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
            let modelLocation = shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelLocation, false, new Float32Array(Matrix4x4.translation(this.position).data));

            let colorLocation = shader.getUniformLocation("u_tint");
            gl.uniform4fv(colorLocation, this.m_Material.tint.toFloat32Array());

            if (this.m_Material.diffuseTexture !== undefined) {
                this.m_Material.diffuseTexture.activateAndBind(0);
                let diffuseLocation = shader.getUniformLocation("u_diffuse");
                gl.uniform1i(diffuseLocation, 0);
            }

            this.m_Buffer.bind();
            this.m_Buffer.draw();
        }
    }
}