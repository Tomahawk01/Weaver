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
            // Load
            this.m_Projection = Weaver.Matrix4x4.orthographic(0, this.m_Canvas.width, 0, this.m_Canvas.height, -100.0, 1000.0);
            this.m_Sprite = new Weaver.Sprite("test");
            this.m_Sprite.load();
            this.m_Sprite.position.x = 200;
            this.resize();
            this.loop();
        };
        /**
         * Resizes the canvas to fit the window
         */
        Engine.prototype.resize = function () {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
                Weaver.gl.viewport(-1, 1, -1, 1);
            }
        };
        Engine.prototype.loop = function () {
            Weaver.gl.clear(Weaver.gl.COLOR_BUFFER_BIT);
            // Set uniforms
            var colorPosition = this.m_Shader.getUniformLocation("u_color");
            Weaver.gl.uniform4f(colorPosition, 0.6, 0.2, 1, 1);
            var projectionPosition = this.m_Shader.getUniformLocation("u_projection");
            Weaver.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.m_Projection.data));
            var modelPosition = this.m_Shader.getUniformLocation("u_model");
            Weaver.gl.uniformMatrix4fv(modelPosition, false, new Float32Array(Weaver.Matrix4x4.translation(this.m_Sprite.position).data));
            this.m_Sprite.draw();
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n            attribute vec3 a_position;\n\n            uniform mat4 u_projection;\n            uniform mat4 u_model;\n\n            void main()\n            {\n                gl_Position = u_projection * u_model * vec4(a_position, 1.0);\n            }";
            var fragmentShaderSource = "\n            precision mediump float;\n\n            uniform vec4 u_color;\n\n            void main()\n            {\n                gl_FragColor = u_color;\n            }";
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
     * Represents the information needed for a GLBuffer attribute
     */
    var AttributeInfo = /** @class */ (function () {
        function AttributeInfo() {
        }
        return AttributeInfo;
    }());
    Weaver.AttributeInfo = AttributeInfo;
    /**
     * Represents a WebGL buffer
     */
    var GLBuffer = /** @class */ (function () {
        /**
         * Creates a new GL buffer
         * @param elementSize Size of each element in this buffer
         * @param dataType Data type of this buffer. Default: gl.FLOAT
         * @param targetBufferType Buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. Default: gl.ARRAY_BUFFER
         * @param mode Drawing mode of this buffer. Can be either gl.TRIANGLES or gl.LINES. Default: gl.TRIANGLES
         */
        function GLBuffer(elementSize, dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = Weaver.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = Weaver.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = Weaver.gl.TRIANGLES; }
            this.m_HasAttributeLocation = false;
            this.m_Data = [];
            this.m_Attributes = [];
            this.m_ElementSize = elementSize;
            this.m_DataType = dataType;
            this.m_TargerBufferType = targetBufferType;
            this.m_Mode = mode;
            // Determine byte size
            switch (this.m_DataType) {
                case Weaver.gl.FLOAT:
                case Weaver.gl.INT:
                case Weaver.gl.UNSIGNED_INT:
                    this.m_TypeSize = 4;
                    break;
                case Weaver.gl.SHORT:
                case Weaver.gl.UNSIGNED_SHORT:
                    this.m_TypeSize = 2;
                    break;
                case Weaver.gl.BYTE:
                case Weaver.gl.UNSIGNED_BYTE:
                    this.m_TypeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            this.m_Stride = this.m_ElementSize * this.m_TypeSize;
            this.m_Buffer = Weaver.gl.createBuffer();
        }
        /**
         * Destroys this buffer
         */
        GLBuffer.prototype.destroy = function () {
            Weaver.gl.deleteBuffer(this.m_Buffer);
        };
        /**
         * Binds this buffer
         * @param normalized Indicates if the data should be normalized. Default: false
         */
        GLBuffer.prototype.bind = function (normalized) {
            if (normalized === void 0) { normalized = false; }
            Weaver.gl.bindBuffer(this.m_TargerBufferType, this.m_Buffer);
            if (this.m_HasAttributeLocation) {
                for (var _i = 0, _a = this.m_Attributes; _i < _a.length; _i++) {
                    var it = _a[_i];
                    Weaver.gl.vertexAttribPointer(it.location, it.size, this.m_DataType, normalized, this.m_Stride, it.offset * this.m_TypeSize);
                    Weaver.gl.enableVertexAttribArray(it.location);
                }
            }
        };
        /**
         * Unbinds this buffer
         */
        GLBuffer.prototype.unbind = function () {
            for (var _i = 0, _a = this.m_Attributes; _i < _a.length; _i++) {
                var it = _a[_i];
                Weaver.gl.disableVertexAttribArray(it.location);
            }
            Weaver.gl.bindBuffer(Weaver.gl.ARRAY_BUFFER, this.m_Buffer);
        };
        /**
         * Adds an attribute with the provided information to this buffer
         * @param info Information to be added
         */
        GLBuffer.prototype.addAttributeLocation = function (info) {
            this.m_HasAttributeLocation = true;
            this.m_Attributes.push(info);
        };
        /**
         * Adds data to this buffer
         * @param data
         */
        GLBuffer.prototype.pushbackData = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                this.m_Data.push(d);
            }
        };
        /**
         * Uploads this buffer's data to the GPU
         */
        GLBuffer.prototype.upload = function () {
            Weaver.gl.bindBuffer(this.m_TargerBufferType, this.m_Buffer);
            var bufferData;
            switch (this.m_DataType) {
                case Weaver.gl.FLOAT:
                    bufferData = new Float32Array(this.m_Data);
                    break;
                case Weaver.gl.INT:
                    bufferData = new Int32Array(this.m_Data);
                    break;
                case Weaver.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this.m_Data);
                    break;
                case Weaver.gl.SHORT:
                    bufferData = new Int16Array(this.m_Data);
                    break;
                case Weaver.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this.m_Data);
                    break;
                case Weaver.gl.BYTE:
                    bufferData = new Int8Array(this.m_Data);
                    break;
                case Weaver.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this.m_Data);
                    break;
            }
            Weaver.gl.bufferData(this.m_TargerBufferType, bufferData, Weaver.gl.STATIC_DRAW);
        };
        /**
         * Draws this buffer
         */
        GLBuffer.prototype.draw = function () {
            if (this.m_TargerBufferType === Weaver.gl.ARRAY_BUFFER) {
                Weaver.gl.drawArrays(this.m_Mode, 0, this.m_Data.length / this.m_ElementSize);
            }
            else if (this.m_TargerBufferType === Weaver.gl.ELEMENT_ARRAY_BUFFER) {
                Weaver.gl.drawElements(this.m_Mode, this.m_Data.length, this.m_DataType, 0);
            }
        };
        return GLBuffer;
    }());
    Weaver.GLBuffer = GLBuffer;
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
            this.m_Attributes = {};
            this.m_Uniforms = {};
            this.m_Name = name;
            var vertexShader = this.loadShader(vertexSrc, Weaver.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSrc, Weaver.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
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
        /**
         * Gets the location of attribute with provided name
         * @param name The name of attribute whose location to retrieve
         */
        Shader.prototype.getAttributeLocation = function (name) {
            if (this.m_Attributes[name] === undefined) {
                throw new Error("Unable to find attribute named '".concat(name, "' in shader named '").concat(this.m_Name, "'"));
            }
            return this.m_Attributes[name];
        };
        /**
        * Gets the location of uniform with provided name
        * @param name The name of uniform whose location to retrieve
        */
        Shader.prototype.getUniformLocation = function (name) {
            if (this.m_Uniforms[name] === undefined) {
                throw new Error("Unable to find uniform named '".concat(name, "' in shader named '").concat(this.m_Name, "'"));
            }
            return this.m_Uniforms[name];
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
        Shader.prototype.detectAttributes = function () {
            var attributeCount = Weaver.gl.getProgramParameter(this.m_Program, Weaver.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; ++i) {
                var info = Weaver.gl.getActiveAttrib(this.m_Program, i);
                if (!info) {
                    break;
                }
                this.m_Attributes[info.name] = Weaver.gl.getAttribLocation(this.m_Program, info.name);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var uniformCount = Weaver.gl.getProgramParameter(this.m_Program, Weaver.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < uniformCount; ++i) {
                var info = Weaver.gl.getActiveUniform(this.m_Program, i);
                if (!info) {
                    break;
                }
                this.m_Uniforms[info.name] = Weaver.gl.getUniformLocation(this.m_Program, info.name);
            }
        };
        return Shader;
    }());
    Weaver.Shader = Shader;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /**
     * Represents a 2D sprite which is drawn on the screen
     */
    var Sprite = /** @class */ (function () {
        /**
         * Creates a new sprite
         * @param name Name of this sprite
         * @param width Width of this sprite
         * @param height Height of this sprite
         */
        function Sprite(name, width, height) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            /**
             * Position of this sprite
             */
            this.position = new Weaver.Vector3();
            this.m_Name = name;
            this.m_Width = width;
            this.m_Height = height;
        }
        /**
         * Performs loading logic on this sprite
         */
        Sprite.prototype.load = function () {
            this.m_Buffer = new Weaver.GLBuffer(3);
            var positionAttribute = new Weaver.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this.m_Buffer.addAttributeLocation(positionAttribute);
            var vertices = [
                // x,y,z
                0, 0, 0,
                0, this.m_Height, 0,
                this.m_Width, this.m_Height, 0,
                this.m_Width, this.m_Height, 0,
                this.m_Width, 0, 0,
                0, 0, 0
            ];
            this.m_Buffer.pushbackData(vertices);
            this.m_Buffer.upload();
            this.m_Buffer.unbind();
        };
        /**
         * Performs update logic on this sprite
         * @param time Delta time in milliseconds since the last update call
         */
        Sprite.prototype.update = function (time) {
        };
        /**
         * Draws this sprite
         */
        Sprite.prototype.draw = function () {
            this.m_Buffer.bind();
            this.m_Buffer.draw();
        };
        return Sprite;
    }());
    Weaver.Sprite = Sprite;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /**
     * Represents 4x4 matrix to be used for transformations
     */
    var Matrix4x4 = /** @class */ (function () {
        /**
         * Creates a new 4x4 matrix
         */
        function Matrix4x4() {
            this.m_Data = [];
            this.m_Data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        Object.defineProperty(Matrix4x4.prototype, "data", {
            /**
             * Returns data contained in this matrix as an array of numbers
             */
            get: function () {
                return this.m_Data;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Creates and returns an identity matrix
         */
        Matrix4x4.identity = function () {
            return new Matrix4x4();
        };
        /**
         * Creates and returns a new orthographic projection matrix
         * @param left Left extents of the viewport
         * @param right Right extents of the viewport
         * @param bottom Bottom extents of the viewport
         * @param top Top extents of the viewport
         * @param nearClip Near clipping plane
         * @param farClip Far clipping plane
         */
        Matrix4x4.orthographic = function (left, right, bottom, top, nearClip, farClip) {
            var m = new Matrix4x4();
            var lr = 1.0 / (left - right);
            var bt = 1.0 / (bottom - top);
            var nf = 1.0 / (nearClip - farClip);
            m.m_Data[0] = -2.0 * lr;
            m.m_Data[5] = -2.0 * bt;
            m.m_Data[10] = 2.0 * nf;
            m.m_Data[12] = (left + right) * lr;
            m.m_Data[13] = (top + bottom) * bt;
            m.m_Data[14] = (farClip + nearClip) * nf;
            return m;
        };
        /**
         * Creates and returns a transformation matrix using provided position
         * @param position Position to be used in transformation
         */
        Matrix4x4.translation = function (position) {
            var m = new Matrix4x4();
            m.m_Data[12] = position.x;
            m.m_Data[13] = position.y;
            m.m_Data[14] = position.z;
            return m;
        };
        /**
         * Returns data of this matrix as a Float32Array
         */
        Matrix4x4.prototype.toFloat32Array = function () {
            return new Float32Array(this.m_Data);
        };
        return Matrix4x4;
    }());
    Weaver.Matrix4x4 = Matrix4x4;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /**
     * Represents 3-component vector
     */
    var Vector3 = /** @class */ (function () {
        /**
         * Creates a new vector3
         * @param x The X component
         * @param y The Y component
         * @param z The Z component
         */
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.m_X = x;
            this.m_Y = y;
            this.m_Z = z;
        }
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this.m_X;
            },
            set: function (value) {
                this.m_X = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this.m_Y;
            },
            set: function (value) {
                this.m_Y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this.m_Z;
            },
            set: function (value) {
                this.m_Z = value;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the data of this vector as a number array
         */
        Vector3.prototype.toArray = function () {
            return [this.m_X, this.m_Y, this.m_Z];
        };
        /**
         * Returns the data of this vector as a Float32Array
         */
        Vector3.prototype.toFLoat32Array = function () {
            return new Float32Array(this.toArray());
        };
        return Vector3;
    }());
    Weaver.Vector3 = Vector3;
})(Weaver || (Weaver = {}));
//# sourceMappingURL=main.js.map