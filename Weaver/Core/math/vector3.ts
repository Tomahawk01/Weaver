namespace Weaver {

    /**
     * Represents 3-component vector
     */
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

        /**
         * Returns the data of this vector as a number array
         */
        public toArray(): number[] {
            return [this.m_X, this.m_Y, this.m_Z];
        }

        /**
         * Returns the data of this vector as a Float32Array
         */
        public toFLoat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }
    }
}