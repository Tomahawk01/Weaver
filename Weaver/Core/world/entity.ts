namespace Weaver {

    export class Entity {

        private m_Id: number;
        private m_Children: Entity[] = [];
        private m_Parent: Entity;
        private m_IsLoaded: boolean = false;
        private m_Scene: Scene;
        private m_Components: IComponent[] = [];
        private m_Behaviors: IBehavior[] = [];

        private m_LocalMatrix: Matrix4x4 = Matrix4x4.identity();
        private m_WorldMatrix: Matrix4x4 = Matrix4x4.identity();

        public name: string;
        public transform: Transform = new Transform();

        public constructor(id: number, name: string, scene?: Scene) {
            this.m_Id = id;
            this.name = name;
            this.m_Scene = scene;
        }

        public get id(): number {
            return this.m_Id;
        }

        public get parent(): Entity {
            return this.m_Parent;
        }

        public get worldMatrix(): Matrix4x4 {
            return this.m_WorldMatrix;
        }

        public get isLoaded(): boolean {
            return this.m_IsLoaded;
        }

        public addChild(child: Entity): void {
            child.m_Parent = this;
            this.m_Children.push(child);
            child.onAdded(this.m_Scene);
        }

        public removeChild(child: Entity): void {
            let index = this.m_Children.indexOf(child);
            if (index !== -1) {
                child.m_Parent = undefined;
                this.m_Children.splice(index, 1);
            }
        }

        public getComponentByName(name: string): IComponent {
            for (let component of this.m_Components) {
                if (component.name === name) {
                    return component;
                }
            }

            for (let child of this.m_Children) {
                let component = child.getComponentByName(name);
                if (component !== undefined) {
                    return component;
                }
            }

            return undefined;
        }

        public getBehaviorByName(name: string): IBehavior {
            for (let behavior of this.m_Behaviors) {
                if (behavior.name === name) {
                    return behavior;
                }
            }

            for (let child of this.m_Children) {
                let behavior = child.getBehaviorByName(name);
                if (behavior !== undefined) {
                    return behavior;
                }
            }

            return undefined;
        }

        public getEntityByName(name: string): Entity {
            if (this.name === name) {
                return this;
            }

            for (let child of this.m_Children) {
                let result = child.getEntityByName(name);
                if (result !== undefined) {
                    return result;
                }
            }

            return undefined;
        }

        public addComponent(component: IComponent): void {
            this.m_Components.push(component);
            component.setOwner(this);
        }

        public addBehavior(behavior: IBehavior): void {
            this.m_Behaviors.push(behavior);
            behavior.setOwner(this);
        }

        public load(): void {
            this.m_IsLoaded = true;

            for (let c of this.m_Components) {
                c.load();
            }

            for (let c of this.m_Children) {
                c.load();
            }
        }

        public updateReady(): void {
            for (let c of this.m_Components) {
                c.updateReady();
            }

            for (let b of this.m_Behaviors) {
                b.updateReady();
            }

            for (let c of this.m_Children) {
                c.updateReady();
            }
        }

        public update(time: number): void {
            this.m_LocalMatrix = this.transform.getTransformationMatrix();
            this.updateWorldMatrix((this.m_Parent !== undefined) ? this.m_Parent.worldMatrix : undefined);

            for (let c of this.m_Components) {
                c.update(time);
            }

            for (let b of this.m_Behaviors) {
                b.update(time);
            }

            for (let c of this.m_Children) {
                c.update(time);
            }
        }

        public render(shader: Shader): void {
            for (let c of this.m_Components) {
                c.render(shader);
            }

            for (let c of this.m_Children) {
                c.render(shader);
            }
        }

        public getWorldPosition(): Vector3 {
            return new Vector3(this.m_WorldMatrix.data[12], this.m_WorldMatrix.data[13], this.m_WorldMatrix.data[14]);
        }

        protected onAdded(scene: Scene): void {
            this.m_Scene = scene;
        }

        private updateWorldMatrix(parentWorldMatrix: Matrix4x4): void {
            if (parentWorldMatrix !== undefined) {
                this.m_WorldMatrix = Matrix4x4.multiply(parentWorldMatrix, this.m_LocalMatrix);
            }
            else {
                this.m_WorldMatrix.copyFrom(this.m_LocalMatrix);
            }
        }
    }
}