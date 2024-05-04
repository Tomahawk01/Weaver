namespace Weaver {

    export class BitmapTextComponentData implements IComponentData {

        public name: string;
        public fontName: string;
        public origin: Vector3 = Vector3.zero;
        public text: string;

        public setFromJson(json: any): void {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.fontName !== undefined) {
                this.fontName = String(json.fontName);
            }

            if (json.text !== undefined) {
                this.text = String(json.text);
            }

            if (json.origin !== undefined) {
                this.origin.setFromJson(json.origin);
            }
        }
    }

    export class BitmapTextComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "bitmapText";
        }

        public buildFromJson(json: any): IComponent {
            let data = new BitmapTextComponentData();
            data.setFromJson(json);
            return new BitmapTextComponent(data);
        }
    }

    export class BitmapTextComponent extends BaseComponent {

        private m_BitmapText: BitmapText;
        private m_FontName: string;

        public constructor(data: BitmapTextComponentData) {
            super(data);

            this.m_FontName = data.fontName;
            this.m_BitmapText = new BitmapText(this.name, this.m_FontName);
            if (!data.origin.equals(Vector3.zero)) {
                this.m_BitmapText.origin.copyFrom(data.origin);
            }

            this.m_BitmapText.text = data.text;
        }

        public load(): void {
            this.m_BitmapText.load();
        }

        public update(time: number): void {
            this.m_BitmapText.update(time);
        }

        public render(shader: Shader): void {
            this.m_BitmapText.draw(shader, this.owner.worldMatrix);
            super.render(shader);
        }
    }

    ComponentManager.registerBuilder(new BitmapTextComponentBuilder());
}