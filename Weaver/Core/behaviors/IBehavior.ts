namespace Weaver {

    export interface IBehavior {

        name: string;

        setOwner(owner: Entity): void;

        update(time: number): void;

        apply(userData: any): void;
    }
}