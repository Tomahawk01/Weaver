namespace Weaver {

    /**
    * Main game engine class
    */
    export class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_Shader: Shader;
        private m_Projection: Matrix4x4;

        private m_Sprite: Sprite;

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

            gl.clearColor(0.15, 0.15, 0.15, 1);

            this.loadShaders();
            this.m_Shader.use();

            // Load
            this.m_Projection = Matrix4x4.orthographic(0, this.m_Canvas.width, 0, this.m_Canvas.height, -100.0, 1000.0);

            this.m_Sprite = new Sprite("test");
            this.m_Sprite.load();
            this.m_Sprite.position.x = 200;

            this.resize();
            this.loop();
        }

        /**
         * Resizes the canvas to fit the window
         */
        public resize(): void {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;

                //gl.viewport(-1, 1, -1, 1);
            }
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Set uniforms
            let colorPosition = this.m_Shader.getUniformLocation("u_color");
            gl.uniform4f(colorPosition, 0.6, 0.2, 1, 1);

            let projectionPosition = this.m_Shader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.m_Projection.data));

            let modelPosition = this.m_Shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelPosition, false, new Float32Array(Matrix4x4.translation(this.m_Sprite.position).data));

            this.m_Sprite.draw();

            requestAnimationFrame(this.loop.bind(this));
        }

        private loadShaders(): void {
            let vertexShaderSource = `
            attribute vec3 a_position;

            uniform mat4 u_projection;
            uniform mat4 u_model;

            void main()
            {
                gl_Position = u_projection * u_model * vec4(a_position, 1.0);
            }`;

            let fragmentShaderSource = `
            precision mediump float;

            uniform vec4 u_color;

            void main()
            {
                gl_FragColor = u_color;
            }`;

            this.m_Shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
        }
    }
}