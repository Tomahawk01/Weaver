namespace Weaver {

    /**
     * Represents a 2D sprite which is drawn on the screen
     */
    export class Sprite {

        private m_Name: string;
        private m_Width: number;
        private m_Height: number;

        private m_Buffer: GLBuffer;

        /**
         * Position of this sprite
         */
        public position: Vector3 = new Vector3();

        /**
         * Creates a new sprite
         * @param name Name of this sprite
         * @param width Width of this sprite
         * @param height Height of this sprite
         */
        public constructor(name: string, width: number = 100, height: number = 100) {
            this.m_Name = name;
            this.m_Width = width;
            this.m_Height = height;
        }

        /**
         * Performs loading logic on this sprite
         */
        public load(): void {
            this.m_Buffer = new GLBuffer(3);

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this.m_Buffer.addAttributeLocation(positionAttribute);

            let vertices = [
                // x,y,z
                0, 0, 0,
                0, this.m_Height, 0,
                this.m_Width, this.m_Height, 0,

                this.m_Width, this.m_Height, 0,
                this.m_Width, 0, 0,
                0, 0, 0
            ];

            this.m_Buffer.pushbackData(vertices);
            this.m_Buffer.upload();
            this.m_Buffer.unbind();
        }

        /**
         * Performs update logic on this sprite
         * @param time Delta time in milliseconds since the last update call
         */
        public update(time: number): void {

        }

        /**
         * Draws this sprite
         */
        public draw(): void {
            this.m_Buffer.bind();
            this.m_Buffer.draw();
        }
    }
}