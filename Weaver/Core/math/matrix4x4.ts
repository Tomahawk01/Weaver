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

        /**
         * Creates a 4x4 rotation matrix for rotation around X axis
         * @param angleInRadians Angle of rotation in radians
         * @returns Rotation matrix
         */
        public static rotationX(angleInRadians: number): Matrix4x4 {
            let m = new Matrix4x4();

            let c = Math.cos(angleInRadians);
            let s = Math.sin(angleInRadians);

            m.m_Data[5] = c;
            m.m_Data[6] = s;
            m.m_Data[9] = -s;
            m.m_Data[10] = c;

            return m;
        }

        /**
        * Creates a 4x4 rotation matrix for rotation around Y axis
        * @param angleInRadians Angle of rotation in radians
        * @returns Rotation matrix
        */
        public static rotationY(angleInRadians: number): Matrix4x4 {
            let m = new Matrix4x4();

            let c = Math.cos(angleInRadians);
            let s = Math.sin(angleInRadians);

            m.m_Data[0] = c;
            m.m_Data[2] = -s;
            m.m_Data[8] = s;
            m.m_Data[10] = c;

            return m;
        }

        /**
         * Creates a 4x4 rotation matrix for rotation around Z axis
         * @param angleInRadians Angle of rotation in radians
         * @returns Rotation matrix
         */
        public static rotationZ(angleInRadians: number): Matrix4x4 {
            let m = new Matrix4x4();

            let c = Math.cos(angleInRadians);
            let s = Math.sin(angleInRadians);

            m.m_Data[0] = c;
            m.m_Data[1] = s;
            m.m_Data[4] = -s;
            m.m_Data[5] = c;

            return m;
        }

        /**
         * Creates a 4x4 rotation matrix for rotation around X, Y and Z axes
         * @param xRadians Angle of rotation around the x-axis in radians
         * @param yRadians Angle of rotation around the y-axis in radians
         * @param zRadians Angle of rotation around the z-axis in radians
         * @returns Rotation matrix
         */
        public static rotationXYZ(xRadians: number, yRadians: number, zRadians: number): Matrix4x4 {
            let rx = Matrix4x4.rotationX(xRadians);
            let ry = Matrix4x4.rotationY(yRadians);
            let rz = Matrix4x4.rotationZ(zRadians);

            return Matrix4x4.multiply(Matrix4x4.multiply(rz, ry), rx);
        }

        /**
         * Creates a 4x4 scaling matrix
         * @param scale The scale vector containing scale factors for X, Y and Z axes
         * @returns Scaling matrix
         */
        public static scale(scale: Vector3): Matrix4x4 {
            let m = new Matrix4x4();

            m.m_Data[0] = scale.x;
            m.m_Data[5] = scale.y;
            m.m_Data[10] = scale.z;

            return m;
        }

        /**
         * Multiplies two 4x4 matrices
         * @param a The first matrix
         * @param b The second matrix
         * @returns Resulting matrix from the multiplication of a and b
         */
        public static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
            let m = new Matrix4x4();

            // Extracting individual elements for better readability
            let b00 = b.m_Data[0 * 4 + 0];
            let b01 = b.m_Data[0 * 4 + 1];
            let b02 = b.m_Data[0 * 4 + 2];
            let b03 = b.m_Data[0 * 4 + 3];
            let b10 = b.m_Data[1 * 4 + 0];
            let b11 = b.m_Data[1 * 4 + 1];
            let b12 = b.m_Data[1 * 4 + 2];
            let b13 = b.m_Data[1 * 4 + 3];
            let b20 = b.m_Data[2 * 4 + 0];
            let b21 = b.m_Data[2 * 4 + 1];
            let b22 = b.m_Data[2 * 4 + 2];
            let b23 = b.m_Data[2 * 4 + 3];
            let b30 = b.m_Data[3 * 4 + 0];
            let b31 = b.m_Data[3 * 4 + 1];
            let b32 = b.m_Data[3 * 4 + 2];
            let b33 = b.m_Data[3 * 4 + 3];
            let a00 = a.m_Data[0 * 4 + 0];
            let a01 = a.m_Data[0 * 4 + 1];
            let a02 = a.m_Data[0 * 4 + 2];
            let a03 = a.m_Data[0 * 4 + 3];
            let a10 = a.m_Data[1 * 4 + 0];
            let a11 = a.m_Data[1 * 4 + 1];
            let a12 = a.m_Data[1 * 4 + 2];
            let a13 = a.m_Data[1 * 4 + 3];
            let a20 = a.m_Data[2 * 4 + 0];
            let a21 = a.m_Data[2 * 4 + 1];
            let a22 = a.m_Data[2 * 4 + 2];
            let a23 = a.m_Data[2 * 4 + 3];
            let a30 = a.m_Data[3 * 4 + 0];
            let a31 = a.m_Data[3 * 4 + 1];
            let a32 = a.m_Data[3 * 4 + 2];
            let a33 = a.m_Data[3 * 4 + 3];

            // Matrix multiplication
            m.m_Data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            m.m_Data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            m.m_Data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            m.m_Data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            m.m_Data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            m.m_Data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            m.m_Data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            m.m_Data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            m.m_Data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            m.m_Data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            m.m_Data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            m.m_Data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            m.m_Data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            m.m_Data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            m.m_Data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            m.m_Data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

            return m;
        }

        /** Returns data of this matrix as a Float32Array */
        public toFloat32Array(): Float32Array {
            return new Float32Array(this.m_Data);
        }

        /**
         * Creates a copy of matrix m
         * @param m Matrix to copy
         */
        public copyFrom(m: Matrix4x4): void {
            for (let i = 0; i < 16; ++i) {
                this.m_Data[i] = m.m_Data[i];
            }
        }
    }
}