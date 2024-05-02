namespace Weaver {

    export class SpriteComponentData implements IComponentData {

        public name: string;
        public materialName: string;
        public origin: Vector3 = Vector3.zero;
        public width: number;
        public height: number;

        public setFromJson(json: any): void {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.width !== undefined) {
                this.width = Number(json.width);
            }

            if (json.height !== undefined) {
                this.height = Number(json.height);
            }

            if (json.materialName !== undefined) {
                this.materialName = String(json.materialName);
            }

            if (json.origin !== undefined) {
                this.origin.setFromJson(json.origin);
            }
        }
    }

    export class SpriteComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "sprite";
        }

        public buildFromJson(json: any): IComponent {
            let data = new SpriteComponentData();
            data.setFromJson(json);
            return new SpriteComponent(data);
        }
    }

    export class SpriteComponent extends BaseComponent {

        private m_Sprite: Sprite;
        private m_Width: number;
        private m_Height: number;

        public constructor(data: SpriteComponentData) {
            super(data);

            this.m_Width = data.width;
            this.m_Height = data.height;
            this.m_Sprite = new Sprite(this.name, data.materialName, this.m_Width, this.m_Height);
            if (!data.origin.equals(Vector3.zero)) {
                this.m_Sprite.origin.copyFrom(data.origin);
            }
        }

        public load(): void {
            this.m_Sprite.load();
        }

        public render(shader: Shader): void {
            this.m_Sprite.draw(shader, this.owner.worldMatrix);

            super.render(shader);
        }
    }

    ComponentManager.registerBuilder(new SpriteComponentBuilder());
}