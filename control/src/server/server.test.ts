import { Server } from "./server";

let server: Server
let port = 10000

describe('Test Server', () => {

    beforeAll(() => {

        server = new Server({
            port: port,
            controllers: [],
            middlewares: [],
        })
        return server.start()
    })

    afterAll(() => {
        server.listen.close()
    })

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    test("Port", async (done) => {

        expect(server.listen.address()['port']).toBe(port);
        done()

    })

})