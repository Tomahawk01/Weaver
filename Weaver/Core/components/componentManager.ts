namespace Weaver {

    export class ComponentManager {

        private static s_RegisteredBuilders: { [type: string]: IComponentBuilder } = {};

        public static registerBuilder(builder: IComponentBuilder): void {
            ComponentManager.s_RegisteredBuilders[builder.type] = builder;
        }

        public static extractComponent(json: any): IComponent {
            if (json.type !== undefined) {
                if (ComponentManager.s_RegisteredBuilders[String(json.type)] !== undefined) {
                    return ComponentManager.s_RegisteredBuilders[String(json.type)].buildFromJson(json);
                }

                throw new Error("Component manager error: type is missing or builder is not registered for this type");
            }
        }
    }
}