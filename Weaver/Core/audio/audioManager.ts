namespace Weaver {

    export class SoundEffect {

        private m_Player: HTMLAudioElement;

        public assetPath: string;

        public constructor(assetPath: string, loop: boolean) {
            this.m_Player = new Audio(assetPath);
            this.m_Player.loop = loop;
        }

        public get loop(): boolean {
            return this.m_Player.loop;
        }

        public set loop(value: boolean) {
            this.m_Player.loop = value;
        }

        public destroy(): void {
            this.m_Player = undefined;
        }

        public play(): void {
            if (!this.m_Player.paused) {
                this.stop();
            }
            this.m_Player.play();
        }

        public pause(): void {
            this.m_Player.pause();
        }

        public stop(): void {
            this.m_Player.pause();
            this.m_Player.currentTime = 0;
        }
    }

    export class AudioManager {

        private static s_SoundEffects: { [name: string]: SoundEffect } = {};

        public static loadSoundFile(name: string, assetPath: string, loop: boolean): void {
            AudioManager.s_SoundEffects[name] = new SoundEffect(assetPath, loop);
        }

        public static playSound(name: string): void {
            if (AudioManager.s_SoundEffects[name] !== undefined) {
                AudioManager.s_SoundEffects[name].play();
            }
        }

        public static pauseSound(name: string): void {
            if (AudioManager.s_SoundEffects[name] !== undefined) {
                AudioManager.s_SoundEffects[name].pause();
            }
        }

        public static pauseAll(): void {
            for (let sfx in AudioManager.s_SoundEffects) {
                AudioManager.s_SoundEffects[sfx].pause();
            }
        }

        public static stopSound(name: string): void {
            if (AudioManager.s_SoundEffects[name] !== undefined) {
                AudioManager.s_SoundEffects[name].stop();
            }
        }

        public static stopAll(): void {
            for (let sfx in AudioManager.s_SoundEffects) {
                AudioManager.s_SoundEffects[sfx].stop();
            }
        }
    }
}