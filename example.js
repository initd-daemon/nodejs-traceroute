'use strict';

const Traceroute = require('./index');

try {
    const tracer = new Traceroute(0,80,'tcp');
    tracer
        .on('pid', (pid) => {
            console.log(`pid: ${pid}`);
        })
        .on('destination', (destination) => {
            console.log(`destination: ${destination}`);
        })
        .on('hop', (hop) => {
            console.log(`hop: ${JSON.stringify(hop)}`);
        })
        .on('close', (code) => {
            console.log(`close: code ${code}`);
        })
        .on('end',(output)=>{
            console.log(output)
        })

    tracer.trace('42.33.53.23');
} catch (ex) {
    console.log(ex);
}