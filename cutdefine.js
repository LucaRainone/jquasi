var cutter = require("./lib/define-cutter");
const fs = require('fs');
var content = fs.readFileSync("src/jquasi.js");
var res = cutter.defineCutter(content,{exportName:"$"});

process.stdout.write(res);