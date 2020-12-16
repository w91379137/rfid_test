

import { GlobalUse } from '../../global-use';
import { pingTest } from '../../service/tool/ping';
const debug = require('debug')('app:rfid-station')

export class RFIDStation {

    async loopAction() {
        
        let isConnect = await pingTest(`192.168.0.87`).catch()
        if (!isConnect) {
            GlobalUse.log(`disconnect`)
        }

        let res = await GlobalUse.api.RFIDRemind(0).catch()
        console.log(res)
    }
}