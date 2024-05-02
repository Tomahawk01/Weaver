var engine: Weaver.Engine;

// Main entry point to the application
window.onload = function () {
    engine = new Weaver.Engine(320, 480);
    engine.start();
}

window.onresize = function () {
    engine.resize();
}