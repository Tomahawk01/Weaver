namespace Weaver {

    export class BitmapFontManager {

        private static s_Fonts: { [name: string]: BitmapFont } = {};

        public static addFont(name: string, fontFileName: string): void {
            BitmapFontManager.s_Fonts[name] = new BitmapFont(name, fontFileName);
        }

        public static getFont(name: string): BitmapFont {
            if (BitmapFontManager.s_Fonts[name] === undefined) {
                throw new Error("Font named " + name + " does not exist");
            }

            return BitmapFontManager.s_Fonts[name];
        }

        public static load(): void {
            let keys = Object.keys(BitmapFontManager.s_Fonts);
            for (let key of keys) {
                BitmapFontManager.s_Fonts[key].load();
            }
        }

        public static updateReady(): boolean {
            let keys = Object.keys(BitmapFontManager.s_Fonts);
            for (let key of keys) {
                if (!BitmapFontManager.s_Fonts[key].isLoaded) {
                    console.debug("Font " + key + " is still loading...");
                    return false;
                }
            }

            console.debug("All fonts are loaded successfully");
            return true;
        }
    }
}