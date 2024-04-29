namespace Weaver {

    export class SpriteComponent extends BaseComponent {

        private m_Sprite: Sprite;

        public constructor(name: string, materialName: string) {
            super(name);

            this.m_Sprite = new Sprite(name, materialName);
        }

        public load(): void {
            this.m_Sprite.load();
        }

        public render(shader: Shader): void {
            this.m_Sprite.draw(shader, this.owner.worldMatrix);

            super.render(shader);
        }
    }
}