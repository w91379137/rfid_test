
require('source-map-support').install();

let debug = require('debug')('app:main')

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// service

import { GlobalUse } from './global-use';
import { append } from './service/append';
import { WriteLog } from './service/log';
import { storage } from './service/localstorage';
import { IRRScanner } from './scanner/irr-scanner';

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// server 

import * as express from 'express';
import { Server } from './server/server';

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// error

let errorlog = new WriteLog('error')
process.on('uncaughtException' as any, (err, origin) => {
    errorlog.log(err)
})

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

async function run() {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // service

    GlobalUse.myStorage = storage
    GlobalUse.append = append

    let normallog = new WriteLog('log')
    GlobalUse.log = (value: string) => { normallog.log(value) }
    GlobalUse.log(`git_hash ${git_hash}`)

    let scanner = new IRRScanner()
    scanner.start()
    GlobalUse.scanner = scanner

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    // server

    // Middleware 中介軟體
    function loggerMiddleware(req: express.Request, res: express.Response, next) {
        debug(`Method:${req.method} Path:${req.path} Body:${JSON.stringify(req.body)}`);
        next();
    }

    const port = 5002;
    let server = new Server({
        port: port,
        controllers: [
        ],
        middlewares: [
            loggerMiddleware
        ],
    })

    server.start()

}

run()