namespace Weaver {

    export class MouseClickBehaviorData implements IBehaviorData {

        public name: string;
        public width: number;
        public height: number;
        public messageCode: string;

        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("'name' must be defined in behavior data");
            }
            this.name = String(json.name);

            if (json.width === undefined) {
                throw new Error("'width' must be defined in behavior data");
            }
            else {
                this.width = Number(json.width);
            }

            if (json.height === undefined) {
                throw new Error("'height' must be defined in behavior data");
            }
            else {
                this.height = Number(json.height);
            }

            if (json.messageCode === undefined) {
                throw new Error("'messageCode' must be defined in behavior data");
            }
            else {
                this.messageCode = String(json.messageCode);
            }
        }
    }

    export class MouseClickBehaviorBuilder implements IBehaviorBuilder {

        public get type(): string {
            return "mouseClick";
        }

        public buildFromJson(json: any): IBehavior {
            let data = new MouseClickBehaviorData();
            data.setFromJson(json);
            return new MouseClickBehavior(data);
        }
    }

    export class MouseClickBehavior extends BaseBehavior implements IMessageHandler {

        private m_Width: number;
        private m_Height: number;
        private m_MessageCode: string;

        public constructor(data: MouseClickBehaviorData) {
            super(data);

            this.m_Width = data.width;
            this.m_Height = data.height;
            this.m_MessageCode = data.messageCode;

            Message.subscribe("MOUSE_UP", this);
        }

        public onMessage(message: Message): void {
            if (message.code === "MOUSE_UP") {
                if (!this.m_Owner.isVisible) {
                    return;
                }
                let context = message.context as MouseContext;
                let worldPos = this.m_Owner.getWorldPosition();
                let extentsX = worldPos.x + this.m_Width;
                let extentsY = worldPos.y + this.m_Height;
                if (context.position.x >= worldPos.x && context.position.x <= extentsX &&
                    context.position.y >= worldPos.y && context.position.y <= extentsY) {
                    // Send configured message
                    Message.send(this.m_MessageCode, this);
                }
            }
        }
    }

    BehaviorManager.registerBuilder(new MouseClickBehaviorBuilder());
}