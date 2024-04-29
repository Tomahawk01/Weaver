namespace Weaver {

    export abstract class BaseComponent {

        protected m_Owner: Entity;

        public name: string;

        public constructor(name: string) {
        }

        public get owner(): Entity {
            return this.m_Owner;
        }

        public setOwner(owner: Entity): void {
            this.m_Owner = owner;
        }

        public load(): void {
        }

        public update(time: number): void {
        }

        public render(shader: Shader): void {
        }
    }
}