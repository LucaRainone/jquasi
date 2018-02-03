var cutter = require("./lib/define-cutter");
const fs = require('fs');
const content = fs.readFileSync("src/jquasi.js");
const res = cutter.defineCutter(content,{exportName:"$"});

const banner = "/** @license jquasi (c) https://github.com/LucaRainone/jquasi*/";
process.stdout.write(banner+"\n"+res);