namespace Weaver {

    export class SpriteComponentData implements IComponentData {

        public name: string;
        public materialName: string;

        public setFromJson(json: any): void {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.materialName !== undefined) {
                this.materialName = String(json.materialName);
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

        public constructor(data: SpriteComponentData) {
            super(data);

            this.m_Sprite = new Sprite(this.name, data.materialName);
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