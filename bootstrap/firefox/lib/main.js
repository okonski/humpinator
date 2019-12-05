var data = require("self").data;

var pageMod = require("page-mod");
console.log("humpinator init");

pageMod.PageMod({
  include: ["https://www.nfohump.com/forum/index.php","https://www.nfohump.com/forum/viewforum.php*", "https://www.nfohump.com/forum/viewtopic.php*","https://www.nfohump.com/forum/posting.php?mode=reply*", "https://www.nfohump.com/forum/posting.php"],
  contentScriptWhen: 'end',
  contentStyleFile: data.url("css/humpinator.css"),
  contentScriptFile: [
    data.url("jquery.min.js"),
    data.url("jquery.imagesloaded.min.js"),
    data.url("utils.js"),
    data.url("menu.js"),
    data.url("humpinator.js"),
    data.url("compatibility.js")
  ],
  onAttach: function(worker) {
    worker.postMessage(data.url("inject_quick_reply.js"));
  }
});