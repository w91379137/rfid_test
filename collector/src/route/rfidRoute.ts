import { GlobalUse } from './../global-use';
import mqtt from './publish';
import { checkKeys } from './routeFunc';
const express = require('express');
const router = express.Router();

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

let status = async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['index']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        });
        return
    }

    res.status(200).send({
        success: true,
        result: rfid.lastPong
    })
}

router.post('/status', status);

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/read', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['index']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        });
        return
    }

    let result = await rfid.singleReadWords()
    // console.log(result);

    res.status(200).send({
        success: true,
        result: result,
    })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/write', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['index', 'value']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    let value = "" + body.value //字串
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        });
        return
    }

    let result = await rfid.singleWriteWords(value)
    // console.log(result);

    res.status(200).send({
        success: true,
        result: result,
    })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
router.post('/remindRFID', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['index']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        });
        return
    }

    // 提醒 rfid
    rfid.remindRFID()

    res.status(200).send({
        success: true,
        result: {},
    })
})

router.post('/readUntil', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['index']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        });
        return
    }

    // 打開連讀
    await rfid.readUntil()

    res.status(200).send({
        success: true,
        result: {},
    })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/readUntilResult', async (req, res) => {
    let body = req.body
    let message = checkKeys(body, ['index']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        });
        return
    }

    res.status(200).send({
        success: true,
        result: rfid.tagStr,
    })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/quit', async (req, res) => {
    let body = req.body

    let message = checkKeys(body, ['index']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        });
        return
    }

    let result = await rfid.quit()

    res.status(200).send({
        success: true,
        result
    })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

function getRFID(body, req, res) {

    let message = checkKeys(body, ['index']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        })
        return undefined
    }

    let index = body.index
    let rfid = GlobalUse.rfidCollectorList[index - 1]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid index not found"
        })
        return undefined
    }

    return rfid
}

router.post('/retry', async (req, res) => {
    let body = req.body

    let rfid = getRFID(body, req, res)
    if (!rfid) {
        return
    }

    let result = await rfid.retry(20 * 1000)

    res.status(200).send({
        success: true,
        result
    })
})

router.post('/connect', async (req, res) => {
    let body = req.body

    let rfid = getRFID(body, req, res)
    if (!rfid) {
        return
    }

    let result
    try {
        result = rfid.connect()
    } catch (error) {
        console.log(error)
    }

    res.status(200).send({
        success: true,
        result
    })
})

router.post('/disconnect', async (req, res) => {
    let body = req.body

    let rfid = getRFID(body, req, res)
    if (!rfid) {
        return
    }

    let result
    try {
        result = rfid.disconnect()
    } catch (error) {
        console.log(error)
    }

    res.status(200).send({
        success: true,
        result
    })
})

router.post('/noQuit', async (req, res) => {
    let body = req.body

    let rfid = getRFID(body, req, res)
    if (!rfid) {
        return
    }

    rfid.isNoQuit = true

    res.status(200).send({
        success: true,
    })
})


// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

export default router;