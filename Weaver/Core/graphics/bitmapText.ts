namespace Weaver {

    export class BitmapText {

        private m_FontName: string;
        private m_IsDirty: boolean = false;

        protected m_Name: string;
        protected m_Origin: Vector3 = Vector3.zero;

        protected m_Buffer: GLBuffer;
        protected m_Material: Material;
        protected m_BitmapFont: BitmapFont;
        protected m_Vertices: Vertex[] = [];
        protected m_Text: string;

        public constructor(name: string, fontName: string) {
            this.m_Name = name;
            this.m_FontName = fontName;
        }

        public get name(): string {
            return this.m_Name;
        }

        public get text(): string {
            return this.m_Text;
        }

        public set text(value: string) {
            if (this.m_Text !== value) {
                this.m_Text = value;
                this.m_IsDirty = true;
            }
        }

        public get origin(): Vector3 {
            return this.m_Origin;
        }

        public set origin(value: Vector3) {
            this.m_Origin = value;
            this.calculateVertices();
        }

        public destroy(): void {
            this.m_Buffer.destroy();
            this.m_Material.destroy();
            this.m_Material = undefined;
        }

        public load(): void {
            this.m_BitmapFont = BitmapFontManager.getFont(this.m_FontName);
            this.m_Material = new Material(`BITMAP_FONT_${this.name}_${this.m_BitmapFont.size}`, this.m_BitmapFont.textureName, Color.white());
            this.m_Buffer = new GLBuffer();

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this.m_Buffer.addAttributeLocation(positionAttribute);

            let texCoordAttribute = new AttributeInfo();
            texCoordAttribute.location = 1;
            texCoordAttribute.size = 2;
            this.m_Buffer.addAttributeLocation(texCoordAttribute);
        }

        public update(time: number): void {
            if (this.m_IsDirty && this.m_BitmapFont.isLoaded) {
                this.calculateVertices();
                this.m_IsDirty = false;
            }
        }

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

        private calculateVertices(): void {
            this.m_Vertices.length = 0;
            this.m_Buffer.clearData();

            let x = 0;
            let y = 0;

            for (let c of this.m_Text) {
                if (c === "\n") {
                    x = 0;
                    y += this.m_BitmapFont.size;
                    continue;
                }

                let g = this.m_BitmapFont.getGlyph(c);

                let minX = x + g.xOffset;
                let minY = y + g.yOffset;
                let maxX = minX + g.width;
                let maxY = minY + g.height;

                let minU = g.x / this.m_BitmapFont.imageWidth;
                let minV = g.y / this.m_BitmapFont.imageHeight;
                let maxU = (g.x + g.width) / this.m_BitmapFont.imageWidth;
                let maxV = (g.y + g.height) / this.m_BitmapFont.imageHeight;

                this.m_Vertices.push(new Vertex(minX, minY, 0, minU, minV));
                this.m_Vertices.push(new Vertex(minX, maxY, 0, minU, maxV));
                this.m_Vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
                this.m_Vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
                this.m_Vertices.push(new Vertex(maxX, minY, 0, maxU, minV));
                this.m_Vertices.push(new Vertex(minX, minY, 0, minU, minV));

                x += g.xAdvance;
            }

            for (let v of this.m_Vertices) {
                this.m_Buffer.pushbackData(v.toArray());
            }

            this.m_Buffer.upload();
            this.m_Buffer.unbind();
        }
    }
}