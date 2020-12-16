
export function bufferToString(buffer: Buffer) {
    return buffer.toString('hex')
}

export function stringToBuffer(str: string) {
    // 預計 8 碼
    let s = ("00000000" + str).slice(-8)
    return Buffer.from(s,'hex')
}