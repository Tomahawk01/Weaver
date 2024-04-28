namespace Weaver {

    class TextureReferenceNode {
        public texture: Texture;
        public referenceCount: number = 1;

        public constructor(texture: Texture) {
            this.texture = texture;
        }
    }

    export class TextureManager {

        private static s_Textures: { [name: string]: TextureReferenceNode } = {};

        private constructor() {
        }

        public static getTexture(textureName: string): Texture {
            if (TextureManager.s_Textures[textureName] === undefined) {
                let texture = new Texture(textureName);
                TextureManager.s_Textures[textureName] = new TextureReferenceNode(texture);
            }
            else {
                TextureManager.s_Textures[textureName].referenceCount++;
            }

            return TextureManager.s_Textures[textureName].texture;
        }

        public static releaseTexture(textureName: string): void {
            if (TextureManager.s_Textures[textureName] === undefined) {
                console.warn(`Texture named ${textureName} does not exist an cannot be released`);
            }
            else {
                TextureManager.s_Textures[textureName].referenceCount--;
                if (TextureManager.s_Textures[textureName].referenceCount < 1) {
                    TextureManager.s_Textures[textureName].texture.destroy();
                    TextureManager.s_Textures[textureName] = undefined;
                    delete TextureManager.s_Textures[textureName];
                }
            }
        }
    }
}