namespace Weaver {

    /** Represents the information needed for a GLBuffer attribute */
    export class AttributeInfo {
        /** Location of this attribute */
        public location: number;
        /** Size (number of elements) in this attribute (i.e Vector3 = 3) */
        public size: number;
        /** Number of elements from the beginning of the buffer */
        public offset: number;
    }

    /** Represents a WebGL buffer */
    export class GLBuffer {

        private m_HasAttributeLocation: boolean = false;
        private m_ElementSize: number;
        private m_Stride: number;
        private m_Buffer: WebGLBuffer;

        private m_TargerBufferType: number;
        private m_DataType: number;
        private m_Mode: number;
        private m_TypeSize: number;

        private m_Data: number[] = [];
        private m_Attributes: AttributeInfo[] = [];

        /**
         * Creates a new GL buffer
         * @param elementSize Size of each element in this buffer
         * @param dataType Data type of this buffer. Default: gl.FLOAT
         * @param targetBufferType Buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. Default: gl.ARRAY_BUFFER
         * @param mode Drawing mode of this buffer. Can be either gl.TRIANGLES or gl.LINES. Default: gl.TRIANGLES
         */
        public constructor(elementSize: number, dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
            this.m_ElementSize = elementSize;
            this.m_DataType = dataType;
            this.m_TargerBufferType = targetBufferType;
            this.m_Mode = mode;

            // Determine byte size
            switch (this.m_DataType) {
                case gl.FLOAT:
                case gl.INT:
                case gl.UNSIGNED_INT:
                    this.m_TypeSize = 4;
                    break;
                case gl.SHORT:
                case gl.UNSIGNED_SHORT:
                    this.m_TypeSize = 2;
                    break;
                case gl.BYTE:
                case gl.UNSIGNED_BYTE:
                    this.m_TypeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }

            this.m_Stride = this.m_ElementSize * this.m_TypeSize;
            this.m_Buffer = gl.createBuffer();
        }

        /** Destroys this buffer */
        public destroy(): void {
            gl.deleteBuffer(this.m_Buffer);
        }

        /**
         * Binds this buffer
         * @param normalized Indicates if the data should be normalized. Default: false
         */
        public bind(normalized: boolean = false): void {
            gl.bindBuffer(this.m_TargerBufferType, this.m_Buffer);

            if (this.m_HasAttributeLocation) {
                for (let it of this.m_Attributes) {
                    gl.vertexAttribPointer(it.location, it.size, this.m_DataType, normalized, this.m_Stride, it.offset * this.m_TypeSize);
                    gl.enableVertexAttribArray(it.location);
                }
            }
        }

        /** Unbinds this buffer */
        public unbind(): void {
            for (let it of this.m_Attributes) {
                gl.disableVertexAttribArray(it.location);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.m_Buffer);
        }

        /**
         * Adds an attribute with the provided information to this buffer
         * @param info Information to be added
         */
        public addAttributeLocation(info: AttributeInfo): void {
            this.m_HasAttributeLocation = true;
            this.m_Attributes.push(info);
        } 

        /**
         * Adds data to this buffer
         * @param data
         */
        public pushbackData(data: number[]): void {
            for (let d of data) {
                this.m_Data.push(d);
            }
        }

        /** Uploads this buffer's data to the GPU */
        public upload(): void {
            gl.bindBuffer(this.m_TargerBufferType, this.m_Buffer);

            let bufferData: ArrayBuffer;
            switch (this.m_DataType) {
                case gl.FLOAT:
                    bufferData = new Float32Array(this.m_Data);
                    break;
                case gl.INT:
                    bufferData = new Int32Array(this.m_Data);
                    break;
                case gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this.m_Data);
                    break;
                case gl.SHORT:
                    bufferData = new Int16Array(this.m_Data);
                    break;
                case gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this.m_Data);
                    break;
                case gl.BYTE:
                    bufferData = new Int8Array(this.m_Data);
                    break;
                case gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this.m_Data);
                    break;
            }

            gl.bufferData(this.m_TargerBufferType, bufferData, gl.STATIC_DRAW);
        }

        /** Draws this buffer */
        public draw(): void {
            if (this.m_TargerBufferType === gl.ARRAY_BUFFER) {
                gl.drawArrays(this.m_Mode, 0, this.m_Data.length / this.m_ElementSize);
            }
            else if (this.m_TargerBufferType === gl.ELEMENT_ARRAY_BUFFER) {
                gl.drawElements(this.m_Mode, this.m_Data.length, this.m_DataType, 0);
            }
        }
    }
}