﻿namespace Weaver {

    export interface IComponent {

        name: string;

        readonly owner: Entity;
        setOwner(owner: Entity): void;

        load(): void;

        update(time: number): void;

        render(shader: Shader): void;
    }
}