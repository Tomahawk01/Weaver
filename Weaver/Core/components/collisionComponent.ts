namespace Weaver {

    export class CollisionComponentData implements IComponentData {

        public name: string;
        public shape: IShape2D;

        public setFromJson(json: any): void {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.shape === undefined) {
                throw new Error("CollisionComponentData requires 'shape' to be present");
            }
            else {
                if (json.shape.type === undefined) {
                    throw new Error("CollisionComponentData requires 'shape.type' to be present");
                }

                let shapeType: string = String(json.shape.type).toLowerCase();
                switch (shapeType) {
                    case "rectangle":
                        this.shape = new Rectangle2D();
                        break;
                    case "circle":
                        this.shape = new Circle2D();
                        break;
                    default:
                        throw new Error("Unsupported shape type: '" + shapeType + "'");
                }

                this.shape.setFromJson(json.shape);
            }
        }
    }

    export class CollisionComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "collision";
        }

        public buildFromJson(json: any): IComponent {
            let data = new CollisionComponentData();
            data.setFromJson(json);
            return new CollisionComponent(data);
        }
    }

    export class CollisionComponent extends BaseComponent {

        private m_Shape: IShape2D;

        public constructor(data: CollisionComponentData) {
            super(data);

            this.m_Shape = data.shape;
        }

        public get shape(): IShape2D {
            return this.m_Shape;
        }

        public load(): void {
            super.load();

            this.m_Shape.position.copyFrom(this.owner.transform.position.toVector2().add(this.m_Shape.offset));

            CollisionManager.registerCollisionComponent(this);
        }

        public update(time: number): void {
            this.m_Shape.position.copyFrom(this.owner.transform.position.toVector2().add(this.m_Shape.offset));

            super.update(time);
        }

        public render(shader: Shader): void {
            super.render(shader);
        }

        public onCollisionEntry(other: CollisionComponent): void {
            console.log("onCollisionEntry: ", this, other);
        }

        public onCollisionUpdate(other: CollisionComponent): void {
            console.log("onCollisionUpdate: ", this, other);
        }

        public onCollisionExit(other: CollisionComponent): void {
            console.log("onCollisionExit: ", this, other);
        }
    }

    ComponentManager.registerBuilder(new CollisionComponentBuilder());
}