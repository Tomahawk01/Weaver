namespace Weaver {

    export class CollisionData {

        public a: CollisionComponent;
        public b: CollisionComponent;
        public time: number;

        public constructor(time: number, a: CollisionComponent, b: CollisionComponent) {
            this.time = time;
            this.a = a;
            this.b = b;
        }
    }

    export class CollisionManager {

        private static s_TotalTime: number = 0;
        private static s_Components: CollisionComponent[] = [];
        private static s_CollisionData: CollisionData[] = [];

        private constructor() {
        }

        public static registerCollisionComponent(component: CollisionComponent): void {
            CollisionManager.s_Components.push(component);
        }

        public static unregisterCollisionComponent(component: CollisionComponent): void {
            let index = CollisionManager.s_Components.indexOf(component);
            if (index !== -1) {
                CollisionManager.s_Components.slice(index, 1);
            }
        }

        public static clear(): void {
            CollisionManager.s_Components.length = 0;
        }

        public static update(time: number): void {
            CollisionManager.s_TotalTime += time;

            for (let c = 0; c < CollisionManager.s_Components.length; ++c) {
                let comp = CollisionManager.s_Components[c];
                for (let o = 0; o < CollisionManager.s_Components.length; ++o) {
                    let other = CollisionManager.s_Components[o];

                    // Do not check against collisions with self
                    if (comp === other) {
                        continue;
                    }

                    if (comp.shape.intersects(other.shape)) {
                        // We have a collision
                        let exists: boolean = false;
                        for (let d = 0; d < CollisionManager.s_CollisionData.length; ++d) {
                            let data = CollisionManager.s_CollisionData[d];

                            if ((data.a === comp && data.b === other) || (data.a === other && data.b === comp)) {
                                // We have existing data. Update it
                                comp.onCollisionUpdate(other);
                                other.onCollisionUpdate(comp);
                                data.time = CollisionManager.s_TotalTime;
                                exists = true;
                                break;
                            }
                        }

                        if (!exists) {
                            // Create a new collision
                            let col = new CollisionData(CollisionManager.s_TotalTime, comp, other);
                            comp.onCollisionEntry(other);
                            other.onCollisionEntry(comp);
                            Message.sendPriority("COLLISION_ENTRY: " + comp.name, this, col);
                            Message.sendPriority("COLLISION_ENTRY: " + other.name, this, col);
                            this.s_CollisionData.push(col);
                        }
                    }
                }
            }

            // Remove stale collision data
            let removeData: CollisionData[] = [];
            for (let d = 0; d < CollisionManager.s_CollisionData.length; ++d) {
                let data = CollisionManager.s_CollisionData[d];
                if (data.time !== CollisionManager.s_TotalTime) {
                    // Old collision data
                    removeData.push(data);
                }
            }

            while (removeData.length !== 0) {
                let data = removeData.shift();
                let index = CollisionManager.s_CollisionData.indexOf(data);
                CollisionManager.s_CollisionData.splice(index, 1);

                data.a.onCollisionExit(data.b);
                data.b.onCollisionExit(data.a);
                Message.sendPriority("COLLISION_EXIT: " + data.a.name, this, data);
                Message.sendPriority("COLLISION_EXIT: " + data.b.name, this, data);
            }
        }
    }
}