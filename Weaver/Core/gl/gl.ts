namespace Weaver {

    /** WebGL rendering context */
    export var gl: WebGLRenderingContext;

    /** Responsible for setting up a WebGL rendering context */
    export class GLUtilities {
        /**
         * Initializes WebGL, optionally using canvas with assigned ID if it's defined
         * @param elementId The ID of the element to search for
         * @returns
         */
        public static initialize(elementId?: string): HTMLCanvasElement {
            let canvas: HTMLCanvasElement;

            if (elementId !== undefined) {
                canvas = document.getElementById(elementId) as HTMLCanvasElement;
                if (canvas === null) {
                    throw new Error("Can not find canvas element named: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas") as HTMLCanvasElement;
                document.body.appendChild(canvas);
            }

            gl = canvas.getContext("webgl2");
            if (gl === undefined || gl === null) {
                throw new Error("Unable to initialize WebGL2!");
            }

            return canvas;
        }
    }
}