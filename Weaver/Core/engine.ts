namespace Weaver {

    /**
    * Main game engine class
    */
    export class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_Shader: Shader;

        /**
         * Creates a new engine
         */
        public constructor() {
        }

        /**
         * Starts up this engine
         */
        public start(): void {
            this.m_Canvas = GLUtilities.initialize();
            engine.resize();

            gl.clearColor(0.15, 0.15, 0.15, 1);

            this.loadShaders();
            this.m_Shader.use();

            this.loop();
        }

        /**
         * Resizes the canvas to fit the window
         */
        public resize(): void {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
            }
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            requestAnimationFrame(this.loop.bind(this));
        }

        private loadShaders(): void {
            let vertexShaderSource = `
            attribute vec3 a_position;

            void main()
            {
                gl_Position = vec4(a_position, 1.0);
            }`;

            let fragmentShaderSource = `
            precision mediump float;

            void main()
            {
                gl_FragColor = vec4(1.0);
            }`;

            this.m_Shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
        }
    }
}