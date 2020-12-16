import { GlobalUse } from './../global-use';
import mqtt from './publish';
import { checkKeys } from './routeFunc';

const {default: PQueue} = require("p-queue");
const plcQueue = new PQueue({ concurrency: 1 });

const express = require('express');
const router = express.Router();

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

let status = async (req, res) => { 
    
    res.status(200).send({
        success: true,
        result: GlobalUse.plcCollector.connection.isoConnectionState
    })
}

router.post('/status', status);

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

let read = async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['group'])
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        })
        return
    }

    let group = body.group
    let success = true
    let result = await GlobalUse.plcCollector.readGroup(group).catch(() => {
        success = false
        return {}
    })
    
    res.status(200).send({
        // 這邊沒有 屬性 應該要 回 false
        success: success && (Object.keys(result).length > 0), // Object.keys 對上 null 會 error
        result: result
    })
}

let queueRead = async (req, res) => {
    return plcQueue.add(() => read(req, res))
}

router.post('/read', queueRead);

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

let write = async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['tagName', 'value']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let tagName = body.tagName;
    let value = body.value;
    let success = true
    let result = await GlobalUse.plcCollector.write(tagName, value).catch(() => {
        success = false
    })

    res.status(200).send({
        success: success,
        result: result
    })
}

let queueWrite = async (req, res) => {
    return plcQueue.add(() => write(req, res))
}

router.post('/write', queueWrite);

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

export default router;