namespace Weaver {

    export abstract class BaseComponent implements IComponent {

        protected m_Owner: Entity;
        protected m_Data: IComponentData;

        public name: string;

        public constructor(data: IComponentData) {
            this.m_Data = data;
            this.name = data.name;
        }

        public get owner(): Entity {
            return this.m_Owner;
        }

        public setOwner(owner: Entity): void {
            this.m_Owner = owner;
        }

        public load(): void {
        }

        public updateReady(): void {
        }

        public update(time: number): void {
        }

        public render(shader: Shader): void {
        }
    }
}