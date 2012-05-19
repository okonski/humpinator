/**
 * @author christophe
 */
"use strict";
const Trait = require("traits").Trait;
const self = require("self");
const Services = require("utils-sf/services");
const Logger = require("utils-sf/logger").Logger;
const validateOptions = require("api-utils").validateOptions;

const xpcom = require("xpcom");
const chrome = require("chrome")
const Ci = chrome.Ci;
const Cc = chrome.Cc;



exports.registerAbout = function(name, redirection){
    if (typeof name != "string") {
        throw new Error("arguments[0] must be a string");
    }
    if (typeof redirection != "string") {
        throw new Error("arguments[1] must be a string");
    }
    var contractID = "@mozilla.org/network/protocol/about;1?what=" + name;
    if (!(contractID in Cc)) {
        var create = function(){
        }
        create.prototype = {
            newChannel: function(uri){
				//console.log("about",uri)
                var channel = Services.io.newChannel(redirection, null, null);
				//console.log("channel",channel)
                channel.originalURI = uri;
                return channel;
            },
            getURIFlags: function(uri){
                return Ci.nsIAboutModule.ALLOW_SCRIPT;
                //return Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT;
            },
            QueryInterface: xpcom.utils.generateQI([Ci.nsIAboutModule])
        }
        
        var factory = xpcom.register({
            contractID: contractID,
            name: "about:" + name + " protocol",
            create: create
        });
        factory._unregister = factory._unregister || factory.unregister;
        factory.unregister = function(){
        }
    }
}


exports.register = function(name, options){
	if (typeof name != "string") {
		throw new Error("arguments[0] must be a string : " + name);
	}
	
	validateOptions(options, {
		defaultPort: {
			is: ["undefined", "number"]
		},
		allowPort: {
			is: ["undefined", "function"]
		},
		newURI: {
			is: ["undefined", "function"]
		},
		newChannel: {
			is: ["undefined", "function"]
		}
	});
	
	var contractID = "@mozilla.org/network/protocol;1?name=" + name;
	if (!(contractID in Cc)) {
		var create = function(){
		}
		create.prototype = {
			defaultPort: options.defaultPort || -1,
			protocolFlags: Ci.nsIProtocolHandler.URI_STD | Ci.nsIProtocolHandler.URI_LOADABLE_BY_ANYONE,
			allowPort: options.allowPort ||
			function(port, scheme){
				return false;
			},
			newURI: options.newURI ||
			function(spec, charset, baseURI){//chrome-extension://jetid/ie.html#http%3A bug !!
				var uri = Cc["@mozilla.org/network/standard-url;1"].createInstance(Ci.nsIStandardURL);
				uri.init(Ci.nsIStandardURL.URLTYPE_STANDARD, this.defaultPort, spec, charset, baseURI);
				uri.QueryInterface(Ci.nsIURI);
				return uri;
			},
			newChannel: options.newChannel ||
			function(){
				return Services.io.newChannel("data:text/plain,not%20implemented", null, null);
			},
			QueryInterface: xpcom.utils.generateQI([Ci.nsISupports, Ci.nsIProtocolHandler])
		}
		
		var factory = xpcom.register({
			contractID: contractID,
			name: name + " protocol",
			create: create
		});
		factory.unregister = function(){
		}
	}	
}
