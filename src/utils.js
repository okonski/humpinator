/* value settings */

var getValue = function(k){
  return localStorage.getItem("humpinator-" + k);
};
var setValue = function(k,v){
  localStorage.setItem("humpinator-" + k, v);
};


var options = {

  "fullReplyForm": {
    "name": "Full reply form",
    "title": "Full reply form under the thread.",
    "value": true
  },
  "fullEmoticonSet": {
    "name": "All emoticons",
    "title": "All emoticons listed next to the form.",
    "value": false,
    "sub": true
  },
  "confirmSpoiler": {
    "name": "Confirm spoiler opens",
    "title": "Asks before opening spoilers. Remembers which spoilers were opened in the past and doesn't prompt twice.",
    "value": true
  },
  "betterPagination": {
    "name": "Pretty pagination",
    "title": "Bigger areas to click for page links and better style",
    "value": true
  }
  /*
  "newspostsAbsolute": {
    "name": "Absolute new post links",
    "title": "Resolve redirects to new posts so they cannot time out.",
    "value": true
  },
  */
};

var saveSettings = function(){
  for(var key in options) {
    setValue(key, options[key].value);
  }
};
if (!localStorage["humpinator-fitImages"]){
  saveSettings();
}

/* Function to scale images */
var fitImages = function(list, max_width, buffer){
  $.each(list, function(i,image){
    var img = $(image);
    var wrapper;
    if (img.width() + img.offset().left  >= max_width || (typeof img.data('originalWidth') != 'undefined' && img.data('originalWidth') != img.width())){
      if (!img.data('originalWidth')){
        img.attr('data-original-width',img.width());
        img.attr('data-original-height',img.height());
        wrapper = img.wrap($("<a class='humpinator-wrapper'/>")).parent();
        wrapper.prepend($("<span class='humpinator-label'/>").text('Resized from ' + img.data('originalWidth') + 'x' + img.data('originalHeight')));
      } else {
        wrapper = img.parent('a.humpinator-wrapper');
      }
      var new_width = max_width - img.offset().left - buffer;
      img.css('width',(new_width > img.data('originalWidth') ? img.data('originalWidth') : new_width));
      wrapper.attr('href',img.attr('src')).attr('target','_blank');
    }
  });
};

function scrollViewportTo(selector,time){
  $('html, body').animate({scrollTop: $(selector).offset().top}, time);
}


$.fn.selectRange = function(start, end) {
  return this.each(function() {
    if (this.setSelectionRange) {
      this.focus();
      this.setSelectionRange(start, end);
    } else if (this.createTextRange) {
      var range = this.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    }
  });
};