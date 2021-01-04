

import { GlobalUse } from '../../global-use';
import { pingTest } from '../../service/tool/ping';
const debug = require('debug')('app:rfid-station')

export class RFIDStation {

    async loopAction() {
        
        let isConnect = await pingTest(`192.168.0.87`).catch()
        if (!isConnect) {
            GlobalUse.log(`disconnect`)
        }

        {
            let res = await GlobalUse.api.RFIDRemind(1).catch()
            if (!res.success) {
                GlobalUse.log(`RFIDRemind fail`)
            }
        }
        if(getRandomInt(0, 5) === 0){
            let res = await GlobalUse.api.RFIDReadUntil(1).catch()
            if (res.success) {
                console.log('reset', res)
            }
        }

        if(getRandomInt(0, 5) === 0){
            let res = await GlobalUse.api.RFIDReadUntilResult(1).catch()
            if (res.success) {
                console.log('get', res)
            }
        }

        
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }