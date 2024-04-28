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
    Weaver.MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED::";
    /** Manages all assets in the engine */
    var AssetManager = /** @class */ (function () {
        /** Private to enforce static method calls and prevent instantiation*/
        function AssetManager() {
        }
        /** Initialize this manager */
        AssetManager.initialize = function () {
            AssetManager.s_Loaders.push(new Weaver.ImageAssetLoader());
        };
        /**
         * Registers provided loader with the asset manager
         * @param loader Loader to be registered
         */
        AssetManager.registerLoader = function (loader) {
            AssetManager.s_Loaders.push(loader);
        };
        /**
         * A callback to be made from an asset loader when an asset is loaded
         * @param asset
         */
        AssetManager.onAssetLoaded = function (asset) {
            AssetManager.s_LoadedAssets[asset.name] = asset;
            Weaver.Message.send(Weaver.MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
        };
        /**
         * Attempts to load an asset using a registered asset loader
         * @param assetName Name/url of the asset to be loaded
         */
        AssetManager.loadAsset = function (assetName) {
            var extension = assetName.split('.').pop().toLowerCase();
            for (var _i = 0, _a = AssetManager.s_Loaders; _i < _a.length; _i++) {
                var l = _a[_i];
                if (l.supportedExtensions.indexOf(extension) !== -1) {
                    l.loadAsset(assetName);
                    return;
                }
            }
            console.warn("Unable to load asset with extension " + extension + ". There is no loader associated with it");
        };
        /**
         * Indicates if an asset with provided name has been loaded
         * @param assetName Asset name to check
         */
        AssetManager.isAssetLoaded = function (assetName) {
            return AssetManager.s_LoadedAssets[assetName] !== undefined;
        };
        /**
         * Attempts to get an asset with provided name
         * @param assetName Asset name to get
         * @returns If found it is returned; otherwise undefined is returned
         */
        AssetManager.getAsset = function (assetName) {
            if (AssetManager.s_LoadedAssets[assetName] !== undefined) {
                return AssetManager.s_LoadedAssets[assetName];
            }
            else {
                AssetManager.loadAsset(assetName);
            }
            return undefined;
        };
        AssetManager.s_Loaders = [];
        AssetManager.s_LoadedAssets = {};
        return AssetManager;
    }());
    Weaver.AssetManager = AssetManager;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Represents an image asset */
    var ImageAsset = /** @class */ (function () {
        /**
         * Creates a new image asset
         * @param name Name of this asset
         * @param data Data of this asset
         */
        function ImageAsset(name, data) {
            this.name = name;
            this.data = data;
        }
        Object.defineProperty(ImageAsset.prototype, "width", {
            /** Width of this image asset */
            get: function () {
                return this.data.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ImageAsset.prototype, "height", {
            /** Height of this image asset */
            get: function () {
                return this.data.height;
            },
            enumerable: false,
            configurable: true
        });
        return ImageAsset;
    }());
    Weaver.ImageAsset = ImageAsset;
    /** Represents an image asset loader */
    var ImageAssetLoader = /** @class */ (function () {
        function ImageAssetLoader() {
        }
        Object.defineProperty(ImageAssetLoader.prototype, "supportedExtensions", {
            /** Extensions supported by this asset loader */
            get: function () {
                return ["png", "gif", "jpg"];
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Loads an asset with the given name
         * @param assetName Name of the asset to be loaded
         */
        ImageAssetLoader.prototype.loadAsset = function (assetName) {
            var image = new Image();
            image.onload = this.onImageLoaded.bind(this, assetName, image);
            image.src = assetName;
        };
        ImageAssetLoader.prototype.onImageLoaded = function (assetName, image) {
            console.log("onImageLoaded: assetName/image", assetName, image);
            var asset = new ImageAsset(assetName, image);
            Weaver.AssetManager.onAssetLoaded(asset);
        };
        return ImageAssetLoader;
    }());
    Weaver.ImageAssetLoader = ImageAssetLoader;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Main game engine class */
    var Engine = /** @class */ (function () {
        /** Creates a new engine */
        function Engine() {
        }
        /** Starts up this engine */
        Engine.prototype.start = function () {
            this.m_Canvas = Weaver.GLUtilities.initialize();
            Weaver.AssetManager.initialize();
            Weaver.gl.clearColor(0.15, 0.15, 0.15, 1);
            this.loadShaders();
            this.m_Shader.use();
            // Load
            this.m_Projection = Weaver.Matrix4x4.orthographic(0, this.m_Canvas.width, this.m_Canvas.height, 0, -100.0, 1000.0);
            this.m_Sprite = new Weaver.Sprite("test", "assets/textures/Checkerboard.png");
            this.m_Sprite.load();
            this.m_Sprite.position.x = 200;
            this.m_Sprite.position.y = 100;
            this.resize();
            this.loop();
        };
        /** Resizes the canvas to fit the window */
        Engine.prototype.resize = function () {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
                Weaver.gl.viewport(0, 0, Weaver.gl.canvas.width, Weaver.gl.canvas.height);
                this.m_Projection = Weaver.Matrix4x4.orthographic(0, this.m_Canvas.width, this.m_Canvas.height, 0, -100.0, 1000.0);
            }
        };
        Engine.prototype.loop = function () {
            Weaver.MessageBus.update(0);
            Weaver.gl.clear(Weaver.gl.COLOR_BUFFER_BIT);
            // Set uniforms
            var colorPosition = this.m_Shader.getUniformLocation("u_tint");
            Weaver.gl.uniform4f(colorPosition, 1, 1, 1, 1);
            var projectionPosition = this.m_Shader.getUniformLocation("u_projection");
            Weaver.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.m_Projection.data));
            var modelPosition = this.m_Shader.getUniformLocation("u_model");
            Weaver.gl.uniformMatrix4fv(modelPosition, false, new Float32Array(Weaver.Matrix4x4.translation(this.m_Sprite.position).data));
            this.m_Sprite.draw(this.m_Shader);
            this.m_Sprite.position.x += 1;
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n            attribute vec3 a_position;\n            attribute vec2 a_texCoord;\n\n            uniform mat4 u_projection;\n            uniform mat4 u_model;\n\n            varying vec2 v_texCoord;\n\n            void main()\n            {\n                gl_Position = u_projection * u_model * vec4(a_position, 1.0);\n                v_texCoord = a_texCoord;\n            }";
            var fragmentShaderSource = "\n            precision mediump float;\n\n            uniform vec4 u_tint;\n            uniform sampler2D u_diffuse;\n\n            varying vec2 v_texCoord;\n\n            void main()\n            {\n                gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);\n            }";
            this.m_Shader = new Weaver.Shader("basic", vertexShaderSource, fragmentShaderSource);
        };
        return Engine;
    }());
    Weaver.Engine = Engine;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Responsible for setting up a WebGL rendering context */
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
    /** Represents the information needed for a GLBuffer attribute */
    var AttributeInfo = /** @class */ (function () {
        function AttributeInfo() {
        }
        return AttributeInfo;
    }());
    Weaver.AttributeInfo = AttributeInfo;
    /** Represents a WebGL buffer */
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
        /** Destroys this buffer */
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
        /** Unbinds this buffer */
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
        /** Uploads this buffer's data to the GPU */
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
        /** Draws this buffer */
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
    /** Represents a WebGL shader */
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
            /** The name of this shader */
            get: function () {
                return this.m_Name;
            },
            enumerable: false,
            configurable: true
        });
        /** Use this shader */
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
    /** Represents a 2D sprite which is drawn on the screen */
    var Sprite = /** @class */ (function () {
        /**
         * Creates a new sprite
         * @param name Name of this sprite
         * @param textureName Name of the texture to use with this sprite
         * @param width Width of this sprite
         * @param height Height of this sprite
         */
        function Sprite(name, textureName, width, height) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            /** Position of this sprite */
            this.position = new Weaver.Vector3();
            this.m_Name = name;
            this.m_Width = width;
            this.m_Height = height;
            this.m_TextureName = textureName;
            this.m_Texture = Weaver.TextureManager.getTexture(this.m_TextureName);
        }
        Object.defineProperty(Sprite.prototype, "name", {
            get: function () {
                return this.m_Name;
            },
            enumerable: false,
            configurable: true
        });
        Sprite.prototype.destroy = function () {
            this.m_Buffer.destroy();
            Weaver.TextureManager.releaseTexture(this.m_TextureName);
        };
        /** Performs loading logic on this sprite */
        Sprite.prototype.load = function () {
            this.m_Buffer = new Weaver.GLBuffer(5);
            var positionAttribute = new Weaver.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this.m_Buffer.addAttributeLocation(positionAttribute);
            var texCoordAttribute = new Weaver.AttributeInfo();
            texCoordAttribute.location = 1;
            texCoordAttribute.offset = 3;
            texCoordAttribute.size = 2;
            this.m_Buffer.addAttributeLocation(texCoordAttribute);
            var vertices = [
                // x,y,z,   u,v
                0, 0, 0, 0, 0,
                0, this.m_Height, 0, 0, 1.0,
                this.m_Width, this.m_Height, 0, 1.0, 1.0,
                this.m_Width, this.m_Height, 0, 1.0, 1.0,
                this.m_Width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0
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
        /** Draws this sprite */
        Sprite.prototype.draw = function (shader) {
            this.m_Texture.activateAndBind(0);
            var diffuseLocation = shader.getUniformLocation("u_diffuse");
            Weaver.gl.uniform1i(diffuseLocation, 0);
            this.m_Buffer.bind();
            this.m_Buffer.draw();
        };
        return Sprite;
    }());
    Weaver.Sprite = Sprite;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    var LEVEL = 0;
    var BORDER = 0;
    var TEMP_IMAGE_DATA = new Uint8Array([255, 255, 255, 255]);
    var Texture = /** @class */ (function () {
        function Texture(name, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            this.m_IsLoaded = false;
            this.m_Name = name;
            this.m_Width = width;
            this.m_Height = height;
            this.m_Handle = Weaver.gl.createTexture();
            Weaver.Message.subscribe(Weaver.MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_Name, this);
            this.bind();
            Weaver.gl.texImage2D(Weaver.gl.TEXTURE_2D, LEVEL, Weaver.gl.RGBA, 1, 1, BORDER, Weaver.gl.RGBA, Weaver.gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);
            var asset = Weaver.AssetManager.getAsset(this.name);
            if (asset !== undefined) {
                this.loadTextureFromAsset(asset);
            }
        }
        Object.defineProperty(Texture.prototype, "name", {
            get: function () {
                return this.m_Name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "isLoaded", {
            get: function () {
                return this.m_IsLoaded;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "width", {
            get: function () {
                return this.m_Width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "height", {
            get: function () {
                return this.m_Height;
            },
            enumerable: false,
            configurable: true
        });
        Texture.prototype.destroy = function () {
            Weaver.gl.deleteTexture(this.m_Handle);
        };
        Texture.prototype.activateAndBind = function (textureUnit) {
            if (textureUnit === void 0) { textureUnit = 0; }
            Weaver.gl.activeTexture(Weaver.gl.TEXTURE0 + textureUnit);
            this.bind();
        };
        Texture.prototype.bind = function () {
            Weaver.gl.bindTexture(Weaver.gl.TEXTURE_2D, this.m_Handle);
        };
        Texture.prototype.unbind = function () {
            Weaver.gl.bindTexture(Weaver.gl.TEXTURE_2D, undefined);
        };
        Texture.prototype.onMessage = function (message) {
            if (message.code === Weaver.MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_Name) {
                this.loadTextureFromAsset(message.context);
            }
        };
        Texture.prototype.loadTextureFromAsset = function (asset) {
            this.m_Width = asset.width;
            this.m_Height = asset.height;
            this.bind();
            Weaver.gl.texImage2D(Weaver.gl.TEXTURE_2D, LEVEL, Weaver.gl.RGBA, Weaver.gl.RGBA, Weaver.gl.UNSIGNED_BYTE, asset.data);
            if (this.isPowerOf2()) {
                Weaver.gl.generateMipmap(Weaver.gl.TEXTURE_2D);
            }
            else {
                // Do not generate mipmap and clamp wrapping to edge
                Weaver.gl.texParameteri(Weaver.gl.TEXTURE_2D, Weaver.gl.TEXTURE_WRAP_S, Weaver.gl.CLAMP_TO_EDGE); // u
                Weaver.gl.texParameteri(Weaver.gl.TEXTURE_2D, Weaver.gl.TEXTURE_WRAP_T, Weaver.gl.CLAMP_TO_EDGE); // v
                Weaver.gl.texParameteri(Weaver.gl.TEXTURE_2D, Weaver.gl.TEXTURE_MIN_FILTER, Weaver.gl.LINEAR);
            }
            this.m_IsLoaded = true;
        };
        Texture.prototype.isPowerOf2 = function () {
            return (this.isValuePowerOf2(this.width) && this.isValuePowerOf2(this.height));
        };
        Texture.prototype.isValuePowerOf2 = function (value) {
            return (value & (value - 1)) == 0;
        };
        return Texture;
    }());
    Weaver.Texture = Texture;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    var TextureReferenceNode = /** @class */ (function () {
        function TextureReferenceNode(texture) {
            this.referenceCount = 1;
            this.texture = texture;
        }
        return TextureReferenceNode;
    }());
    var TextureManager = /** @class */ (function () {
        function TextureManager() {
        }
        TextureManager.getTexture = function (textureName) {
            if (TextureManager.s_Textures[textureName] === undefined) {
                var texture = new Weaver.Texture(textureName);
                TextureManager.s_Textures[textureName] = new TextureReferenceNode(texture);
            }
            else {
                TextureManager.s_Textures[textureName].referenceCount++;
            }
            return TextureManager.s_Textures[textureName].texture;
        };
        TextureManager.releaseTexture = function (textureName) {
            if (TextureManager.s_Textures[textureName] === undefined) {
                console.warn("Texture named ".concat(textureName, " does not exist an cannot be released"));
            }
            else {
                TextureManager.s_Textures[textureName].referenceCount--;
                if (TextureManager.s_Textures[textureName].referenceCount < 1) {
                    TextureManager.s_Textures[textureName].texture.destroy();
                    TextureManager.s_Textures[textureName] = undefined;
                    delete TextureManager.s_Textures[textureName];
                }
            }
        };
        TextureManager.s_Textures = {};
        return TextureManager;
    }());
    Weaver.TextureManager = TextureManager;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Represents 4x4 matrix to be used for transformations */
    var Matrix4x4 = /** @class */ (function () {
        /** Creates a new 4x4 matrix */
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
            /** Returns data contained in this matrix as an array of numbers */
            get: function () {
                return this.m_Data;
            },
            enumerable: false,
            configurable: true
        });
        /** Creates and returns an identity matrix */
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
        /** Returns data of this matrix as a Float32Array */
        Matrix4x4.prototype.toFloat32Array = function () {
            return new Float32Array(this.m_Data);
        };
        return Matrix4x4;
    }());
    Weaver.Matrix4x4 = Matrix4x4;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Represents 2-component vector */
    var Vector2 = /** @class */ (function () {
        /**
         * Creates a new vector2
         * @param x The X component
         * @param y The Y component
         */
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.m_X = x;
            this.m_Y = y;
        }
        Object.defineProperty(Vector2.prototype, "x", {
            get: function () {
                return this.m_X;
            },
            set: function (value) {
                this.m_X = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
            get: function () {
                return this.m_Y;
            },
            set: function (value) {
                this.m_Y = value;
            },
            enumerable: false,
            configurable: true
        });
        /** Returns the data of this vector as a number array */
        Vector2.prototype.toArray = function () {
            return [this.m_X, this.m_Y];
        };
        /** Returns the data of this vector as a Float32Array */
        Vector2.prototype.toFLoat32Array = function () {
            return new Float32Array(this.toArray());
        };
        return Vector2;
    }());
    Weaver.Vector2 = Vector2;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Represents 3-component vector */
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
        /** Returns the data of this vector as a number array */
        Vector3.prototype.toArray = function () {
            return [this.m_X, this.m_Y, this.m_Z];
        };
        /** Returns the data of this vector as a Float32Array */
        Vector3.prototype.toFLoat32Array = function () {
            return new Float32Array(this.toArray());
        };
        return Vector3;
    }());
    Weaver.Vector3 = Vector3;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Represents message priorities */
    var MessagePriority;
    (function (MessagePriority) {
        /** Normal message priority, message will be sent as soon as the queue allows */
        MessagePriority[MessagePriority["NORMAL"] = 0] = "NORMAL";
        /** High message priority, message will be sent immediately */
        MessagePriority[MessagePriority["HIGH"] = 1] = "HIGH";
    })(MessagePriority = Weaver.MessagePriority || (Weaver.MessagePriority = {}));
    /** Represents a message which can be sent and processed across the system */
    var Message = /** @class */ (function () {
        /**
         * Creates a new message
         * @param code Code for this message, which is subscribed to and listened for
         * @param sender Class instance which send this message
         * @param context Free-form context data to be included with this message
         * @param priority Priority of this message
         */
        function Message(code, sender, context, priority) {
            if (priority === void 0) { priority = MessagePriority.NORMAL; }
            this.code = code;
            this.sender = sender;
            this.context = context;
            this.priority = priority;
        }
        /**
         * Sends a normal-priority message with provided parameters
         * @param code Code for this message, which is subscribed to and listened for
         * @param sender Class instance which send this message
         * @param context Free-form context data to be included with this message
         */
        Message.send = function (code, sender, context) {
            Weaver.MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL));
        };
        /**
         * Sends a high-priority message with provided parameters
         * @param code Code for this message, which is subscribed to and listened for
         * @param sender Class instance which send this message
         * @param context Free-form context data to be included with this message
         */
        Message.sendPriority = function (code, sender, context) {
            Weaver.MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH));
        };
        /**
         * Subscribes the provided handler to listen for the message
         * @param code Code to listen for
         * @param handler Message handler to be called when a message containing the provided code is sent
         */
        Message.subscribe = function (code, handler) {
            Weaver.MessageBus.addSubscription(code, handler);
        };
        /**
         * Unsubscribes the provided handler from listening for the message
         * @param code Code to no longer listen for
         * @param handler Message handler to unsubscribe
         */
        Message.unsubscribe = function (code, handler) {
            Weaver.MessageBus.removeSubscription(code, handler);
        };
        return Message;
    }());
    Weaver.Message = Message;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    /** Represents message manager responsible for sending messages across the system */
    var MessageBus = /** @class */ (function () {
        /** Constructor hidden to prevent instantiation */
        function MessageBus() {
        }
        /**
         * Adds a subscription to the privided code using provided handler
         * @param code Code to listen for
         * @param handler Handler to be subscribed
         */
        MessageBus.addSubscription = function (code, handler) {
            if (MessageBus.s_Subscriptions[code] === undefined) {
                MessageBus.s_Subscriptions[code] = [];
            }
            if (MessageBus.s_Subscriptions[code].indexOf(handler) !== -1) {
                console.warn("Attempting to add a duplicate handler to code: " + code + ". Subscription not added");
            }
            else {
                MessageBus.s_Subscriptions[code].push(handler);
            }
        };
        /**
         * Removes a subscription to the privided code using provided handler
         * @param code Code to no longer listen for
         * @param handler Handler to be unsubscribed
         * @returns
         */
        MessageBus.removeSubscription = function (code, handler) {
            if (MessageBus.s_Subscriptions[code] === undefined) {
                console.warn("Cannot unsubscribe handler from code: " + code + ". That code is not subscribed to");
                return;
            }
            var nodeIndex = MessageBus.s_Subscriptions[code].indexOf(handler);
            if (nodeIndex !== -1) {
                MessageBus.s_Subscriptions[code].splice(nodeIndex, 1);
            }
        };
        /**
         * Posts the provided message to the message system
         * @param message Message to be sent
         */
        MessageBus.post = function (message) {
            console.log("Message posted: ", message);
            var handlers = MessageBus.s_Subscriptions[message.code];
            if (handlers === undefined) {
                return;
            }
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var h = handlers_1[_i];
                if (message.priority === Weaver.MessagePriority.HIGH) {
                    h.onMessage(message);
                }
                else {
                    MessageBus.s_NormalMessageQueue.push(new Weaver.MessageSubscriptionNode(message, h));
                }
            }
        };
        /**
         * Performs update logic on this message bus
         * @param time Delta time in milliseconds since the last update
         */
        MessageBus.update = function (time) {
            if (MessageBus.s_NormalMessageQueue.length === 0) {
                return;
            }
            var messageLimit = Math.min(MessageBus.s_NormalQueueMessagePerUpdate, MessageBus.s_NormalMessageQueue.length);
            for (var i = 0; i < messageLimit; ++i) {
                var node = MessageBus.s_NormalMessageQueue.pop();
                node.handler.onMessage(node.message);
            }
        };
        MessageBus.s_Subscriptions = {};
        MessageBus.s_NormalQueueMessagePerUpdate = 10;
        MessageBus.s_NormalMessageQueue = [];
        return MessageBus;
    }());
    Weaver.MessageBus = MessageBus;
})(Weaver || (Weaver = {}));
var Weaver;
(function (Weaver) {
    var MessageSubscriptionNode = /** @class */ (function () {
        function MessageSubscriptionNode(message, handler) {
            this.message = message;
            this.handler = handler;
        }
        return MessageSubscriptionNode;
    }());
    Weaver.MessageSubscriptionNode = MessageSubscriptionNode;
})(Weaver || (Weaver = {}));
//# sourceMappingURL=main.js.map