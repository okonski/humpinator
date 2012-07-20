self.on("message", function(addonMessage) {
  console.log(addonMessage);
  $('<script type="text/javascript" src="'+addonMessage+'"/>').appendTo($('head'));
});