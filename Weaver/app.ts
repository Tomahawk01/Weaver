
namespace Weaver {

    export class Engine {
        private m_Count: number = 0;

        public constructor() {
            console.log("Instance of the engine has been created!");
        }

        public start(): void {
            this.loop();
        }

        private loop(): void {
            this.m_Count++;
            document.title = this.m_Count.toString();
            requestAnimationFrame(this.loop.bind(this));
        }
    }
}

window.onload = function () {
    let engine = new Weaver.Engine;
    engine.start();
}