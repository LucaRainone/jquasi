var allDefs   = {};
var prefixVar         = "_rai"+Math.floor(Math.random()*9999)+"n1_";
var globalCounterVars = 0;
var exportName;


module.exports = {
    defineCutter: function(contents, opt) {
        if(!opt) opt = {};
        exportName = opt.exportName ? opt.exportName : null;
        (function(define) {
            global.define = define;
            eval("var define = "+define.toString()+";\n"+contents);
        })(function (name, deps, cbk) {

            allDefs[name] =
                {
                    name         : name,
                    deps         : deps,
                    cbk          : cbk,
                    compiledName : null,
                    defined      : false
                };

        });

        var strFuncDeps = [];
        namingReadyModules();
        while (true) {

            var defines     = [];
            var names       = [];
            var defineNames = [];
            for (var name in allDefs) {
                if (allDefs[name].compiledName && !allDefs[name].defined) {
                    defines.push(buildFunction(allDefs[name]));
                    names.push(allDefs[name].compiledName);
                    defineNames.push(name);

                }
            }

            if (defines.length === 0)
                break;


            strFuncDeps.push("(function(" + names.join(",") + "){(/*__MODULES__*/)})(" + defines.join(",") + ")");
            for (var i = 0; i < defineNames.length; i++) {
                allDefs[defineNames[i]].defined = true;
            }
            namingReadyModules();

        }
        var fnc;
        var output = "(/*__MODULES__*/)";
        while (fnc = strFuncDeps.shift()) {
            output = output.split("(/*__MODULES__*/)").join(fnc);
        }
        var exportCode = exportName? "global."+exportName+" = arguments[0]" : "";
        output = "!function(global) {"+output.split("(/*__MODULES__*/)").join(exportCode)+"}(this.exports || this);";

        return output;
    }
};


function buildFunction(def) {

    var fncString = def.cbk.toString();
    var nameArr = [];
    for (var i = 0; i < def.deps.length; i++) {
        nameArr.push(allDefs[def.deps[i]].compiledName);
    }
    var res = "(" + fncString + ")(" + nameArr.join(",") + ")";

    var compat = res.replace(/\s/g,'');

    // convert all '(function() { return ** })()' in '**'
    if(compat.substr(0,18) === '(function(){return' && compat.substr(-4) === "})()") {
        res = res.replace(/^\(function\s*\(\s*\)\s*{\s*return\s*/,'').replace(/}\s*\)\s*\(\s*\)\s*$/,'');
    }
    return res;
}


function namingReadyModules() {
    for (var name in allDefs) {
        if (allDefs[name].compiledName) continue;
        var isReady = true;
        for (var i = 0; i < allDefs[name].deps.length; i++) {
            if (!allDefs[allDefs[name].deps[i]].defined) {
                isReady = false;
            }
        }
        if (isReady) {
            allDefs[name].compiledName = prefixVar + (globalCounterVars++);
        }
    }
}
