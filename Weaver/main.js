var engine;
// Main entry point to the application
window.onload = function () {
    engine = new Weaver.Engine;
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
var Weaver;
(function (Weaver) {
    /**
    * Main game engine class
    */
    var Engine = /** @class */ (function () {
        /**
         * Creates a new engine
         */
        function Engine() {
        }
        /**
         * Starts up this engine
         */
        Engine.prototype.start = function () {
            this.m_Canvas = Weaver.GLUtilities.initialize();
            Weaver.gl.clearColor(0.15, 0.15, 0.15, 1);
            this.loadShaders();
            this.m_Shader.use();
            this.createBuffer();
            engine.resize();
            this.loop();
        };
        /**
         * Resizes the canvas to fit the window
         */
        Engine.prototype.resize = function () {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
                Weaver.gl.viewport(0, 0, this.m_Canvas.width, this.m_Canvas.height);
            }
        };
        Engine.prototype.loop = function () {
            Weaver.gl.clear(Weaver.gl.COLOR_BUFFER_BIT);
            Weaver.gl.bindBuffer(Weaver.gl.ARRAY_BUFFER, this.m_Buffer);
            Weaver.gl.vertexAttribPointer(0, 3, Weaver.gl.FLOAT, false, 0, 0);
            Weaver.gl.enableVertexAttribArray(0);
            Weaver.gl.drawArrays(Weaver.gl.TRIANGLES, 0, 3);
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.createBuffer = function () {
            this.m_Buffer = Weaver.gl.createBuffer();
            var vertices = [
                0, 0, 0,
                0.5, 0, 0,
                0.5, 1, 0
            ];
            Weaver.gl.bindBuffer(Weaver.gl.ARRAY_BUFFER, this.m_Buffer);
            Weaver.gl.vertexAttribPointer(0, 3, Weaver.gl.FLOAT, false, 0, 0);
            Weaver.gl.enableVertexAttribArray(0);
            Weaver.gl.bufferData(Weaver.gl.ARRAY_BUFFER, new Float32Array(vertices), Weaver.gl.STATIC_DRAW);
            Weaver.gl.bindBuffer(Weaver.gl.ARRAY_BUFFER, undefined);
            Weaver.gl.disableVertexAttribArray(0);
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n            attribute vec3 a_position;\n\n            void main()\n            {\n                gl_Position = vec4(a_position, 1.0);\n            }";
            var fragmentShaderSource = "\n            precision mediump float;\n\n            void main()\n            {\n                gl_FragColor = vec4(1.0);\n            }";
            this.m_Shader = new Weaver.Shader("basic", vertexShaderSource, fragmentShaderSource);
        };
        return Engine;
    }());
    Weaver.Engine = Engine;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /**
     * Responsible for setting up a WebGL rendering context
     */
    var GLUtilities = /** @class */ (function () {
        function GLUtilities() {
        }
        /**
         * Initializes WebGL, optionally using canvas with assigned ID if it's defined
         * @param elementId The ID of the element to search for
         * @returns
         */
        GLUtilities.initialize = function (elementId) {
            var canvas;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Can not find canvas element named: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            Weaver.gl = canvas.getContext("webgl2");
            if (Weaver.gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }
            return canvas;
        };
        return GLUtilities;
    }());
    Weaver.GLUtilities = GLUtilities;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /**
     * Represents a WebGL shader
     */
    var Shader = /** @class */ (function () {
        /**
         * Creates a new shader
         * @param name Name of the shader
         * @param vertexSrc Source of vertex shader
         * @param fragmentSrc Source of fragment shader
         */
        function Shader(name, vertexSrc, fragmentSrc) {
            this.m_Name = name;
            var vertexShader = this.loadShader(vertexSrc, Weaver.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSrc, Weaver.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
        }
        Object.defineProperty(Shader.prototype, "name", {
            /**
             * The name of this shader
             */
            get: function () {
                return this.m_Name;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Use this shader
         */
        Shader.prototype.use = function () {
            Weaver.gl.useProgram(this.m_Program);
        };
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = Weaver.gl.createShader(shaderType);
            Weaver.gl.shaderSource(shader, source);
            Weaver.gl.compileShader(shader);
            var error = Weaver.gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader '" + this.m_Name + "': " + error);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this.m_Program = Weaver.gl.createProgram();
            Weaver.gl.attachShader(this.m_Program, vertexShader);
            Weaver.gl.attachShader(this.m_Program, fragmentShader);
            Weaver.gl.linkProgram(this.m_Program);
            var error = Weaver.gl.getProgramInfoLog(this.m_Program);
            if (error !== "") {
                throw new Error("Error linking shader '" + this.m_Name + "': " + error);
            }
        };
        return Shader;
    }());
    Weaver.Shader = Shader;
})(Weaver || (Weaver = {}));
//# sourceMappingURL=main.js.map