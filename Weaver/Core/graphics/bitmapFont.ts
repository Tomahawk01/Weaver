namespace Weaver {

    class FontUtilities {

        public static extractFieldValue(field: string): string {
            return field.split("=")[1];
        }
    }

    export class FontGlyph {

        public id: number;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public xOffset: number;
        public yOffset: number;
        public xAdvance: number;
        public page: number;
        public channel: number;

        public static fromFields(fields: string[]): FontGlyph {
            let glyph: FontGlyph = new FontGlyph();

            glyph.id = Number(FontUtilities.extractFieldValue(fields[1]));
            glyph.x = Number(FontUtilities.extractFieldValue(fields[2]));
            glyph.y = Number(FontUtilities.extractFieldValue(fields[3]));
            glyph.width = Number(FontUtilities.extractFieldValue(fields[4]));
            glyph.height = Number(FontUtilities.extractFieldValue(fields[5]));
            glyph.xOffset = Number(FontUtilities.extractFieldValue(fields[6]));
            glyph.yOffset = Number(FontUtilities.extractFieldValue(fields[7]));
            glyph.xAdvance = Number(FontUtilities.extractFieldValue(fields[8]));
            glyph.page = Number(FontUtilities.extractFieldValue(fields[9]));
            glyph.channel = Number(FontUtilities.extractFieldValue(fields[10]));

            return glyph;
        }
    }

    export class BitmapFont implements IMessageHandler {

        private m_Name: string;
        private m_FontFileName: string;
        private m_AssetLoaded: boolean = false;
        private m_ImageFile: string;
        private m_Glyphs: { [id: number]: FontGlyph } = {};
        private m_Size: number;
        private m_ImageWidth: number;
        private m_ImageHeight: number;

        public constructor(name: string, fontFile: string) {
            this.m_Name = name;
            this.m_FontFileName = fontFile;
        }

        public get name(): string {
            return this.m_Name;
        }

        public get size(): number {
            return this.m_Size;
        }

        public get imageWidth(): number {
            return this.m_ImageWidth;
        }

        public get imageHeight(): number {
            return this.m_ImageHeight;
        }

        public get textureName(): string {
            return this.m_ImageFile;
        }

        public get isLoaded(): boolean {
            return this.m_AssetLoaded;
        }

        public load(): void {
            let asset = AssetManager.getAsset(this.m_FontFileName);
            if (asset !== undefined) {
                this.processFontFile(asset.data);
            }
            else {
                Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_FontFileName, this);
            }
        }

        public onMessage(message: Message): void {
            if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_FontFileName) {
                this.processFontFile((message.context as TextAsset).data);
            }
        }

        public getGlyph(char: string): FontGlyph {
            // Replace unrecognized characters with '?'
            let code = char.charCodeAt(0);
            code = (this.m_Glyphs[code] === undefined) ? 63 : code;
            return this.m_Glyphs[code];
        }

        public measureText(text: string): Vector2 {
            let size: Vector2 = Vector2.zero;

            let maxX = 0;
            let x = 0;
            let y = 0;

            for (let c of text) {
                switch (c) {
                    case "\n":
                        if (x > maxX) {
                            maxX = x;
                        }
                        x = 0;
                        y += this.m_Size;
                        break;
                    default:
                        x += this.getGlyph(c).xAdvance;
                        break;
                }
            }

            size.set(maxX, y);
            return size;
        }

        private processFontFile(content: string): void {
            let charCount: number = 0;
            let lines: string[] = content.split("\n");

            for (let line of lines) {
                // Sanitize the line
                let data = line.replace(/\s\s+/g, ' ');
                let fields = data.split(" ");

                // Look at the type of line
                switch (fields[0]) {
                    case "info":
                        this.m_Size = Number(FontUtilities.extractFieldValue(fields[2]));
                        break;
                    case "common":
                        this.m_ImageWidth = Number(FontUtilities.extractFieldValue(fields[3]));
                        this.m_ImageHeight = Number(FontUtilities.extractFieldValue(fields[4]));
                        break;
                    case "page":
                        {
                            let id: number = Number(FontUtilities.extractFieldValue(fields[1]));

                            this.m_ImageFile = FontUtilities.extractFieldValue(fields[2]);
                            // Strip quotes
                            this.m_ImageFile = this.m_ImageFile.replace(/"/g, "");

                            // Append the path to image name
                            this.m_ImageFile = ("assets/fonts/" + this.m_ImageFile).trim();
                        }
                        break;
                    case "chars":
                        charCount = Number(FontUtilities.extractFieldValue(fields[1]));

                        // Increment the expected count (the file's count is off by one)
                        charCount++;
                        break;
                    case "char":
                        {
                            let glyph = FontGlyph.fromFields(fields);
                            this.m_Glyphs[glyph.id] = glyph;
                        }
                        break;
                }
            }

            // Verify the loaded glyphs
            let actualGlyphCount = 0;

            // Only count properties
            let keys = Object.keys(this.m_Glyphs);
            for (let key of keys) {
                if (this.m_Glyphs.hasOwnProperty(key)) {
                    actualGlyphCount++;
                }
            }

            if (actualGlyphCount !== charCount) {
                throw new Error(`Font file reported existance of ${charCount} glyphs, but only ${actualGlyphCount} were found`);
            }

            this.m_AssetLoaded = true;
        }
    }
}