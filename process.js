'use strict';

const spawn = require('child_process').spawn;
const events = require('events');
const readline = require('readline');
const validator = require('validator');

class Process extends events.EventEmitter {
    constructor(command, args) {
        super();
        this.output = {
            destination:null,
            hops:[],
        };
        this.command = command;
        this.args = args;
    }

    trace(domainName) {
        if (!this.isValidDomainName(domainName)) {
            throw "Invalid domain name or IP address";
        }

        this.args.push(domainName);

        const process = spawn(this.command, this.args);
        process.on('close', (code) => {
            if(code == 0){
                this.emit('end',this.output)                
            }
            this.emit('close', code);
        });

        this.emit('pid', process.pid);

        let isDestinationCaptured = false;
        if (process.pid) {
            readline.createInterface({
                    input: process.stdout,
                    terminal: false
                })
                .on('line', (line) => {
                    if (!isDestinationCaptured) {
                        const destination = this.parseDestination(line);
                        if (destination !== null) {
                            this.output.destination = destination;
                            this.emit('destination', destination);

                            isDestinationCaptured = true;
                        }
                    }

                    const hop = this.parseHop(line);
                    if (hop !== null) {
                        this.output.hops.push(hop)
                        this.emit('hop', hop);
                    }
                });
        }
    }

    isValidDomainName(domainName) {
        return validator.isFQDN(domainName + '') || validator.isIP(domainName + '');
    }

    parseDestination(data) {}
    parseHop(hopData) {}
}

module.exports = Process;