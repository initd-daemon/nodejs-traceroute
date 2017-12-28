const Traceroute = require('./index');
module.exports = function traceroute(domainName,sendwait,port,proto){
    return new Promise(function(resolve, reject){
        let trace = new Traceroute(sendwait,port,proto)
        trace.on('end',(output)=>{
            resolve(output)
        })
        trace.on('close',(code)=>{
            if(code !== 0){
                reject()
            }
        })
        trace.trace(domainName)
    })
}