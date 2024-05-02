namespace Weaver {

    export class PlayerBehaviorData implements IBehaviorData {

        public name: string;
        public acceleration: Vector2 = new Vector2(0, 920);
        public playerCollisionComponent: string;
        public groundCollisionComponent: string;
        public animatedSpriteName: string;

        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in behavior data");
            }

            this.name = String(json.name);

            if (json.acceleration !== undefined) {
                this.acceleration.setFromJson(json.acceleration);
            }

            if (json.animatedSpriteName === undefined) {
                throw new Error("animatedSpriteName must be defined in behavior data");
            }
            else {
                this.animatedSpriteName = String(json.animatedSpriteName);
            }

            if (json.playerCollisionComponent === undefined) {
                throw new Error("playerCollisionComponent must be defined in behavior data");
            }
            else {
                this.playerCollisionComponent = String(json.playerCollisionComponent);
            }

            if (json.groundCollisionComponent === undefined) {
                throw new Error("groundCollisionComponent must be defined in behavior data");
            }
            else {
                this.groundCollisionComponent = String(json.groundCollisionComponent);
            }
        }
    }

    export class PlayerBehaviorBuilder implements IBehaviorBuilder {

        public get type(): string {
            return "player";
        }

        public buildFromJson(json: any): IBehavior {
            let data = new PlayerBehaviorData();
            data.setFromJson(json);
            return new PlayerBehavior(data);
        }
    }

    export class PlayerBehavior extends BaseBehavior implements IMessageHandler {

        private m_Acceleration: Vector2;
        private m_Velocity: Vector2 = Vector2.zero;
        private m_IsAlive: boolean = true;
        private m_PlayerCollisionComponent: string;
        private m_GroundCollisionComponent: string;
        private m_AnimatedSpriteName: string;

        private m_Sprite: AnimatedSpriteComponent;

        public constructor(data: PlayerBehaviorData) {
            super(data);

            this.m_Acceleration = data.acceleration;
            this.m_PlayerCollisionComponent = data.playerCollisionComponent;
            this.m_GroundCollisionComponent = data.groundCollisionComponent;
            this.m_AnimatedSpriteName = data.animatedSpriteName;

            Message.subscribe("MOUSE_DOWN", this);
            Message.subscribe("COLLISION_ENTRY:" + this.m_PlayerCollisionComponent, this);
        }

        public updateReady(): void {
            super.updateReady();

            // Obtain a reference to the animated sprite
            this.m_Sprite = this.m_Owner.getComponentByName(this.m_AnimatedSpriteName) as AnimatedSpriteComponent;
            if (this.m_Sprite === undefined) {
                throw new Error("AnimatedSpriteComponent named '" + this.m_AnimatedSpriteName + "' is not attached to the owner of this component");
            }
        }

        public update(time: number): void {
            if (!this.m_IsAlive) {
                return;
            }

            let seconds: number = time / 1000;
            this.m_Velocity.add(this.m_Acceleration.clone().scale(seconds));

            // Limit max speed
            if (this.m_Velocity.y > 400) {
                this.m_Velocity.y = 400;
            }

            // Prevent flying too high
            if (this.m_Owner.transform.position.y < -13) {
                this.m_Owner.transform.position.y = -13;
                this.m_Velocity.y = 0;
            }

            this.m_Owner.transform.position.add(this.m_Velocity.clone().scale(seconds).toVector3());

            if (this.m_Velocity.y < 0) {
                this.m_Owner.transform.rotation.z -= Math.degToRad(600.0) * seconds;
                if (this.m_Owner.transform.rotation.z < Math.degToRad(-20)) {
                    this.m_Owner.transform.rotation.z = Math.degToRad(-20);
                }
            }

            if (this.isFalling() || !this.m_IsAlive) {
                this.m_Owner.transform.rotation.z += Math.degToRad(480.0) * seconds;
                if (this.m_Owner.transform.rotation.z > Math.degToRad(90)) {
                    this.m_Owner.transform.rotation.z = Math.degToRad(90);
                }
            }

            if (this.shouldNotFlap()) {
                this.m_Sprite.stop();
            }
            else {
                if (!this.m_Sprite.isPlaying()) {
                    this.m_Sprite.play();
                }
            }

            super.update(time);
        }

        public onMessage(message: Message): void {
            switch (message.code) {
                case "MOUSE_DOWN":
                    this.onFlap();
                    break;
                case "COLLISION_ENTRY:" + this.m_PlayerCollisionComponent:
                    let data: CollisionData = message.context as CollisionData;
                    if (data.a.name === this.m_GroundCollisionComponent || data.b.name === this.m_GroundCollisionComponent) {
                        this.die();
                        this.decelerate();
                        Message.send("PLAYER_DIED", this);
                    }
                    break;
            }
        }

        private isFalling(): boolean {
            return this.m_Velocity.y > 220.0;
        }

        private shouldNotFlap(): boolean {
            return this.m_Velocity.y > 220.0 || !this.m_IsAlive;
        }

        private die(): void {
            this.m_IsAlive = false;
            AudioManager.playSound("death");
        }

        private decelerate(): void {
            this.m_Acceleration.y = 0;
            this.m_Velocity.y = 0;
        }

        private onFlap(): void {
            if (this.m_IsAlive) {
                this.m_Velocity.y = -280;
                AudioManager.playSound("flap");
            }
        }

        private onRestart(y: number): void {
            this.m_Owner.transform.rotation.z = 0;
            this.m_Owner.transform.position.set(30, y);
            this.m_Velocity.set(0, 0);
            this.m_Acceleration.set(0, 920);
            this.m_IsAlive = true;
            this.m_Sprite.play();
        }
    }

    BehaviorManager.registerBuilder(new PlayerBehaviorBuilder());
}