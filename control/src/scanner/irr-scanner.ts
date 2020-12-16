
import { GlobalUse } from '../global-use';
import { RFIDStation } from './test/rfid-station';
let debug = require('debug')('app:irr-scanner')
const delay = require('delay');

export class IRRScanner {

    scanStationPeriod = 2000
    lastScanStationTime = new Date(0)
    testScanner = new RFIDStation()

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor() {

    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    isStart = false
    private isLoop = false
    async start() {
        if (this.isStart) {
            return
        }
        // 建立定時 刷新的機制
        this.isStart = true
        this.isLoop = true

        while (this.isLoop) {
            try {
                await this.loopAction()
            } catch (error) {
                debug(error)
            }
        }
    }

    async stop() {
        if (!this.isStart) {
            return
        }
        this.isLoop = false
        this.isStart = false
        await delay(1000)
    }

    async loopAction() {

        debug('main loop')

        // alert 警告 讀取 
        try {
            await this.testScanner.loopAction()
        } catch (error) {
            GlobalUse.log(`test error:  ${error}`)
        }

        // debug 時可以開
        let now = new Date()
        let gap = now.getTime() - this.lastScanStationTime.getTime()
        if (gap < this.scanStationPeriod) {
            await delay(this.scanStationPeriod - gap)
        }
        this.lastScanStationTime = new Date()
    }
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====






