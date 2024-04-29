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
            let rotation = Matrix4x4.rotationXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
            let scale = Matrix4x4.scale(this.scale);

            // T * R * S
            return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
        }

        public setFromJson(json: any): void {
            if (json.position !== undefined) {
                this.position.setFromJson(json.position);
            }

            if (json.rotation !== undefined) {
                this.rotation.setFromJson(json.rotation);
            }

            if (json.scale !== undefined) {
                this.scale.setFromJson(json.scale);
            }
        }
    }
}