'use strict';

const Process = require('./process');

class Traceroute extends Process {
    constructor(sendwait = 0,port = 80,proto='icmp') {
        let protoPram = '-I'
        switch (proto) {
            case 'tcp':
                protoPram = '-T'
                break;
            case 'udp':
                protoPram = '-U'
                break;
            case 'icmp':
                protoPram = '-I'
                break;
        }
        super('traceroute', ['-q', 1, '-z', sendwait, '-n',protoPram,'-p',port]);
    }

    parseDestination(data) {
        const regex = /^traceroute\sto\s(?:[a-zA-Z0-9:.]+)\s\(([a-zA-Z0-9:.]+)\)/;
        const parsedData = new RegExp(regex, '').exec(data);

        let result = null;
        if (parsedData !== null) {
            result = parsedData[1];
        }

        return result;
    }

    parseHop(hopData) {
        const regex = /^\s*(\d+)\s+(?:([a-zA-Z0-9:.]+)\s+([0-9.]+\s+ms)|(\*))/;
        const parsedData = new RegExp(regex, '').exec(hopData);

        let result = null;
        if (parsedData !== null) {
            if (parsedData[4] === undefined) {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[2],
                    rtt1: parsedData[3]
                };
            }
            else {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[4],
                    rtt1: parsedData[4]
                };
            }
        }

        return result;
    }
}

module.exports = Traceroute;