namespace Weaver {

    /**
    * Main game engine class
    */
    export class Engine {

        private m_Canvas: HTMLCanvasElement;

        /**
         * Creates a new engine
         */
        public constructor() {
            console.log("Instance of the engine has been created!");
        }

        /**
         * Starts up this engine
         */
        public start(): void {
            this.m_Canvas = GLUtilities.initialize();

            gl.clearColor(0.15, 0.15, 0.15, 1);

            this.loop();
        }

        /**
         * Resizes the canvas to fit the window
         */
        public resize(): void {
            if (this.m_Canvas !== undefined) {
                this.m_Canvas.width = window.innerWidth;
                this.m_Canvas.height = window.innerHeight;
            }
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            requestAnimationFrame(this.loop.bind(this));
        }
    }
}