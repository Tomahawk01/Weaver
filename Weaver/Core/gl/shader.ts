namespace Weaver {

    /**
     * Represents a WebGL shader
     */
    export class Shader {

        private m_Name: string;
        private m_Program: WebGLProgram;

        /**
         * Creates a new shader
         * @param name Name of the shader
         * @param vertexSrc Source of vertex shader
         * @param fragmentSrc Source of fragment shader
         */
        public constructor(name: string, vertexSrc: string, fragmentSrc: string) {
            this.m_Name = name;
            let vertexShader = this.loadShader(vertexSrc, gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSrc, gl.FRAGMENT_SHADER);

            this.createProgram(vertexShader, fragmentShader);
        }

        /**
         * The name of this shader
         */
        public get name(): string {
            return this.m_Name;
        }

        /**
         * Use this shader
         */
        public use(): void {
            gl.useProgram(this.m_Program);
        }

        private loadShader(source: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let error = gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader '" + this.m_Name + "': " + error);
            }

            return shader;
        }

        private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
            this.m_Program = gl.createProgram();

            gl.attachShader(this.m_Program, vertexShader);
            gl.attachShader(this.m_Program, fragmentShader);

            gl.linkProgram(this.m_Program);

            let error = gl.getProgramInfoLog(this.m_Program);
            if (error !== "") {
                throw new Error("Error linking shader '" + this.m_Name + "': " + error);
            }
        }
    }
}