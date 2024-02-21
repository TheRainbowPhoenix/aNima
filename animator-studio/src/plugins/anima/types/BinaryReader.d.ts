declare class BinaryReader extends StreamReader {
    constructor(uint8Array: any);
    isBigEndian: boolean;
    raw: any;
    dataView: DataView;
    readIndex: number;
    readFloat32(): number;
    readFloat32ArrayOffset(ar: any, length: any, offset: any): any;
    readFloat32Array(ar: any): any;
    readFloat64(): number;
    readUint8(): any;
    isEOF(): boolean;
    readInt8(): number;
    readUint16(): number;
    readUint16Array(ar: any): any;
    readInt16(): number;
    readUint32(): number;
    readInt32(): number;
    byteArrayToString(bytes: any): string;
    readString(): string;
    readBool(): boolean;
    readBlockType(): any;
    readId(label: any): number;
    readUint8Length(): any;
    readUint16Length(): number;
    readUint32Length(): number;
}
declare namespace BinaryReader {
    let alignment: number;
}
export default BinaryReader;
import StreamReader from "./StreamReader.js";
