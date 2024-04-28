namespace Weaver {

    /** Represents 4x4 matrix to be used for transformations */
    export class Matrix4x4 {

        private m_Data: number[] = [];

        /** Creates a new 4x4 matrix */
        private constructor() {
            this.m_Data = [ // identity matrix
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }

        /** Returns data contained in this matrix as an array of numbers */
        public get data(): number[] {
            return this.m_Data;
        }

        /** Creates and returns an identity matrix */
        public static identity(): Matrix4x4 {
            return new Matrix4x4();
        }

        /**
         * Creates and returns a new orthographic projection matrix
         * @param left Left extents of the viewport
         * @param right Right extents of the viewport
         * @param bottom Bottom extents of the viewport
         * @param top Top extents of the viewport
         * @param nearClip Near clipping plane
         * @param farClip Far clipping plane
         */
        public static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix4x4 {
            let m = new Matrix4x4();

            let lr: number = 1.0 / (left - right);
            let bt: number = 1.0 / (bottom - top);
            let nf: number = 1.0 / (nearClip - farClip);

            m.m_Data[0] = -2.0 * lr;
            m.m_Data[5] = -2.0 * bt;
            m.m_Data[10] = 2.0 * nf;
            m.m_Data[12] = (left + right) * lr;
            m.m_Data[13] = (top + bottom) * bt;
            m.m_Data[14] = (farClip + nearClip) * nf;

            return m;
        }

        /**
         * Creates and returns a transformation matrix using provided position
         * @param position Position to be used in transformation
         */
        public static translation(position: Vector3): Matrix4x4 {
            let m = new Matrix4x4();

            m.m_Data[12] = position.x;
            m.m_Data[13] = position.y;
            m.m_Data[14] = position.z;

            return m;
        }

        /** Returns data of this matrix as a Float32Array */
        public toFloat32Array(): Float32Array {
            return new Float32Array(this.m_Data);
        }
    }
}