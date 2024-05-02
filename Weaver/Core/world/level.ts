namespace Weaver {

    export enum LevelState {

        UNINITIALIZED,
        LOADING,
        UPDATING
    }

    export class Level {

        private m_Id: number;
        private m_Name: string;
        private m_Description: string;
        private m_Scene: Scene;
        private m_State: LevelState = LevelState.UNINITIALIZED;
        private m_GlobalId: number = -1;

        public constructor(id: number, name: string, description: string) {
            this.m_Id = id;
            this.m_Name = name;
            this.m_Description = description;
            this.m_Scene = new Scene();
        }

        public get id(): number {
            return this.m_Id;
        }

        public get name(): string {
            return this.m_Name;
        }

        public get description(): string {
            return this.m_Description;
        }

        public get scene(): Scene {
            return this.m_Scene;
        }

        public initialize(levelData: any): void {
            if (levelData.entities === undefined) {
                throw new Error("Level initialization error: entities not present");
            }

            for (let o in levelData.entities) {
                let obj = levelData.entities[o];

                this.loadEntity(obj, this.m_Scene.root);
            }
        }

        public load(): void {
            this.m_State = LevelState.LOADING;

            this.m_Scene.load();
            this.m_Scene.root.updateReady();

            this.m_State = LevelState.UPDATING;
        }

        public unload(): void {
        }

        public update(time: number): void {
            if (this.m_State === LevelState.UPDATING) {
                this.m_Scene.update(time);
            }
        }

        public render(shader: Shader): void {
            if (this.m_State === LevelState.UPDATING) {
                this.m_Scene.render(shader);
            }
        }

        public onActivated(): void {
        }

        public onDeactivated(): void {
        }

        private loadEntity(dataSection: any, parent: Entity): void {
            let name: string;
            if (dataSection.name !== undefined) {
                name = String(dataSection.name);
            }

            this.m_GlobalId++;
            let entity = new Entity(this.m_GlobalId, name, this.m_Scene);

            if (dataSection.transform !== undefined) {
                entity.transform.setFromJson(dataSection.transform);
            }

            if (dataSection.components !== undefined) {
                for (let c in dataSection.components) {
                    let data = dataSection.components[c];
                    let component = ComponentManager.extractComponent(data);
                    entity.addComponent(component);
                }
            }

            if (dataSection.behaviors !== undefined) {
                for (let b in dataSection.behaviors) {
                    let data = dataSection.behaviors[b];
                    let behavior = BehaviorManager.extractBehavior(data);
                    entity.addBehavior(behavior);
                }
            }

            if (dataSection.children !== undefined) {
                for (let o in dataSection.children) {
                    let obj = dataSection.children[o];
                    this.loadEntity(obj, entity);
                }
            }

            if (parent !== undefined) {
                parent.addChild(entity);
            }
        }
    }
}