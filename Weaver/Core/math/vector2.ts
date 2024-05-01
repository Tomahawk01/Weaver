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

        /** Returns a Vector2 representing the zero vector */
        public static get zero(): Vector2 {
            return new Vector2();
        }

        /** Returns a Vector2 representing the vector with all components set to one */
        public static get one(): Vector2 {
            return new Vector2(1, 1);
        }

        /**
         * Copies the components of another Vector2 into this Vector2
         * @param v Vector to copy from
         */
        public copyFrom(v: Vector2): void {
            this.m_X = v.m_X;
            this.m_Y = v.m_Y;
        }

        /** Returns the data of this vector as a number array */
        public toArray(): number[] {
            return [this.m_X, this.m_Y];
        }

        /** Returns the data of this vector as a Float32Array */
        public toFLoat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        /**
        * Sets the Vector2 components from a JSON object containing 'x' and 'y' properties
        * @param json Json object to set the somponents from
        */
        public setFromJson(json: any): void {
            if (json.x !== undefined) {
                this.m_X = Number(json.x);
            }

            if (json.y !== undefined) {
                this.m_Y = Number(json.y);
            }
        }
    }
}