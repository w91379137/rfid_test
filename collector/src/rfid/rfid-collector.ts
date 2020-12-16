
// 改成 websocket 7dc2792
// const WebSocket = require('ws');
const net = require('net');
import { Client } from './share/client'
import { stringToBuffer } from './buffer-string';

const timeout = 2500

export class RfidCollector {

    // const Host = '169.254.10.12';
    // const Port = 10000;
    // const Host = '127.0.0.1';
    // const Port = 8888;
    host = '127.0.0.1'
    port = 8888

    sendClient
    isWebsocket = false

    lastPong: Date = new Date() // 目前沒用

    rfidClient: Client

    manualDisconnect = false // 手動斷開
    isNoQuit = true // 20200409 常時保持 連讀
    tagStr: string // rfid

    lastReadRequestTime = new Date()
    lastUpdateTime = new Date()
    isEnhancedOpen = false

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(
        host: string,
        port: number,
    ) {
        this.host = host;
        this.port = port;

        // setInterval(() => {
        //     if (this.websocketClient) {
        //         this.websocketClient.ping()
        //     }
        // }, timeout)
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    connect() {

        // 還有連線
        if (this.sendClient) {
            return
        }

        this.manualDisconnect = false
        this.isEnhancedOpen = false
        // https://github.com/websockets/ws
        // 如何做 heartbeat

        // connect

        let onOpen = () => {
            console.log('RFID did connect', this.host, this.port)
            this.rfidClient = new Client(this.sendClient)
            this.rfidClient.isWebsocket = this.isWebsocket
            this.rfidClient.continueReadCallback = ((res) => { this.continueRead(res) })
        }

        {// websocket
            // this.isWebsocket = true
            // this.sendClient = new WebSocket(`ws://${this.host}:${this.port}/rfid`)
            // this.sendClient.on('open', onOpen)

            // ping pong 無效
            // this.sendClient.on('pong', () => {
            //     this.lastPong = new Date()
            //     console.log(this.lastPong)
            // })
        }

        {// socket
            this.isWebsocket = false
            this.sendClient = net.connect(this.port, this.host, onOpen)
            try {
                this.sendClient.setKeepAlive(true, 1000)
            } catch (error) {

            }
        }

        this.sendClient.on('error', (error) => {
            console.log(`error ${this.host} ${error}`)
            this.retry()
        })
        if (this.isWebsocket) {
            this.sendClient.on('close', () => {
                console.log(`close ${this.host}`)
                this.retry()
            })
        }
        else {
            this.sendClient.on('end', () => {
                console.log(`close ${this.host}`)
                this.retry()
            })
        }
    }

    disconnect() {
        this.manualDisconnect = true
        this.clearConnect()
    }

    private clearConnect() {
        if (!this.sendClient) {
            console.log(`No connect ${this.host}`)
            return
        }

        console.log(`RFID clearConnect ${this.host}`)
        let sendClient = this.sendClient
        this.sendClient = undefined

        try {
            if (this.isWebsocket) {
                sendClient.close()
            }
            else {
                sendClient.destroy()
            }
        } catch (error) {
            console.log(`RFID close error ${this.host} ${error}`)
        }
        this.rfidClient = undefined
    }

    retry(nextTime: number = 3000) {
        this.clearConnect()

        // 強制斷線
        if (!this.manualDisconnect) {
            setTimeout(() => {
                this.connect()
            }, nextTime)
        }
    }

    async singleReadWords() {
        if (!this.rfidClient) {
            console.log(`singleReadWords in Retrying ${this.host}`)
            return undefined;
        }
        return await this.rfidClient.singleReadWords(1, 1);
    }

    async singleWriteWords(value: string) {
        if (!this.rfidClient) {
            console.log(`singleWriteWords in Retrying ${this.host}`)
            return undefined;
        }
        let b = stringToBuffer(value)
        // 之後再來想
        return await this.rfidClient.singleWriteWords(1, 1, [b[0], b[1], b[2], b[3]]);
    }

    remindRFID() {
        this.rfidClient.enhancedBufferedReadWords(1, 1)
    }

    async readUntil() {
        if (!this.rfidClient) {
            console.log(`readUntil in Retrying ${this.host}`)
            return undefined
        }

        // 改到 連讀一起看
        // 上次_要求讀取時間 晚於(大於) 上次_更新時間 >> 上次要求還沒更新
        let gap = this.lastReadRequestTime.getTime() - this.lastUpdateTime.getTime()

        // if (!this.isEnhancedOpen || gap > 0) {
        //     this.isEnhancedOpen = true
        //     this.tagStr = '' // 清空
        //     this.rfidClient.enhancedBufferedReadWords(1, 1)
        // }
        
        // 因為有連續 送重讀 的機制 gap 已經不適用
        // 所以一定要清空
        this.tagStr = '' // 清空
        this.rfidClient.enhancedBufferedReadWords(1, 1) // 維持一直連讀

        this.lastReadRequestTime = new Date()
    }

    continueRead(res) {
        // console.log('RfidCollector continueRead', res)
        this.lastUpdateTime = new Date()

        if (res && res._body && res._body.tagStr) {
            // console.log('get ', res)

            this.tagStr = res._body.tagStr
            if (this.isNoQuit) {
                return
            }
            this.rfidClient.quit(1)
            // console.log('quit rfid')
        }
        else {
            // console.log('nothing')
            this.tagStr = ''
        }
    }

    async quit() {
        if (this.isNoQuit) {
            console.log(`noQuit ${this.host}`)
            return undefined
        }
        if (!this.rfidClient) {
            console.log(`quit in Retrying ${this.host}`)
            return undefined
        }
        return await this.rfidClient.quit(1)
    }
}