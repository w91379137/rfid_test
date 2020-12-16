import { get, post } from "./tool/http";
import { GlobalUse } from '../global-use';

const retry = require('async-retry')
const debug = require('debug')('app:api.service');

export class Api {

    private collectorUrl = 'http://localhost:5001/';  // URL to web api
    private apiUrl = 'http://localhost:5000/';  // URL to web api

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // PLC

    async readPLC(group: string) {
        return this.convPost('plc/read', {
            group
        }, this.collectorUrl)
    }

    async writePLC(tagName, value) {
        // debug('目前 writePLC 沒有修改 plc, plc 測試中', tagName, value)
        // return {}

        return this.convPost(`plc/write`, {
            tagName,
            value,
        }, this.collectorUrl)
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // PLC

    async readENV() {
        return this.convPost('plc/read', {
            group: 'env'
        }, this.collectorUrl)
    }

    async readStopTime() {
        return this.convPost('plc/read', {
            group: 'stopTime'
        }, this.collectorUrl)
    }

    async readAlarm(n: number) {
        return this.convPost('plc/read', {
            group: `alarm${n}`
        }, this.collectorUrl)
    }

    async readShare() {
        return this.convPost('plc/read', {
            group: 'share'
        }, this.collectorUrl)
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // API

    async existAlarm() {
        return this.convPost('alarmData/readAllTrigger', {})
    }

    async jigEnter(
        trolleyId: string,
        isProductMode: boolean,
    ) {
        return this.convPost('motion/createAuto', {
            areaId: 'F010_F_DESTATIC_1',
            trolleyId,
            isProductMode,
        })
    }

    async jigProduct(trolleyId: string) {
        return this.convPost('motion/readTrolleyIdAction', {
            trolleyId,
        })
    }

    async robotReport(
        areaId: string,
        trolleyId: string,
        values: any,
    ) {
        return this.convPost('motion/writeRobotFinishInfo', {
            areaId,
            trolleyId,
            values,
        })
    }

    async areaLot(
        areaId: string,
        position: number = 0,
    ) {
        return this.convPost('motion/readPositionLot', {
            areaId,
            position,
        })
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    /**
     * 閘門轉移 訊號
     */
    async normalTransfer(
        areaId: string,
    ) {
        return this.convPost('motion/normalTransfer', {
            areaId,
        })
    }

    /**
     * rfid 定位訊號
     */
    async rfidCheckPostion(
        areaId: string,
        trolleyId: string,
        isAutoTrolleyId: number = 0,
    ) {
        return this.convPost('motion/rfidCheckPostion', {
            areaId,
            trolleyId,
            isAutoTrolleyId,
        })
    }

    /**
     * 滿位調整
     */
    async areaNotFull(
        areaId: string,
    ) {
        return this.convPost('motion/areaNotFull', {
            areaId,
        })
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    async tagDataCreate(tagId: number, data: string) {
        return this.convPost('tagData/create', {
            "tagId": tagId,
            "data": data
        })
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    // 0  代表 沒有讀到
    async readRFID(index: number) {
        return this.convPost('rfid/read', {
            index
        }, this.collectorUrl)
    }

    async RFIDRemind(index: number) {
        return this.convPost('rfid/remindRFID', {
            index
        }, this.collectorUrl)
    }

    async RFIDReadUntil(index: number) {
        return this.convPost('rfid/readUntil', {
            index
        }, this.collectorUrl)
    }

    async RFIDReadUntilResult(index: number) {
        return this.convPost('rfid/readUntilResult', {
            index
        }, this.collectorUrl)
    }

    async RFIDQuit(index: number) {
        return this.convPost('rfid/quit', {
            index
        }, this.collectorUrl)
    }

    async RFIDRetry(index: number) {
        return this.convPost('rfid/retry', {
            index
        }, this.collectorUrl)
    }

    async RFIDConnect(index: number) {
        return this.convPost('rfid/connect', {
            index
        }, this.collectorUrl)
    }

    async RFIDDisconnect(index: number) {
        return this.convPost('rfid/disconnect', {
            index
        }, this.collectorUrl)
    }

    async RFIDNoQuit(index: number) {
        return this.convPost('rfid/noQuit', {
            index
        }, this.collectorUrl)
    }
    
    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // 共用
    // private async convGet(
    //     path: string,
    //     prefix: string = this.apiUrl
    // ): Promise<any> {
    //     debug(`get path: %o`, path)

    //     const res = await get(prefix + path)
    //         .catch(this.handleError)

    //     return res
    // }

    private async convPost(
        path: string,
        body: any = {},
        prefix: string = this.apiUrl
    ): Promise<any> {
        // debug(`post path: %o body: %o`, path, body)

        // let tryRes = await retry(async () => {

        //     let timeout = (prefix == this.apiUrl) ? 3000 : 200
        //     let res = await post(prefix + path, body, timeout).catch(err => {
        //         debug(prefix + path, body, err)
        //         GlobalUse.log(prefix + path)
        //         return this.handleError(err)
        //     })
        //     if (!res['success']) {
        //         return
        //     }

        //     return res
        // }, { retries: 0 }).catch(err => {
        //     debug(prefix + path, body)
        //     return this.handleError(err)
        // })

        // return tryRes

        let timeout = (prefix == this.apiUrl) ? 3000 : 200
        let res = await post(prefix + path, body, timeout).catch(err => {
            debug(prefix + path, body, err)
            // GlobalUse.log(`api error ${prefix + path} >> ${JSON.stringify(body)}`)
            return this.handleError(err)
        })
        return res
    }

    private handleError(error: any): Promise<any> {
        // debug('An error occurred', error);
        debug('An error occurred');
        return Promise.resolve({ success: false, result: undefined, error: error.message || error });
    }
}
