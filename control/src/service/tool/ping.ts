
const exec = require('child_process').exec;
let debug = require('debug')('app:ping');

export async function ping(
    ip: string,
    timeout: number = 1000,
) {
    let p = new Promise((resolve, _) => {

        // 自己 timeout
        setTimeout(() => {
            resolve('')
        }, timeout)

        let cmd = `ping -c 1 -W ${timeout} ${ip}`
        // debug(cmd)
        exec(cmd, (error, stdout, stderr) => {
            if (error || stderr) {
                debug(cmd, error, stderr)
            }
            resolve(stdout || '')
        })
    })

    return p
}

export async function pingTest(
    ip: string,
    timeout: number = 1000,
): Promise<boolean> {

    let result = await ping(ip, timeout).catch(err => {
        debug(err)
        return ''
    }) as string

    let resultArr = []

    try {
        // 判斷字串
        resultArr = result.split("/n")
            // 正常的
            .filter(str => str.includes('icmp_seq'))
            .filter(str => str.includes('ttl'))
            .filter(str => str.includes('time'))

            //不正常含有
            .filter(str => !(str.includes('Unreachable')))
    } catch (error) {
        debug(error)
    }

    // debug(ip, resultArr)
    return resultArr.length > 0
}