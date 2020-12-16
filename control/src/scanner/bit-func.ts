

export function GetBit(
    int: number,
    shift: number,
): boolean {
    return (int & (0b01 << shift)) > 0;
}

export function SetBit(
    int: number,
    shift: number,
    value: boolean
): number {
    let mask = 0b1 << shift;
    if (value) {
        return int | mask
    } else {
        return int & ~mask
    }
}

export function DoubleInt(
    int1: number,
    int2: number,
): number {

    // https://stackoverflow.com/questions/35517561/combine-and-convert-two-16-bit-numbers-into-one-32-bit-number-float-in-javascr
    var buffer = new ArrayBuffer(4)
    var view = new DataView(buffer)

    view.setInt16(0, int1, false)
    view.setInt16(2, int2, false)

    return view.getUint32(0, false)
}

export function Sign2Unsign(int: number) {

    var buffer = new ArrayBuffer(2)
    var view = new DataView(buffer)

    view.setInt16(0, int, false)

    return view.getUint16(0, false)
}