
let debug = require('debug')('app:append');
const fsjs = require('fs-js');
const fs = require('fs');

export function append(path: string, value: string) {
    fsjs.appendFile(path, value + '\n', (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                debug(err)
                let pathArr = path.split('/')
                pathArr.splice(-1, 1)
                fs.mkdir(pathArr.join('/'), { recursive: true }, (err) => {
                    if (err) throw err;
                    append(path, value)
                });
            }
            else {
                debug(err)
            }
        }
    })
}