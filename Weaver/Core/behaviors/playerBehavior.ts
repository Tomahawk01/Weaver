namespace Weaver {

    export class PlayerBehaviorData implements IBehaviorData {

        public name: string;
        public acceleration: Vector2 = new Vector2(0, 920);
        public playerCollisionComponent: string;
        public groundCollisionComponent: string;
        public animatedSpriteName: string;
        public scoreCollisionComponent: string;

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

            if (json.scoreCollisionComponent === undefined) {
                throw new Error("scoreCollisionComponent must be defined in behavior data");
            }
            else {
                this.scoreCollisionComponent = String(json.scoreCollisionComponent);
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
        private m_ScoreCollisionComponent: string;
        private m_AnimatedSpriteName: string;
        private m_IsPlaying: boolean = false;
        private m_InitialPosition: Vector3 = Vector3.zero;
        private m_Score: number = 0;
        private m_HighScore: number = 0;

        private m_Sprite: AnimatedSpriteComponent;
        private m_PipeNames: string[] = ["pipe1Collision_end", "pipe1Collision_middle_top", "pipe1Collision_endneg", "pipe1Collision_middle_bottom"];

        public constructor(data: PlayerBehaviorData) {
            super(data);

            this.m_Acceleration = data.acceleration;
            this.m_PlayerCollisionComponent = data.playerCollisionComponent;
            this.m_GroundCollisionComponent = data.groundCollisionComponent;
            this.m_ScoreCollisionComponent = data.scoreCollisionComponent;
            this.m_AnimatedSpriteName = data.animatedSpriteName;

            Message.subscribe("MOUSE_DOWN", this);
            Message.subscribe("COLLISION_ENTRY", this);

            Message.subscribe("GAME_READY", this);
            Message.subscribe("GAME_RESET", this);
            Message.subscribe("GAME_START", this);

            Message.subscribe("PLAYER_DIED", this);
        }

        public updateReady(): void {
            super.updateReady();

            // Obtain a reference to the animated sprite
            this.m_Sprite = this.m_Owner.getComponentByName(this.m_AnimatedSpriteName) as AnimatedSpriteComponent;
            if (this.m_Sprite === undefined) {
                throw new Error("AnimatedSpriteComponent named '" + this.m_AnimatedSpriteName + "' is not attached to the owner of this component");
            }

            // Make sure the animation plays from start
            this.m_Sprite.setFrame(0);

            this.m_InitialPosition.copyFrom(this.m_Owner.transform.position);
        }

        public update(time: number): void {
            let seconds: number = time / 1000;

            if (this.m_IsPlaying) {
                this.m_Velocity.add(this.m_Acceleration.clone().scale(seconds));
            }

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
                if (!this.m_Sprite.isPlaying) {
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
                case "COLLISION_ENTRY":
                    let data: CollisionData = message.context as CollisionData;
                    if (data.a.name !== this.m_PlayerCollisionComponent && data.b.name !== this.m_PlayerCollisionComponent) {
                        return;
                    }

                    if (data.a.name === this.m_GroundCollisionComponent || data.b.name === this.m_GroundCollisionComponent) {
                        this.die();
                        this.decelerate();
                    }
                    else if (this.m_PipeNames.indexOf(data.a.name) !== -1 || this.m_PipeNames.indexOf(data.b.name) !== -1) {
                        this.die();
                    }
                    else if (data.a.name === this.m_ScoreCollisionComponent || data.b.name === this.m_ScoreCollisionComponent) {
                        if (this.m_IsAlive && this.m_IsPlaying) {
                            this.setScore(this.m_Score + 1);
                            AudioManager.playSound("ting");
                        }
                    }
                    break;
                // Shows tutorial, click to GAME_START
                case "GAME_RESET":
                    Message.send("GAME_HIDE", this);
                    Message.send("RESET_HIDE", this);
                    Message.send("SPLASH_HIDE", this);
                    Message.send("TUTORIAL_SHOW", this);
                    this.reset();
                    break;
                // Start the game
                case "GAME_START":
                    Message.send("GAME_SHOW", this);
                    Message.send("RESET_HIDE", this);
                    Message.send("SPLASH_HIDE", this);
                    Message.send("TUTORIAL_HIDE", this);
                    this.m_IsPlaying = true;
                    this.m_IsAlive = true;
                    this.start();
                    break;
                // Level is loaded, show play button/splash screen
                case "GAME_READY":
                    Message.send("RESET_HIDE", this);
                    Message.send("TUTORIAL_HIDE", this);
                    Message.send("GAME_HIDE", this);
                    Message.send("SPLASH_SHOW", this);
                    break;
                // Show score and restart button
                case "PLAYER_DIED":
                    Message.send("RESET_SHOW", this);
                    break;
            }
        }

        private isFalling(): boolean {
            return this.m_Velocity.y > 220.0;
        }

        private shouldNotFlap(): boolean {
            return !this.m_IsPlaying || this.m_Velocity.y > 220.0 || !this.m_IsAlive;
        }

        private die(): void {
            if (this.m_IsAlive) {
                this.m_IsAlive = false;
                AudioManager.playSound("death");
                Message.send("PLAYER_DIED", this);
            }
        }

        private reset(): void {
            this.m_IsAlive = true;
            this.m_IsPlaying = false;
            this.m_Sprite.owner.transform.position.copyFrom(this.m_InitialPosition);
            this.m_Sprite.owner.transform.rotation.z = 0;
            this.setScore(0);

            this.m_Velocity.set(0, 0);
            this.m_Acceleration.set(0, 920);
            this.m_Sprite.play();
        }

        private start(): void {
            this.m_IsPlaying = true;
            Message.send("PLAYER_RESET", this);
        }

        private decelerate(): void {
            this.m_Acceleration.y = 0;
            this.m_Velocity.y = 0;
        }

        private onFlap(): void {
            if (this.m_IsAlive && this.m_IsPlaying) {
                this.m_Velocity.y = -280;
                AudioManager.playSound("flap");
            }
        }

        private setScore(score: number): void {
            this.m_Score = score;
            Message.send("counterText:SetText", this, this.m_Score);
            Message.send("scoreText:SetText", this, this.m_Score);

            if (this.m_Score > this.m_HighScore) {
                this.m_HighScore = this.m_Score;
                Message.send("bestText:SetText", this, this.m_HighScore);
            }
        }
    }

    BehaviorManager.registerBuilder(new PlayerBehaviorBuilder());
}