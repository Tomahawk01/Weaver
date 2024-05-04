namespace Weaver {

    /** Main game engine class */
    export class Engine implements IMessageHandler {

        private m_Canvas: HTMLCanvasElement;
        private m_BasicShader: BasicShader;
        private m_Projection: Matrix4x4;
        private m_PreviousTime: number = 0;
        private m_GameWidth: number;
        private m_GameHeight: number;

        /**
         * Creates a new engine
         * @param width Width of the game in pixels
         * @param height Height of the game in pixels
         */
        public constructor(width?: number, height?: number) {
            this.m_GameWidth = width;
            this.m_GameHeight = height;
        }

        /** Starts up this engine */
        public start(): void {
            this.m_Canvas = GLUtilities.initialize();
            if (this.m_GameWidth !== undefined && this.m_GameHeight !== undefined) {
                this.m_Canvas.style.width = this.m_GameWidth + "px";
                this.m_Canvas.style.height = this.m_GameHeight + "px";
                this.m_Canvas.width = this.m_GameWidth;
                this.m_Canvas.height = this.m_GameHeight;
            }

            AssetManager.initialize();
            InputManager.initialize();
            LevelManager.initialize();

            gl.clearColor(0.15, 0.15, 0.15, 1);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this.m_BasicShader = new BasicShader();
            this.m_BasicShader.use();

            // Load fonts
            BitmapFontManager.addFont("default", "assets/fonts/text.txt");
            BitmapFontManager.load();

            // Load materials
            MaterialManager.registerMaterial(new Material("bg", "assets/textures/bg.png", Color.white()));
            MaterialManager.registerMaterial(new Material("end", "assets/textures/end.png", Color.white()));
            MaterialManager.registerMaterial(new Material("middle", "assets/textures/middle.png", Color.white()));
            MaterialManager.registerMaterial(new Material("floor", "assets/textures/floor.png", Color.white()));
            MaterialManager.registerMaterial(new Material("bird", "assets/textures/Bird.png", Color.white()));

            AudioManager.loadSoundFile("flap", "assets/sounds/swing.wav", false);
            AudioManager.loadSoundFile("ting", "assets/sounds/ting.wav", false);
            AudioManager.loadSoundFile("death", "assets/sounds/death.wav", false);

            // Load
            this.m_Projection = Matrix4x4.orthographic(0, this.m_Canvas.width, this.m_Canvas.height, 0, -100.0, 1000.0);

            this.resize();

            // Begin preloading phase, which waits for things to be loaded before start the game
            this.preloading();
        }

        /** Resizes the canvas to fit the window */
        public resize(): void {
            if (this.m_Canvas !== undefined) {
                if (this.m_GameWidth === undefined || this.m_GameHeight === undefined) {
                    this.m_Canvas.width = window.innerWidth;
                    this.m_Canvas.height = window.innerHeight;
                }

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                this.m_Projection = Matrix4x4.orthographic(0, this.m_Canvas.width, this.m_Canvas.height, 0, -100.0, 1000.0);
            }
        }

        public onMessage(message: Message): void {
            if (message.code === "MOUSE_UP") {
                let context = message.context as MouseContext;
                document.title = `Pos: [${context.position.x},${context.position.y}]`;
            }
        }

        private loop(): void {
            this.update();
            this.render();

            requestAnimationFrame(this.loop.bind(this));
        }

        private preloading(): void {
            // Make sure to always update the message bus
            MessageBus.update(0);

            if (!BitmapFontManager.updateReady()) {
                requestAnimationFrame(this.preloading.bind(this));
                return;
            }

            // Load level
            LevelManager.changeLevel(0);

            this.loop();
        }

        private update(): void {
            let delta = performance.now() - this.m_PreviousTime;

            MessageBus.update(delta);
            LevelManager.update(delta);
            CollisionManager.update(delta);

            this.m_PreviousTime = performance.now();
        }

        private render(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            LevelManager.render(this.m_BasicShader);

            // Set uniforms
            let projectionLocation = this.m_BasicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(this.m_Projection.data));
        }
    }
}