/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */

let payloadStore: Buffer;
let payloadLength = 0;

const createWsBinaryFrame = (data: Buffer): Buffer => {
    const { length } = data;
    const header = Buffer.alloc(2);
    let lengthBytesLen = 0;
    let payloadBuffer: Buffer;

    // Set FIN and Opcode for binary data
    header[0] = 0x82;

    // Generate a 4-byte masking key
    const maskKey = Buffer.alloc(4);
    maskKey.writeUInt32BE(Math.floor(Math.random() * 0xffffffff));

    // Determine payload length and header
    if (length < 126) {
        header[1] = 0x80 | length;
        payloadBuffer = Buffer.alloc(length + 6); // Header (2 bytes) + Mask key (4 bytes)
    } else if (length < 65536) {
        header[1] = 0x80 | 126;
        const lengthBytes = Buffer.alloc(2);
        lengthBytesLen = 2;
        lengthBytes.writeUInt16BE(length, 0);
        payloadBuffer = Buffer.alloc(length + 8); // Header (2 bytes) + Length (2 bytes) + Mask key (4 bytes)
        payloadBuffer.set(lengthBytes, 2);
    } else {
        header[1] = 0x80 | 127;
        const lengthBytes = Buffer.alloc(8);
        lengthBytesLen = 8;
        lengthBytes.writeBigUInt64BE(BigInt(length), 0);
        payloadBuffer = Buffer.alloc(length + 14); // Header (2 bytes) + Length (8 bytes) + Mask key (4 bytes)
        payloadBuffer.set(lengthBytes, 2);
    }

    // Set the header and masking key
    payloadBuffer.set(header, 0);
    payloadBuffer.set(maskKey, 2 + lengthBytesLen);

    // XOR payload data with masking key
    for (let i = 0; i < length; i++) {
        payloadBuffer[2 + lengthBytesLen + maskKey.length + i] = data[i] ^ maskKey[i % 4];
    }

    return payloadBuffer;
};

const getPayloadFromWsFrame = (data: Buffer): Buffer => {
    if (!data.length) return null;

    // new binary message
    if (data[0] === 0x82) {
        payloadStore = null;
        payloadLength = 0;

        payloadLength = data[1] & 0x7f;
        let offset = 2;

        if (payloadLength === 126) {
            payloadLength = data.readUInt16BE(2);
            offset += 2;
        } else if (payloadLength === 127) {
            payloadLength = Number(data.readBigUInt64BE(2)); // Use BigInt for 64-bit length
            offset += 8;
        }

        // Extract the payload
        payloadStore = data.subarray(offset, offset + payloadLength);
    }
    // this should be a continuation of the binary message, if not it will get discarded by a new message
    else if (payloadStore) {
        payloadStore = Buffer.concat([payloadStore, data.subarray(0, payloadLength - payloadStore.length)]);
    }

    // done
    if (payloadStore && payloadStore.length >= payloadLength) {
        return payloadStore;
    }

    return null;
};

export { createWsBinaryFrame, getPayloadFromWsFrame };
