namespace Weaver {

    export class ScrollBehaviorData implements IBehaviorData {

        public name: string;
        public velocity: Vector2 = Vector2.zero;
        public minPosition: Vector2 = Vector2.zero;
        public resetPosition: Vector2 = Vector2.zero;
        public minResetY: number;
        public maxResetY: number;
        public startMessage: string;
        public stopMessage: string;
        public resetMessage: string;

        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in the behavior data");
            }
            this.name = String(json.name);

            if (json.startMessage !== undefined) {
                this.startMessage = String(json.startMessage);
            }

            if (json.stopMessage !== undefined) {
                this.stopMessage = String(json.stopMessage);
            }

            if (json.resetMessage !== undefined) {
                this.resetMessage = String(json.resetMessage);
            }

            if (json.velocity !== undefined) {
                this.velocity.setFromJson(json.velocity);
            }
            else {
                throw new Error("ScrollBehaviorData requires property 'velocity' to be defined");
            }

            if (json.minPosition !== undefined) {
                this.minPosition.setFromJson(json.minPosition);
            }
            else {
                throw new Error("ScrollBehaviorData requires property 'minPosition' to be defined");
            }

            if (json.resetPosition !== undefined) {
                this.resetPosition.setFromJson(json.resetPosition);
            }
            else {
                throw new Error("ScrollBehaviorData requires property 'resetPosition' to be defined");
            }

            if (json.minResetY !== undefined) {
                this.minResetY = Number(json.minResetY);
            }

            if (json.maxResetY !== undefined) {
                this.maxResetY = Number(json.maxResetY);
            }
        }
    }

    export class ScrollBehaviorBuilder implements IBehaviorBuilder {

        public get type(): string {
            return "scroll";
        }

        public buildFromJson(json: any): IBehavior {
            let data = new ScrollBehaviorData();
            data.setFromJson(json);
            return new ScrollBehavior(data);
        }
    }

    export class ScrollBehavior extends BaseBehavior implements IMessageHandler {

        private m_Velocity: Vector2 = Vector2.zero;
        private m_MinPosition: Vector2 = Vector2.zero;
        private m_ResetPosition: Vector2 = Vector2.zero;
        private m_MinResetY: number;
        private m_MaxResetY: number;
        private m_StartMessage: string;
        private m_StopMessage: string;
        private m_ResetMessage: string;
        private m_IsScrolling: boolean = false;
        private m_InitialPosition: Vector2 = Vector2.zero;

        public constructor(data: ScrollBehaviorData) {
            super(data);

            this.m_Velocity.copyFrom(data.velocity);
            this.m_MinPosition.copyFrom(data.minPosition);
            this.m_ResetPosition.copyFrom(data.resetPosition);
            this.m_StartMessage = data.startMessage;
            this.m_StopMessage = data.stopMessage;
            this.m_ResetMessage = data.resetMessage;

            if (data.minResetY !== undefined) {
                this.m_MinResetY = data.minResetY;
            }

            if (data.maxResetY !== undefined) {
                this.m_MaxResetY = data.maxResetY;
            }
        }

        public updateReady(): void {
            super.updateReady();

            if (this.m_StartMessage !== undefined) {
                Message.subscribe(this.m_StartMessage, this);
            }

            if (this.m_StopMessage !== undefined) {
                Message.subscribe(this.m_StopMessage, this);
            }

            if (this.m_ResetMessage !== undefined) {
                Message.subscribe(this.m_ResetMessage, this);
            }

            this.m_InitialPosition.copyFrom(this.m_Owner.transform.position.toVector2());
        }

        public update(time: number): void {
            if (this.m_IsScrolling) {
                this.m_Owner.transform.position.add(this.m_Velocity.clone().scale(time / 1000).toVector3());

                let scrollY = this.m_MinResetY !== undefined && this.m_MaxResetY !== undefined;
                if (this.m_Owner.transform.position.x <= this.m_MinPosition.x &&
                    (scrollY || (!scrollY && this.m_Owner.transform.position.y <= this.m_MinPosition.y))) {

                    this.reset();
                }
            }
        }

        public onMessage(message: Message): void {
            if (message.code === this.m_StartMessage) {
                this.m_IsScrolling = true;
            }
            else if (message.code === this.m_StopMessage) {
                this.m_IsScrolling = false;
            }
            else if (message.code === this.m_ResetMessage) {
                this.initial();
            }
        }

        private reset(): void {
            if (this.m_MinResetY !== undefined && this.m_MaxResetY !== undefined) {
                this.m_Owner.transform.position.set(this.m_ResetPosition.x, this.getRandomY());
            }
            else {
                this.m_Owner.transform.position.copyFrom(this.m_ResetPosition.toVector3());
            }
        }

        private getRandomY(): number {
            return Math.floor(Math.random() * (this.m_MaxResetY - this.m_MinResetY + 1)) + this.m_MinResetY;
        }

        private initial(): void {
            this.m_Owner.transform.position.copyFrom(this.m_InitialPosition.toVector3());
        }
    }

    BehaviorManager.registerBuilder(new ScrollBehaviorBuilder());
}