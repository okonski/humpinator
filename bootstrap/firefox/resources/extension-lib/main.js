"use strict";
exports.main = function(options, callbacks){
    function start(){
        var extension = require("jetchrome").Extension({
            id: options.jetpackID,
            resource: options.packageData["extension"]
        });
        var engine = require("jetchrome").Engine(extension, options.staticArgs);
    };
    var load = start;
    
    load();
    if (options.staticArgs.quitWhenDone) 
        callbacks.quit();
};
