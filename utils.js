/* value settings */
var getValue = function(k){
  return localStorage.getItem("humpinator-" + k);
};
var setValue = function(k,v){
  localStorage.setItem("humpinator-" + k, v);
};


var options = {
  "fitImages": {
    "name": "Fit images on screen",
    "value": true
  },
  "fullReplyForm": {
    "name": "Full reply form",
    "value": true
  },
  "instantQuotes": {
    "name": "Instant quotes",
    "value": true
  }
};
var saveSettings = function(){
  for(var key in options) {
    setValue(key, "true");
  }
};
if (!localStorage["humpinator-fitImages"]){
  console.log("initial");
  saveSettings();
}

/* Function to scale images */
var fitImages = function(list, max_width, buffer){
  list.each(function(i,image){
    var img = $(image);
    var wrapper;
    if (img.width() + img.offset().left  >= max_width || (typeof img.data('originalWidth') != 'undefined' && img.data('originalWidth') + img.offset().left >= max_width)){
      if (!img.data('originalWidth')){
        img.attr('data-original-width',img.width());
        img.attr('data-original-height',img.height());
        wrapper = img.wrap($("<a class='humpinator-wrapper'/>")).parent();
        wrapper.prepend($("<span class='humpinator-label'/>").text('Resized from ' + img.data('originalWidth') + 'x' + img.data('originalHeight')));
      } else {
        wrapper = img.parent('a.humpinator-wrapper');
      }
      img.css('width',max_width - img.offset().left - buffer);
      wrapper.attr('href',img.attr('src')).attr('target','_blank');
    }
  });
};
/* Inject required javascript into the page */
function injectjs(link) {
  $('<script type="text/javascript" src="'+link+'"/>').appendTo($('head'));
}

injectjs(chrome.extension.getURL('inject_quick_reply.js'));