const express = require('express');
let debug = require('debug')('app:root-controller');
import { Controller } from "./controller";
import { GlobalUse } from "../../global-use";

export class RootController implements Controller {

    path = '/'
    router = express.Router()

    constructor() {

        this.router.get('/', async (req, res) => {
            debug('get')
            GlobalUse.myStorage.setItem('time', (new Date()).toString());
            debug(GlobalUse.myStorage.getItem('time'));
            res.status(200).send({
                success: true,
                result: 'result',
            })
        })

        this.router.post('/', async (req, res) => {

            let body = req.body
            debug('post', body)
            res.status(200).send({
                success: true,
                result: body,
            })
        })

    }

}