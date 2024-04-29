namespace Weaver {

    class MaterialReferenceNode {

        public material: Material;

        public referenceCount: number = 1;

        public constructor(material: Material) {
            this.material = material;
        }
    }

    export class MaterialManager {

        private static s_Materials: { [name: string]: MaterialReferenceNode } = {};

        private constructor() {
        }

        public static registerMaterial(material: Material): void {
            if (MaterialManager.s_Materials[material.name] === undefined) {
                MaterialManager.s_Materials[material.name] = new MaterialReferenceNode(material);
            }
        }

        public static getMaterial(materialName: string): Material {
            if (MaterialManager.s_Materials[materialName] === undefined) {
                return undefined;
            }
            else {
                MaterialManager.s_Materials[materialName].referenceCount++;
                return MaterialManager.s_Materials[materialName].material;
            }
        }

        public static releaseMaterial(materialName: string): void {
            if (MaterialManager.s_Materials[materialName] === undefined) {
                console.warn("Cannot release a material which has not been registered");
            }
            else {
                MaterialManager.s_Materials[materialName].referenceCount--;
                if (MaterialManager.s_Materials[materialName].referenceCount < 1) {
                    MaterialManager.s_Materials[materialName].material.destroy();
                    MaterialManager.s_Materials[materialName].material = undefined;
                    delete MaterialManager.s_Materials[materialName];
                }
            }
        }
    }
}