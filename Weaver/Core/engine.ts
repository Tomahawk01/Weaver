namespace Weaver {

    /** Main game engine class */
    export class Engine implements IMessageHandler {

        private m_Canvas: HTMLCanvasElement;
        private m_BasicShader: BasicShader;
        private m_Projection: Matrix4x4;
        private m_PreviousTime: number = 0;
        private m_GameWidth: number;
        private m_GameHeight: number;

        private m_IsFirstUpdate: boolean = true;
        private m_Aspect: number;

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
        public start(elementName?: string): void {
            this.m_Canvas = GLUtilities.initialize(elementName);
            if (this.m_GameWidth !== undefined && this.m_GameHeight !== undefined) {
                this.m_Aspect = this.m_GameWidth / this.m_GameHeight;
            }

            AssetManager.initialize();
            InputManager.initialize(this.m_Canvas);
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

            MaterialManager.registerMaterial(new Material("playbtn", "assets/textures/playBtn.png", Color.white()));
            MaterialManager.registerMaterial(new Material("restartbtn", "assets/textures/restartBtn.png", Color.white()));
            MaterialManager.registerMaterial(new Material("score", "assets/textures/score.png", Color.white()));
            MaterialManager.registerMaterial(new Material("title", "assets/textures/title.png", Color.white()));
            MaterialManager.registerMaterial(new Material("tutorial", "assets/textures/tutorial.png", Color.white()));

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
                    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
                    this.m_Projection = Matrix4x4.orthographic(0, window.innerWidth, window.innerHeight, 0, -100.0, 1000.0);
                }
                else {
                    let newWidth = window.innerWidth;
                    let newHeight = window.innerHeight;
                    let newWidthToHeight = newWidth / newHeight;
                    let gameArea = document.getElementById("gameArea");

                    if (newWidthToHeight > this.m_Aspect) {
                        newWidth = newHeight * this.m_Aspect;
                        gameArea.style.width = newWidth + 'px';
                        gameArea.style.height = newHeight + 'px';
                    }
                    else {
                        newHeight = newWidth / this.m_Aspect;
                        gameArea.style.width = newWidth + 'px';
                        gameArea.style.height = newHeight + 'px';
                    }

                    gameArea.style.marginTop = (-newHeight / 2) + 'px';
                    gameArea.style.marginLeft = (-newWidth / 2) + 'px';

                    this.m_Canvas.width = newWidth;
                    this.m_Canvas.height = newHeight;

                    gl.viewport(0, 0, newWidth, newHeight);
                    this.m_Projection = Matrix4x4.orthographic(0, this.m_GameWidth, this.m_GameHeight, 0, -100.0, 1000.0);

                    let resolutionScale = new Vector2(newWidth / this.m_GameWidth, newHeight / this.m_GameHeight);
                    InputManager.setResolutionScale(resolutionScale);
                }
            }
        }

        public onMessage(message: Message): void {
            if (message.code === "MOUSE_UP") {
                let context = message.context as MouseContext;
                document.title = `Pos: [${context.position.x},${context.position.y}]`;
            }
        }

        private loop(): void {
            if (this.m_IsFirstUpdate) {

            }

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