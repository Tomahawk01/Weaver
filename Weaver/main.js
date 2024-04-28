var Weaver;
(function (Weaver) {
    var Engine = /** @class */ (function () {
        function Engine() {
            this.m_Count = 0;
            console.log("Instance of the engine has been created!");
        }
        Engine.prototype.start = function () {
            this.loop();
        };
        Engine.prototype.loop = function () {
            this.m_Count++;
            document.title = this.m_Count.toString();
            requestAnimationFrame(this.loop.bind(this));
        };
        return Engine;
    }());
    Weaver.Engine = Engine;
})(Weaver || (Weaver = {}));
window.onload = function () {
    var engine = new Weaver.Engine;
    engine.start();
};
//# sourceMappingURL=main.js.map