namespace Weaver {

    export class Transform {

        public position: Vector3 = Vector3.zero;
        public rotation: Vector3 = Vector3.zero;
        public scale: Vector3 = Vector3.one;

        public copyFrom(trasform: Transform): void {
            this.position.copyFrom(trasform.position);
            this.rotation.copyFrom(trasform.rotation);
            this.scale.copyFrom(trasform.scale);
        }

        public getTransformationMatrix(): Matrix4x4 {
            let translation = Matrix4x4.translation(this.position);
            let rotation = Matrix4x4.rotationZ(this.rotation.z);
            let scale = Matrix4x4.scale(this.scale);

            // T * R * S
            return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
        }
    }
}