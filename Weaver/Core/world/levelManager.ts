namespace Weaver {

    export class LevelManager implements IMessageHandler {

        private static s_GlobalLevelId: number = -1;
        //private static s_Levels: { [id: number]: Level } = {};
        private static s_RegisteredLevels: { [id: number]: string } = {};
        private static s_ActiveLevel: Level;
        private static s_Inst: LevelManager;

        private constructor() {
        }

        public static initialize(): void {
            LevelManager.s_Inst = new LevelManager();

            LevelManager.s_RegisteredLevels[0] = "assets/levels/testLevel.json";
        }

        public static changeLevel(id: number): void {
            if (LevelManager.s_ActiveLevel !== undefined) {
                LevelManager.s_ActiveLevel.onDeactivated();
                LevelManager.s_ActiveLevel.unload();
                LevelManager.s_ActiveLevel = undefined;
            }

            if (LevelManager.s_RegisteredLevels[id] !== undefined) {
                if (AssetManager.isAssetLoaded(LevelManager.s_RegisteredLevels[id])) {
                    let asset = AssetManager.getAsset(LevelManager.s_RegisteredLevels[id]);
                    LevelManager.loadLevel(asset);
                }
                else {
                    Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager.s_RegisteredLevels[id], LevelManager.s_Inst);
                    AssetManager.loadAsset(LevelManager.s_RegisteredLevels[id]);
                }
            }
            else {
                throw new Error("Zone id: " + id.toString() + " does not exist");
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

        public onMessage(message: Message): void {
            if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
                console.log("Level loaded:" + message.code);
                let asset = message.context as JsonAsset;
                LevelManager.loadLevel(asset);
            }
        }

        private static loadLevel(asset: JsonAsset): void {
            console.log("Loading level: " + asset.name);
            let levelData = asset.data;
            let levelId: number;

            if (levelData.id === undefined) {
                throw new Error("Level file format exception: Level id is not present");
            }
            else {
                levelId = Number(levelData.id);
            }

            let levelName: string;
            if (levelData.name === undefined) {
                throw new Error("Level file format exception: Level name is not present");
            }
            else {
                levelName = String(levelData.name);
            }

            let levelDescription: string;
            if (levelData.description !== undefined) {
                levelDescription = String(levelData.description);
            }

            LevelManager.s_ActiveLevel = new Level(levelId, levelName, levelDescription);
            LevelManager.s_ActiveLevel.initialize(levelData);
            LevelManager.s_ActiveLevel.onActivated();
            LevelManager.s_ActiveLevel.load();

            // Change state to splash screen
            Message.send("GAME_READY", this);
        }
    }
}