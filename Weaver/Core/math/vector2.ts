namespace Weaver {

    /** Represents 2-component vector */
    export class Vector2 {

        private m_X: number;
        private m_Y: number;

        /**
         * Creates a new vector2
         * @param x The X component
         * @param y The Y component
         */
        public constructor(x: number = 0, y: number = 0) {
            this.m_X = x;
            this.m_Y = y;
        }

        public get x(): number {
            return this.m_X;
        }

        public set x(value: number) {
            this.m_X = value;
        }

        public get y(): number {
            return this.m_Y;
        }

        public set y(value: number) {
            this.m_Y = value;
        }

        /** Returns the data of this vector as a number array */
        public toArray(): number[] {
            return [this.m_X, this.m_Y];
        }

        /** Returns the data of this vector as a Float32Array */
        public toFLoat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }
    }
}