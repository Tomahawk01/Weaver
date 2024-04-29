namespace Weaver {

    /** Main game engine class */
    export class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_BasicShader: BasicShader;
        private m_Projection: Matrix4x4;

        private m_Sprite: Sprite;

        /** Creates a new engine */
        public constructor() {
        }

        /** Starts up this engine */
        public start(): void {
            this.m_Canvas = GLUtilities.initialize();
            AssetManager.initialize();

            gl.clearColor(0.15, 0.15, 0.15, 1);

            this.m_BasicShader = new BasicShader();
            this.m_BasicShader.use();

            // Load materials
            MaterialManager.registerMaterial(new Material("checkerboard", "assets/textures/Checkerboard.png", Color.white()));

            // Load
            this.m_Projection = Matrix4x4.orthographic(0, this.m_Canvas.width, this.m_Canvas.height, 0, -100.0, 1000.0);

            this.m_Sprite = new Sprite("test", "checkerboard");
            this.m_Sprite.load();
            this.m_Sprite.position.x = 200;
            this.m_Sprite.position.y = 100;

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

        private loop(): void {
            MessageBus.update(0);
            
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Set uniforms
            let projectionLocation = this.m_BasicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(this.m_Projection.data));

            this.m_Sprite.draw(this.m_BasicShader);

            requestAnimationFrame(this.loop.bind(this));
        }
    }
}