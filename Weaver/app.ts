var engine: Weaver.Engine;

// Main entry point to the application
window.onload = function () {
    engine = new Weaver.Engine;
    engine.start();
}

window.onresize = function () {
    engine.resize();
}