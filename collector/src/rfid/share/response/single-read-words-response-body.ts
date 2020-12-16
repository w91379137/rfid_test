import { BaseResponseBody } from './base-response-body';
import { bufferToString } from '../../buffer-string'
export class SingleReadWordsResponseBody extends BaseResponseBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        try {
            const commandCode = buffer[0]
            if (commandCode !== 0x10) {
                return null
            }

            const wordNumber = (buffer[1] & 0xf0) >> 4
            const channel = (buffer[1] & 0x0f) >> 1
            const replyCounter = buffer[3]
            const data = buffer.slice(4);

            return new this(wordNumber, channel, replyCounter, data)
        } catch (e) {

            return null
        }
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _wordNumber
    _channel
    _replyCounter
    _data
    tagStr: string

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(wordNumber, channel, replyCounter, data) {
        super(0x10)
        this._wordNumber = wordNumber;
        // Toggle bit 目前不考慮
        this._channel = channel;
        this._replyCounter = replyCounter;
        this._data = data;

        this.tagStr = bufferToString(data)
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {

        const payload = Buffer.alloc(4 + this._data.length);

        try {
            payload[0] = this._commandCode;
            payload[1] = (this._wordNumber << 4) | (this._channel << 1);
            payload[3] = this._replyCounter;
            this._data.copy(payload, 4)

            this.tagStr = bufferToString(this._data)
        } catch (error) {
            console.log(error)
        }

        return payload;
    }
}