namespace Weaver {

    export class LevelManager {

        private static s_GlobalLevelId: number = -1;
        private static s_Levels: { [id: number]: Level } = {};
        private static s_ActiveLevel: Level;

        private constructor() {
        }

        public static createLevel(name: string, description: string): number {
            LevelManager.s_GlobalLevelId++;
            let level = new Level(LevelManager.s_GlobalLevelId, name, description);
            LevelManager.s_Levels[LevelManager.s_GlobalLevelId] = level;

            return LevelManager.s_GlobalLevelId;
        }

        // TODO: This is temporary
        public static createTestLevel(): number {
            LevelManager.s_GlobalLevelId++;
            let level = new TestLevel(LevelManager.s_GlobalLevelId, "test", "Simple test level");
            LevelManager.s_Levels[LevelManager.s_GlobalLevelId] = level;

            return LevelManager.s_GlobalLevelId;
        }

        public static changeLevel(id: number): void {
            if (LevelManager.s_ActiveLevel !== undefined) {
                LevelManager.s_ActiveLevel.onDeactivated();
                LevelManager.s_ActiveLevel.unload();
            }

            if (LevelManager.s_Levels[id] !== undefined) {
                LevelManager.s_ActiveLevel = LevelManager.s_Levels[id];
                LevelManager.s_ActiveLevel.onActivated();
                LevelManager.s_ActiveLevel.load();
            }
        }

        public static update(time: number): void {
            if (LevelManager.s_ActiveLevel !== undefined) {
                LevelManager.s_ActiveLevel.update(time);
            }
        }

        public static render(shader: Shader): void {
            if (LevelManager.s_ActiveLevel !== undefined) {
                LevelManager.s_ActiveLevel.render(shader);
            }
        }
    }
}