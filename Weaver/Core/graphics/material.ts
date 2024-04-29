namespace Weaver {

    export class Material {

        private m_Name: string;
        private m_DiffuseTextureName: string;

        private m_DiffuseTexture: Texture;
        private m_Tint: Color;

        public constructor(name: string, diffuseTextureName: string, tint: Color) {
            this.m_Name = name;
            this.m_DiffuseTextureName = diffuseTextureName;
            this.m_Tint = tint;

            if (this.m_DiffuseTextureName !== undefined) {
                this.m_DiffuseTexture = TextureManager.getTexture(this.m_DiffuseTextureName);
            }
        }

        public get name(): string {
            return this.m_Name;
        }

        public get diffuseTextureName(): string {
            return this.m_DiffuseTextureName;
        }

        public get diffuseTexture(): Texture {
            return this.m_DiffuseTexture;
        }

        public get tint(): Color {
            return this.m_Tint;
        }

        public set diffuseTextureName(value: string) {
            if (this.m_DiffuseTexture !== undefined) {
                TextureManager.releaseTexture(this.m_DiffuseTextureName);
            }

            this.m_DiffuseTextureName = value;

            if (this.m_DiffuseTextureName !== undefined) {
                this.m_DiffuseTexture = TextureManager.getTexture(this.m_DiffuseTextureName);
            }
        }

        public destroy(): void {
            TextureManager.releaseTexture(this.m_DiffuseTextureName);
            this.m_DiffuseTexture = undefined;
        }
    }
}