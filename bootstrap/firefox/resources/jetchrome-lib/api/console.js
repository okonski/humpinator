"use strict";exports.inject=function(c,b,a){["log","info","debug","warn","error","dir","time","timeEnd"].forEach(function(d){if(d in console){a.console[d]=console[d]}})};