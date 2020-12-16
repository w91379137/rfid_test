
var mc = require('./mcprotocol.js');

export class PlcCollector {

    host = '192.168.0.10'
    port = 1026

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    connection = new mc;

    connect() {
        this.connection.initiateConnection({
            port: this.port,
            host: this.host,
            ascii: false
        }, (error) => { this.didConnect(error) })
    }

    private didConnect(error) {
        if (error) {
            console.log(error)
            setTimeout(() => {
                this.connect();
            }, 3000);
            return;
        }

        // 設定 tag 名稱 轉換表
        this.connection.setTranslationCB(tagName => {
            return this.tagName2RegisterAddress(tagName);
        });

        console.log('PLC did connect', this.host, this.port)

        // 讀取特定 群組
        // this.readGroup('groupA');
    }


    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // 名稱處理
    tagNameGroupMapDict = {

        // 環境記錄相關
        env: {
            D5000_env: 'D5000,35',
        },
        stopTime: {
            D5031: 'D5031',
        },

        // alarm 相關點位
        alarm1000: {
            M1000_100: 'M1000,100',
        },
        alarm1100: {
            M1100_100: 'M1100,100',
        },
        alarm1200: {
            M1200_100: 'M1200,100',
        },
        alarm1300: {
            M1300_100: 'M1300,100',
        },
        alarm1400: {
            M1400_100: 'M1400,100',
        },
        alarm1500: {
            M1500_100: 'M1500,100',
        },

        // 有關目前噴房的交換區
        s1: {
            D5100: 'D5100',
            D5110: 'D5110',
            // 給機器人
            D5112: 'D5112',
            // 車子
            D5116: 'D5116',
        },
        s2: {
            D5200: 'D5200',
            D5210: 'D5210',
            // 給機器人
            D5212: 'D5212',
            D5213: 'D5213',
            // 車子
            D5216: 'D5216',
        },
        s3: {
            D5300: 'D5300',
            D5310: 'D5310',
            // 給機器人
            D5312: 'D5312',
            D5313: 'D5313',
            D5314: 'D5314',
            D5315: 'D5315',
            // 車子
            D5316: 'D5316',
        },
        s4: {
            D5400: 'D5400',
            D5410: 'D5410',
            // 給機器人
            D5412: 'D5412',
            D5413: 'D5413',
            D5414: 'D5414',
            D5415: 'D5415',
            // 車子
            D5416: 'D5416',
        },
        share: {
            // 開始 急停 電池兩個 前位 後位
            D5040: 'D5040',
            D5041: 'D5041',
            D5042: 'D5042',
            D5043: 'D5043',

            // 模式 跟 心跳
            D5500: 'D5500',
            D5510: 'D5510',
        },

        // 機器人 回收資料區
        // 目前每格 都視為 double 拿
        // TODO: 應該精算格子數目
        s1rb: {
            W0: `W${0x0000},10`, // 5格
        },
        s2rb: {
            W80: `W${0x0080},44`, // 22格
        },
        s3rb: {
            W100: `W${0x0100},70`, // 35格
        },
        s4rb: {
            W180: `W${0x0180},70`, // 35格
        },
        test: {
            W600_6: `W${0x0600},6`, // ?格
        }
    }

    // 把 每個 group 放一起
    tagNameMapDict = (() => {
        let result = {}
        Object.keys(this.tagNameGroupMapDict).map(groupName => {
            let group = this.tagNameGroupMapDict[groupName];
            result = Object.assign(result, group);
        })
        return result;
    })()

    // "CT Variance" > "D0011"
    private tagName2RegisterAddress(tagName: string) {
        return this.tagNameMapDict[tagName];
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    // 需要用計時器 來 重複啟動
    lastItems = {};
    lastGroup;
    async readGroup(name: string) {

        if (Object.keys(this.tagNameGroupMapDict).indexOf(name) < 0) {
            console.log("Group key not found");
            return {}
        }

        let data = await new Promise((resolve, reject) => {

            // 如果一直移除 重加 會出現 三次成功一次的情況
            if (this.lastGroup != name) {
                this.connection.removeItems(this.lastItems);
                this.lastItems = Object.keys(this.tagNameGroupMapDict[name])

                this.connection.addItems(this.lastItems);
                this.lastGroup = name;
            }

            this.connection.readAllItems((error, values) => {

                if (error) {
                    console.log("SOMETHING WENT WRONG READING VALUES!!!!");
                    reject(error);
                    return;
                }

                // 從 values 拿到資料
                // 看要怎樣 call api
                // console.log(values);
                resolve(values);
            });
        }).catch(err => {
            console.log(err)
        });

        return data;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    //0 正常 1 plc 錯誤 2 找不到key
    async write(tagName, value) {

        // 排除沒有再對照表
        if (Object.keys(this.tagNameMapDict).indexOf(tagName) < 0) {
            console.log("TagName not found");
            return { code: 2, msg: "TagName not found" };
        }

        let result = await new Promise((resolve, _) => {
            this.connection.writeItems(tagName, value, resolve);
        });

        // console.log(result);
        if (result) {
            // result 有值代表錯誤
            return { code: 1, msg: result };
        }

        return { code: 0, msg: "success" };
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
}