namespace Weaver {

    export class Scene {

        private m_Root: Entity;

        public constructor() {
            this.m_Root = new Entity(0, "__ROOT__", this);
        }

        public get root(): Entity {
            return this.m_Root;
        }

        public get isLoaded(): boolean {
            return this.m_Root.isLoaded;
        }

        public addEntity(entity: Entity): void {
            this.m_Root.addChild(entity);
        }

        public getEntityByName(name: string): Entity {
            return this.m_Root.getEntityByName(name);
        }

        public load(): void {
            this.m_Root.load();
        }

        public update(time: number): void {
            this.m_Root.update(time);
        }

        public render(shader: Shader): void {
            this.m_Root.render(shader);
        }
    }
}