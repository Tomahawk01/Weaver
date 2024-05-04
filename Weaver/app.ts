var engine: Weaver.Engine;

// Main entry point to the application
window.onload = function () {
    engine = new Weaver.Engine(320, 480);
    engine.start("viewport");
}

window.onresize = function () {
    engine.resize();
}