

import { GlobalUse } from '../global-use';
let debug = require('debug')('app:irr-scanner')

export async function getRFIDStr(rfidIdx: number): Promise<string> {

    // 1-8
    if (rfidIdx <= 0 || rfidIdx > 8) {
        return
    }

    let rsp = await GlobalUse.api.readRFID(rfidIdx).catch(error => {
        debug(error)
        return {}
    })

    if (rsp.success) {
        let result = rsp.result

        if (result && result._body) {
            let tagStr = result._body.tagStr
            return tagStr
        }
    }

    return
}

export async function startRFIDEnhancedRead(rfidIdx: number): Promise<string> {
    return
}

export async function getRFIDEnhancedRead(rfidIdx: number): Promise<string> {
    return
}