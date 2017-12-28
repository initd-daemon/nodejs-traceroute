'use strict';

const Traceroute = require('./promise');
Traceroute('github.com',0,80,'tcp').then(function (data){
    console.log(data)
})
