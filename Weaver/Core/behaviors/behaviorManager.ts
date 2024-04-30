namespace Weaver {

    export class BehaviorManager {

        private static s_RegisteredBuilders: { [type: string]: IBehaviorBuilder } = {};

        public static registerBuilder(builder: IBehaviorBuilder): void {
            BehaviorManager.s_RegisteredBuilders[builder.type] = builder;
        }

        public static extractBehavior(json: any): IBehavior {
            if (json.type !== undefined) {
                if (BehaviorManager.s_RegisteredBuilders[String(json.type)] !== undefined) {
                    return BehaviorManager.s_RegisteredBuilders[String(json.type)].buildFromJson(json);
                }

                throw new Error("Behavior manager error: type is missing or builder is not registered for this type");
            }
        }
    }
}