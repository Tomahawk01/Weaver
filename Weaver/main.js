// Main entry point to the application
window.onload = function () {
    var engine = new Weaver.Engine;
    engine.start();
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
            console.log("Instance of the engine has been created!");
        }
        /**
         * Starts up this engine
         */
        Engine.prototype.start = function () {
            this.m_Canvas = Weaver.GLUtilities.initialize();
            Weaver.gl.clearColor(0.15, 0.15, 0.15, 1);
            this.loop();
        };
        Engine.prototype.loop = function () {
            Weaver.gl.clear(Weaver.gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this));
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
//# sourceMappingURL=main.js.map