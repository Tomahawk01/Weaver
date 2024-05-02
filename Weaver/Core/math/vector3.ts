namespace Weaver {

    /** Represents 3-component vector */
    export class Vector3 {

        private m_X: number;
        private m_Y: number;
        private m_Z: number;

        /**
         * Creates a new vector3
         * @param x The X component
         * @param y The Y component
         * @param z The Z component
         */
        public constructor(x: number = 0, y: number = 0, z: number = 0) {
            this.m_X = x;
            this.m_Y = y;
            this.m_Z = z;
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

        public get z(): number {
            return this.m_Z;
        }

        public set z(value: number) {
            this.m_Z = value;
        }

        /** Returns a Vector3 representing the zero vector */
        public static get zero(): Vector3 {
            return new Vector3();
        }

        /** Returns a Vector3 representing the vector with all components set to one */
        public static get one(): Vector3 {
            return new Vector3(1, 1, 1);
        }

        /**
        * Calculates the Euclidean distance between two Vector3 points
        * @param a The first Vector3 point
        * @param b The second Vector3 point
        */
        public static distance(a: Vector3, b: Vector3): number {
            let diff = a.subtract(b);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
        }

        /**
         * Sets the components of this Vector3 to the specified values
         * @param x New value for the x-component (optional)
         * @param y New value for the y-component (optional)
         * @param z New value for the z-component (optional)
         */
        public set(x?: number, y?: number, z?: number): void {
            if (x !== undefined) {
                this.m_X = x;
            }
            if (y !== undefined) {
                this.m_Y = y;
            }
            if (z !== undefined) {
                this.m_Z = z;
            }
        }

        /**
         * Check if this Vector3 is equal to the one passed in
         * @param v Vector3 to check against
         */
        public equals(v: Vector3): boolean {
            return (this.x === v.x && this.y === v.y && this.z === v.z);
        }

        /** Returns the data of this vector as a number array */
        public toArray(): number[] {
            return [this.m_X, this.m_Y, this.m_Z];
        }

        /** Returns the data of this vector as a Float32Array */
        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        /**
         * Copies the components of another Vector3 into this Vector3
         * @param vector Vector3 to copy from
         */
        public copyFrom(vector: Vector3): void {
            this.m_X = vector.m_X;
            this.m_Y = vector.m_Y;
            this.m_Z = vector.m_Z;
        }

        /**
         * Sets the Vector3 components from a JSON object containing 'x', 'y', and 'z' properties
         * @param json Json object to set the somponents from
         */
        public setFromJson(json: any): void {
            if (json.x !== undefined) {
                this.m_X = Number(json.x);
            }

            if (json.y !== undefined) {
                this.m_Y = Number(json.y);
            }

            if (json.z !== undefined) {
                this.m_Z = Number(json.z);
            }
        }

        /**
         * Adds the provided vector to this vector and returns the result
         * @param v Vector3 to add
         */
        public add(v: Vector3): Vector3 {
            this.m_X += v.m_X;
            this.m_Y += v.m_Y;
            this.m_Z += v.m_Z;

            return this;
        }

        /**
         * Subtracts the provided vector from this vector and returns the result
         * @param v Vector3 to subtract
         */
        public subtract(v: Vector3): Vector3 {
            this.m_X -= v.m_X;
            this.m_Y -= v.m_Y;
            this.m_Z -= v.m_Z;

            return this;
        }

        /**
         * Multiplies this vector by the provided vector and returns the result
         * @param v Vector3 to multiply by
         */
        public multiply(v: Vector3): Vector3 {
            this.m_X *= v.m_X;
            this.m_Y *= v.m_Y;
            this.m_Z *= v.m_Z;

            return this;
        }

        /**
         * Divides this vector by the provided vector and returns the result
         * @param v Vector3 to divide by
         */
        public divide(v: Vector3): Vector3 {
            this.m_X /= v.m_X;
            this.m_Y /= v.m_Y;
            this.m_Z /= v.m_Z;

            return this;
        }

        /**
        * Clones this Vector3
        */
        public clone(): Vector3 {
            return new Vector3(this.m_X, this.m_Y, this.m_Z);
        }

        public toVector2(): Vector2 {
            return new Vector2(this.m_X, this.m_Y);
        }
    }
}