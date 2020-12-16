let request = require('request');

// https://juejin.im/post/5c7b1be9f265da2dac4568a2
// https://github.com/request/request

export function get(url: string, timeout: number = 200) {
    return new Promise((resolve, reject) => {

        request.get({
            url: url,
            json: true,
            timeout,
            forever: true,
        }, (err, httpResponse, body) => {
            if (err) {
                //console.error('error:', err);
                reject(err)
            } else {
                //console.error(body);
                resolve(body)
            }
        });
    })
}

export function post(url: string, data: any, timeout: number = 200) {
    return new Promise((resolve, reject) => {

        request.post({
            url: url,
            json: true,
            form: data,
            timeout,
            forever: true,
        }, (err, httpResponse, body) => {
            if (err) {
                //console.error('error:', err);
                reject(err)
            } else {
                //console.error(body);
                resolve(body)
            }
        });
    })
}
