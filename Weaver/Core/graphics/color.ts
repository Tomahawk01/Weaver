namespace Weaver {

    export class Color {

        private m_R: number;
        private m_G: number;
        private m_B: number;
        private m_A: number;

        public constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
            this.m_R = r;
            this.m_G = g;
            this.m_B = b;
            this.m_A = a;
        }

        public get r(): number {
            return this.m_R;
        }

        public get rFloat(): number {
            return this.m_R / 255.0;
        }

        public set r(value: number) {
            this.m_R = value;
        }

        public get g(): number {
            return this.m_G;
        }

        public get gFloat(): number {
            return this.m_G / 255.0;
        }

        public set g(value: number) {
            this.m_G = value;
        }

        public get b(): number {
            return this.m_B;
        }

        public get bFloat(): number {
            return this.m_B / 255.0;
        }

        public set b(value: number) {
            this.m_B = value;
        }

        public get a(): number {
            return this.m_A;
        }

        public get aFloat(): number {
            return this.m_A / 255.0;
        }

        public set a(value: number) {
            this.m_A = value;
        }

        public toArray(): number[] {
            return [this.m_R, this.m_G, this.m_B, this.m_A];
        }

        public toFloatArray(): number[] {
            return [this.m_R / 255, this.m_G / 255, this.m_B / 255, this.m_A / 255];
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toFloatArray());
        }

        public static white(): Color {
            return new Color(255, 255, 255, 255);
        }

        public static black(): Color {
            return new Color(0, 0, 0, 255);
        }

        public static red(): Color {
            return new Color(255, 0, 0, 255);
        }

        public static green(): Color {
            return new Color(0, 255, 0, 255);
        }

        public static blue (): Color {
            return new Color(0, 0, 255, 255);
        }
    }
}