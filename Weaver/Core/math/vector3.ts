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

        /** Returns the data of this vector as a number array */
        public toArray(): number[] {
            return [this.m_X, this.m_Y, this.m_Z];
        }

        /** Returns the data of this vector as a Float32Array */
        public toFLoat32Array(): Float32Array {
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
    }
}