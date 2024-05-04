/// <reference path="componentManager.ts" />
/// <reference path="baseComponent.ts" />
/// <reference path="spriteComponent.ts" />

namespace Weaver {

    export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {

        public frameWidth: number;
        public frameHeight: number;
        public frameCount: number;
        public frameSequence: number[] = [];
        public autoPlay: boolean = true;
        public frameTime: number = 33;

        public setFromJson(json: any): void {
            super.setFromJson(json);

            if (json.autoPlay !== undefined) {
                this.autoPlay = Boolean(json.autoPlay);
            }

            if (json.frameWidth === undefined) {
                throw new Error("AnimatedSpriteComponentData requires 'frameWidth' to be defined");
            }
            else {
                this.frameWidth = Number(json.frameWidth);
            }

            if (json.frameHeight === undefined) {
                throw new Error("AnimatedSpriteComponentData requires 'frameHeight' to be defined");
            }
            else {
                this.frameHeight = Number(json.frameHeight);
            }

            if (json.frameCount === undefined) {
                throw new Error("AnimatedSpriteComponentData requires 'frameCount' to be defined");
            }
            else {
                this.frameCount = Number(json.frameCount);
            }

            if (json.frameSequence === undefined) {
                throw new Error("AnimatedSpriteComponentData requires 'frameSequence' to be defined");
            }
            else {
                this.frameSequence = json.frameSequence;
            }

            if (json.frameTime !== undefined) {
                this.frameTime = Number(json.frameTime);
            }
        }
    }

    export class AnimatedSpriteComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "animatedSprite";
        }

        public buildFromJson(json: any): IComponent {
            let data = new AnimatedSpriteComponentData();
            data.setFromJson(json);
            return new AnimatedSpriteComponent(data);
        }
    }

    export class AnimatedSpriteComponent extends BaseComponent {

        private m_AutoPlay: boolean;
        private m_Sprite: AnimatedSprite;

        public constructor(data: AnimatedSpriteComponentData) {
            super(data);

            this.m_AutoPlay = data.autoPlay;

            let spriteInfo = new AnimatedSpriteInfo();
            spriteInfo.name = this.name;
            spriteInfo.materialName = data.materialName;
            spriteInfo.frameWidth = data.frameWidth;
            spriteInfo.frameHeight = data.frameHeight;
            spriteInfo.width = data.frameWidth;
            spriteInfo.height = data.frameHeight;
            spriteInfo.frameCount = data.frameCount;
            spriteInfo.frameSequence = data.frameSequence;
            spriteInfo.frameTime = data.frameTime;

            this.m_Sprite = new AnimatedSprite(spriteInfo);
            if (!data.origin.equals(Vector3.zero)) {
                this.m_Sprite.origin.copyFrom(data.origin);
            }
        }

        public get isPlaying(): boolean {
            return this.m_Sprite.isPlaying;
        }

        public load(): void {
            this.m_Sprite.load();
        }

        public updateReady(): void {
            if (!this.m_AutoPlay) {
                this.m_Sprite.stop();
            }
        }

        public update(time: number): void {
            this.m_Sprite.update(time);

            super.update(time);
        }

        public render(shader: Shader): void {
            this.m_Sprite.draw(shader, this.owner.worldMatrix);

            super.render(shader);
        }

        public play(): void {
            this.m_Sprite.play();
        }

        public stop(): void {
            this.m_Sprite.stop();
        }

        public setFrame(frameNumber: number): void {
            this.m_Sprite.setFrame(frameNumber);
        }
    }

    ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());
}