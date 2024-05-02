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
         * Calculates the Euclidean distance between two Vector2 points
         * @param a The first Vector2 point
         * @param b The second Vector2 point
         */
        public static distance(a: Vector2, b: Vector2): number {
            let diff = a.clone().subtract(b);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
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
        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        /** Converts Vector2 to Vector3 */
        public toVector3(): Vector3 {
            return new Vector3(this.m_X, this.m_Y, 0);
        }

        /**
         * Sets the components of this Vector2 to the specified values
         * @param x New value for the x-component (optional)
         * @param y New value for the y-component (optional)
         */
        public set(x?: number, y?: number): void {
            if (x !== undefined) {
                this.m_X = x;
            }
            if (y !== undefined) {
                this.m_Y = y;
            }
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

        /**
        * Adds the provided vector to this vector and returns the result
        * @param v Vector2 to add
        */
        public add(v: Vector2): Vector2 {
            this.m_X += v.m_X;
            this.m_Y += v.m_Y;

            return this;
        }

        /**
         * Subtracts the provided vector from this vector and returns the result
         * @param v Vector2 to subtract
         */
        public subtract(v: Vector2): Vector2 {
            this.m_X -= v.m_X;
            this.m_Y -= v.m_Y;

            return this;
        }

        /**
         * Multiplies this vector by the provided vector and returns the result
         * @param v Vector2 to multiply by
         */
        public multiply(v: Vector2): Vector2 {
            this.m_X *= v.m_X;
            this.m_Y *= v.m_Y;

            return this;
        }

        /**
         * Divides this vector by the provided vector and returns the result
         * @param v Vector2 to divide by
         */
        public divide(v: Vector2): Vector2 {
            this.m_X /= v.m_X;
            this.m_Y /= v.m_Y;

            return this;
        }

        /**
         * Scales this Vector2 by the specified factor
         * @param scale Scaling factor
         */
        public scale(scale: number): Vector2 {
            this.m_X *= scale;
            this.m_Y *= scale;

            return this;
        }

        /** Clones this Vector2 */
        public clone(): Vector2 {
            return new Vector2(this.m_X, this.m_Y);
        }
    }
}