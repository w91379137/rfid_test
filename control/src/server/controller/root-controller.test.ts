import * as request from "supertest";
import { Server } from "../server";
import { RootController } from './root-controller';
import { GlobalUse } from "../../global-use";

let server: Server

describe('Test RootController', () => {

    beforeAll(() => {

        // 為了測試 GlobalUse 讓測試失敗
        // GlobalUse.myStorage = undefined

        let port = 10001
        server = new Server({
            port: port,
            controllers: [new RootController()],
            middlewares: [],
        })
        return server.start()
    })

    afterAll(() => {
        server.listen.close()
    })

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    test("GET", (done) => {

        request(server.app)
            .get("/")
            .end((err, res) => {
                expect(err).toBeNull
                expect(res.body.result).toEqual('result');
                expect(res.status).toBe(200);
                done()
            })
    })

    test("POST", (done) => {

        let testBody = { name: 'test' };

        request(server.app)
            .post("/")
            .send(testBody)
            .end((err, res) => {
                // console.log(res.body);
                //{ success: true, result: { name: 'test' } }
                expect(err).toBeNull
                expect(res.body.result).toMatchObject(testBody)
                expect(res.status).toBe(200);
                done()
            })
    })
});