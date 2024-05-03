namespace Weaver {

    /** Represents a 2D sprite which is drawn on the screen */
    export class Sprite {

        protected m_Name: string;
        protected m_Width: number;
        protected m_Height: number;
        protected m_Origin: Vector3 = Vector3.zero;

        protected m_Buffer: GLBuffer;
        protected m_MaterialName: string;
        protected m_Material: Material;
        protected m_Vertices: Vertex[] = [];

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

        public get origin(): Vector3 {
            return this.m_Origin;
        }

        public set origin(value: Vector3) {
            this.m_Origin = value;
            this.recalculateVertices();
        }

        public get width(): number {
            return this.m_Width;
        }

        public get height(): number {
            return this.m_Height;
        }

        public destroy(): void {
            this.m_Buffer.destroy();
            MaterialManager.releaseMaterial(this.m_MaterialName);
            this.m_Material = undefined;
            this.m_MaterialName = undefined;
        }

        /** Performs loading logic on this sprite */
        public load(): void {
            this.m_Buffer = new GLBuffer();

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this.m_Buffer.addAttributeLocation(positionAttribute);

            let texCoordAttribute = new AttributeInfo();
            texCoordAttribute.location = 1;
            texCoordAttribute.size = 2;
            this.m_Buffer.addAttributeLocation(texCoordAttribute);

            this.calculateVertices();
        }

        /**
         * Performs update logic on this sprite
         * @param time Delta time in milliseconds since the last update call
         */
        public update(time: number): void {

        }

        /** Draws this sprite */
        public draw(shader: Shader, model: Matrix4x4): void {
            let modelLocation = shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());

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

        protected calculateVertices(): void {
            let minX = -(this.m_Width * this.m_Origin.x);
            let maxX = this.m_Width * (1.0 - this.m_Origin.x);

            let minY = -(this.m_Height * this.m_Origin.y);
            let maxY = this.m_Height * (1.0 - this.m_Origin.y);

            this.m_Vertices = [
                // x,y,z,   u,v
                new Vertex(minX, minY, 0, 0, 0),
                new Vertex(minX, maxY, 0, 0, 1.0),
                new Vertex(maxX, maxY, 0, 1.0, 1.0),

                new Vertex(maxX, maxY, 0, 1.0, 1.0),
                new Vertex(maxX, minY, 0, 1.0, 0),
                new Vertex(minX, minY, 0, 0, 0)
            ];

            for (let v of this.m_Vertices) {
                this.m_Buffer.pushbackData(v.toArray());
            }

            this.m_Buffer.upload();
            this.m_Buffer.unbind();
        }

        protected recalculateVertices(): void {
            let minX = -(this.m_Width * this.m_Origin.x);
            let maxX = this.m_Width * (1.0 - this.m_Origin.x);

            let minY = -(this.m_Height * this.m_Origin.y);
            let maxY = this.m_Height * (1.0 - this.m_Origin.y);

            this.m_Vertices[0].position.set(minX, minY);
            this.m_Vertices[1].position.set(minX, maxY);
            this.m_Vertices[2].position.set(maxX, maxY);

            this.m_Vertices[3].position.set(maxX, maxY);
            this.m_Vertices[4].position.set(maxX, minY);
            this.m_Vertices[5].position.set(minX, minY);

            this.m_Buffer.clearData();

            for (let v of this.m_Vertices) {
                this.m_Buffer.pushbackData(v.toArray());
            }

            this.m_Buffer.upload();
            this.m_Buffer.unbind();
        }
    }
}