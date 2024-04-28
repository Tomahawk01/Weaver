namespace Weaver {

    /**
    * Main game engine class
    */
    export class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_Shader: Shader;

        private m_Buffer: WebGLBuffer;

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

            this.createBuffer();

            engine.resize();
            this.loop();
        }

        /**
         * Resizes the canvas to fit the window
         */
        public resize(): void {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;

                gl.viewport(0, 0, this.m_Canvas.width, this.m_Canvas.height);
            }
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.m_Buffer);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            requestAnimationFrame(this.loop.bind(this));
        }

        private createBuffer(): void {
            this.m_Buffer = gl.createBuffer();

            let vertices = [
                0, 0, 0,
                0.5, 0, 0,
                0.5, 1, 0
            ];

            gl.bindBuffer(gl.ARRAY_BUFFER, this.m_Buffer);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, undefined);
            gl.disableVertexAttribArray(0);
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