namespace Weaver {

    /** Main game engine class */
    export class Engine implements IMessageHandler {

        private m_Canvas: HTMLCanvasElement;
        private m_BasicShader: BasicShader;
        private m_Projection: Matrix4x4;
        private m_PreviousTime: number;

        /** Creates a new engine */
        public constructor() {
        }

        /** Starts up this engine */
        public start(): void {
            this.m_Canvas = GLUtilities.initialize();
            AssetManager.initialize();
            InputManager.initialize();
            LevelManager.initialize();

            Message.subscribe("MOUSE_UP", this);

            gl.clearColor(0.15, 0.15, 0.15, 1);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this.m_BasicShader = new BasicShader();
            this.m_BasicShader.use();

            // Load materials
            MaterialManager.registerMaterial(new Material("checkerboard", "assets/textures/Checkerboard.png", Color.white()));
            MaterialManager.registerMaterial(new Material("bird", "assets/textures/Bird.png", Color.white()));

            // Load
            this.m_Projection = Matrix4x4.orthographic(0, this.m_Canvas.width, this.m_Canvas.height, 0, -100.0, 1000.0);

            LevelManager.changeLevel(0);

            this.resize();
            this.loop();
        }

        /** Resizes the canvas to fit the window */
        public resize(): void {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;

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
        }

        private update(): void {
            let delta = performance.now() - this.m_PreviousTime;
            MessageBus.update(delta);
            LevelManager.update(delta);

            this.m_PreviousTime = performance.now();
        }

        private render(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            LevelManager.render(this.m_BasicShader);

            // Set uniforms
            let projectionLocation = this.m_BasicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(this.m_Projection.data));

            requestAnimationFrame(this.loop.bind(this));
        }
    }
}