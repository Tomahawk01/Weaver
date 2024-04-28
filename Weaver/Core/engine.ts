namespace Weaver {

    /**
    * Main game engine class
    */
    export class Engine {

        private m_Canvas: HTMLCanvasElement;
        private m_Shader: Shader;

        private m_Buffer: GLBuffer;

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

            // Set uniforms
            let colorPosition = this.m_Shader.getUniformLocation("u_color");
            gl.uniform4f(colorPosition, 0.6, 0.2, 1, 1);

            this.m_Buffer.bind();
            this.m_Buffer.draw();

            requestAnimationFrame(this.loop.bind(this));
        }

        private createBuffer(): void {
            this.m_Buffer = new GLBuffer(3);

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = this.m_Shader.getAttributeLocation("a_position");
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this.m_Buffer.addAttributeLocation(positionAttribute);

            let vertices = [
                0, 0, 0,
                0.5, 0, 0,
                0.5, 1, 0
            ];

            this.m_Buffer.pushbackData(vertices);
            this.m_Buffer.upload();
            this.m_Buffer.unbind();
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

            uniform vec4 u_color;

            void main()
            {
                gl_FragColor = u_color;
            }`;

            this.m_Shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
        }
    }
}