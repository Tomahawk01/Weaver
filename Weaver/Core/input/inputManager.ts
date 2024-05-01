namespace Weaver {

    export enum Keys {
        // Arrow keys
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    }

    export class MouseContext {

        public leftDown: boolean;
        public rightDown: boolean;
        public position: Vector2;

        public constructor(leftDown: boolean, rightDown: boolean, position: Vector2) {
            this.leftDown = leftDown;
            this.rightDown = rightDown;
            this.position = position;
        }
    }

    export class InputManager {

        private static s_Keys: boolean[] = [];

        private static s_PreviousMouseX: number;
        private static s_PreviousMouseY: number;
        private static s_MouseX: number;
        private static s_MouseY: number;
        private static s_LeftDown: boolean = false;
        private static s_RightDown: boolean = false;

        public static initialize(): void {
            for (let i = 0; i < 255; i++) {
                InputManager.s_Keys[i] = false;
            }

            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
            window.addEventListener("mousemove", InputManager.onMouseMove);
            window.addEventListener("mousedown", InputManager.onMouseDown);
            window.addEventListener("mouseup", InputManager.onMouseUp);
        }

        public static isKeyDown(key: Keys): boolean {
            return InputManager.s_Keys[key];
        }

        public static getMousePosition(): Vector2 {
            return new Vector2(InputManager.s_MouseX, InputManager.s_MouseY);
        }

        private static onKeyDown(event: KeyboardEvent): boolean {
            InputManager.s_Keys[event.keyCode] = true;
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        private static onKeyUp(event: KeyboardEvent): boolean {
            InputManager.s_Keys[event.keyCode] = false;
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        private static onMouseMove(event: MouseEvent): void {
            InputManager.s_PreviousMouseX = InputManager.s_MouseX;
            InputManager.s_PreviousMouseY = InputManager.s_MouseY;
            InputManager.s_MouseX = event.clientX;
            InputManager.s_MouseY = event.clientY;
        }

        private static onMouseDown(event: MouseEvent): void {
            if (event.button === 0) {
                this.s_LeftDown = true;
            }
            else if (event.button === 2) {
                this.s_RightDown = true;
            }

            Message.send("MOUSE_DOWN", this, new MouseContext(InputManager.s_LeftDown, InputManager.s_RightDown, InputManager.getMousePosition()));
        }

        private static onMouseUp(event: MouseEvent): void {
            if (event.button === 0) {
                this.s_LeftDown = false;
            }
            else if (event.button === 2) {
                this.s_RightDown = false;
            }

            Message.send("MOUSE_UP", this, new MouseContext(InputManager.s_LeftDown, InputManager.s_RightDown, InputManager.getMousePosition()));
        }
    }
}