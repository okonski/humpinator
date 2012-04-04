/* IMAGE RESIZING */
if (getValue("fitImages") === "true"){
  var buffer = 50;
  var max_width = $(window).width();
  var selector = 'td.postRow img[src^="http"]';
  var dfd = $(selector).imagesLoaded();

  dfd.progress(function( isBroken, $images, $proper, $broken ){
    fitImages($proper.filter('img:not([data-original-width])'),max_width, buffer);
  });

  $(document).on('mouseenter mouseleave','a.humpinator-wrapper',function(e){
    $(this).find('span.humpinator-label').animate({top: (e.type == 'mouseenter' ? 0 : -60)},100);
  });

  $(window).on('resize',function(){
    fitImages($(selector), $(window).width(), buffer);
  }).trigger('resize');

  // fit images once spoiler is opened
  $('td.postRow img[src="templates/NFOrce8/images/icon_expand.gif"]').on('click',function(){
    fitImages($('td.postRow div[name^="spoiler"] img[src^="http"]'), $(window).width(),buffer);
  });
}
/* Full emoticon set on the page */
var fullEmoticonSet = function(){
  if (getValue("fullEmoticonSet") === "true"){
    var emoticons = $('form[action="posting.php"] table[cellpadding="5"]');
    var table = $('<div class="humpinator-emoticon-set"/>');
    var cache = getValue("emoticonCache");
    if (typeof cache !== "string"){
      $.ajax("http://www.nfohump.com/forum/posting.php?mode=smilies", {
        dataType: 'text',
        success: function(data, textStatus, jqXHR){
          var content = $('<div/>').append(data.replace("urchinTracker();","")).find("table.forumline table[width='100']");
          content.removeAttr('width');
          content.find("a[href^='javascript:emoticon']").each(function(){
            table.append($(this));
          });
          emoticons.replaceWith(table);
          setValue("emoticonCache", table.html());
        }
      });
    } else {
      table.html(cache);
      emoticons.replaceWith(table);
    }
  }
};

/* FULL REPLY FORM */
if (getValue("fullReplyForm") === "true"){
  var form = $('form[name="qrform"]');
  $.ajax("http://www.nfohump.com/forum/posting.php?mode=reply&t="+form.find('input[type="hidden"][name="t"]').val(), {
    dataType: 'text',
    success: function(data, textStatus, jqXHR){
      var content = $('<div/>').append(data.replace("urchinTracker();","")).find('form[name="post"]');
      content.find('table:first').remove(); // remove the additional breadcrumbs leftovers
      form.replaceWith(content);
      fullEmoticonSet();
    }
  });
}

/* INSTANT QUOTING */
if (getValue("instantQuotes") === "true"){
  $(document).on('click','div.forumbutton > ul#navlist > li > a[href^="posting.php?mode=quote"]',function(){
    var button = $(this).hide();
    $.ajax($(this).attr('href'), {
      dataType: 'text',
      success: function(data, textStatus, jqXHR){
        var textarea = $(document).find('textarea[name="message"]');
        var current_value = textarea.val();
        var content = $('<div/>').append(data.replace("urchinTracker();","")).find('textarea[name="message"]');
        textarea.val(current_value + (current_value.length == 0 ? "" : "\n") + content.val());
        if (getValue("scrollAfterQuote") === "true"){
          scrollViewportTo(textarea,100);
        }
        button.show();
      }
    });
    return false;
  });
}

/* Toggle checkboxes by clicking on labels */
$(document).on('click', 'td > span.gen',function(){
  $(this).parent().find('input[type="checkbox"]').trigger('click');
});
/* Inject required javascript into the page */
function injectjs(link) {
  $('<script type="text/javascript" src="'+link+'"/>').appendTo($('head'));
}

injectjs(chrome.extension.getURL('inject_quick_reply.js'));