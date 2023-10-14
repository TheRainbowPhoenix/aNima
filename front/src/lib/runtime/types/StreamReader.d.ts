export default class StreamReader {
    readFloat32(): void;
    readFloat32Array(ar: any, length: any, offset: any): void;
    readFloat32ArrayOffset(ar: any, length: any, offset: any): void;
    readFloat64(): void;
    isEOF(): void;
    readInt8(): void;
    readUint8(): void;
    readUint8Length(): void;
    readUint16(): void;
    readUint16Array(ar: any, length: any): void;
    readUint16Length(): void;
    readInt16(): void;
    readUint32(): void;
    readUint32Length(): void;
    readInt32(): void;
    byteArrayToString(bytes: any): void;
    readString(): void;
    readRaw(to: any, length: any): void;
    readBool(): void;
    readBlockType(): void;
    readImage(isOOB: any, cb: any): void;
    readId(label: any): void;
    openArray(label: any): void;
    closeArray(): void;
    openObject(label: any): void;
    closeObject(): void;
    get containerType(): string;
}
