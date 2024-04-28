namespace Weaver {

    /** Represents a WebGL shader */
    export class Shader {

        private m_Name: string;
        private m_Program: WebGLProgram;
        private m_Attributes: { [name: string]: number } = {};
        private m_Uniforms: { [name: string]: WebGLUniformLocation } = {};

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

            this.detectAttributes();
            this.detectUniforms();
        }

        /** The name of this shader */
        public get name(): string {
            return this.m_Name;
        }

        /** Use this shader */
        public use(): void {
            gl.useProgram(this.m_Program);
        }

        /**
         * Gets the location of attribute with provided name
         * @param name The name of attribute whose location to retrieve
         */
        public getAttributeLocation(name: string): number {
            if (this.m_Attributes[name] === undefined) {
                throw new Error(`Unable to find attribute named '${name}' in shader named '${this.m_Name}'`);
            }

            return this.m_Attributes[name];
        }

        /**
        * Gets the location of uniform with provided name
        * @param name The name of uniform whose location to retrieve
        */
        public getUniformLocation(name: string): WebGLUniformLocation {
            if (this.m_Uniforms[name] === undefined) {
                throw new Error(`Unable to find uniform named '${name}' in shader named '${this.m_Name}'`);
            }

            return this.m_Uniforms[name];
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

        private detectAttributes(): void {
            let attributeCount = gl.getProgramParameter(this.m_Program, gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < attributeCount; ++i) {
                let info: WebGLActiveInfo = gl.getActiveAttrib(this.m_Program, i);
                if (!info) {
                    break;
                }

                this.m_Attributes[info.name] = gl.getAttribLocation(this.m_Program, info.name);
            }
        }

        private detectUniforms(): void {
            let uniformCount = gl.getProgramParameter(this.m_Program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; ++i) {
                let info: WebGLActiveInfo = gl.getActiveUniform(this.m_Program, i);
                if (!info) {
                    break;
                }

                this.m_Uniforms[info.name] = gl.getUniformLocation(this.m_Program, info.name);
            }
        }
    }
}