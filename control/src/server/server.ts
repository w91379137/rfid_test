
let debug = require('debug')('app:server');

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

import { Controller } from './controller/controller';

export interface ServerSetting {

    port: number

    controllers: Controller[]
    middlewares: ((req: express.Request, res: express.Response, next) => void)[]

}

export class Server {

    app = express();

    setting: ServerSetting
    listen;

    constructor(setting: ServerSetting) {

        this.setting = setting

        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        this.app.use(cookieParser())

        const corsOptions = {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: ['Content-Type', 'Authorization'],
        };
        this.app.use(cors(corsOptions))

        // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

        setting.middlewares.forEach(middleware => {
            this.app.use(middleware);
        })

        // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

        setting.controllers.forEach(controller => {
            this.app.use(controller.path, controller.router)
        })

    }

    start(): Promise<void> {

        return new Promise((resolve, _) => {
            this.listen = this.app.listen(this.setting.port, () => {
                debug(`server is running on port ${this.listen.address()['port'] || this.listen.address().toString()}`);
                resolve()
            });
        })

    }

}