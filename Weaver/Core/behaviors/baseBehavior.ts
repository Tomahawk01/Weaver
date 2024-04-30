namespace Weaver {

    export abstract class BaseBehavior implements IBehavior {

        public name: string;

        protected m_Data: IBehaviorData;
        protected m_Owner: Entity;

        public constructor(data: IBehaviorData) {
            this.m_Data = data;
            this.name = this.m_Data.name;
        }

        public setOwner(owner: Entity): void {
            this.m_Owner = owner;
        }

        public update(time: number): void {
        }

        public apply(userData: any): void {
        }
    }
}