/* REMEMBER MESSAGES BEFORE SUBMITTING */
var rememberPostMessage = function(thread){
  var value = encodeURIComponent($('textarea[name="message"]').val());
  if (value.length > 0){
    window.localStorage.setItem('humpinatorPostSaver-' + thread, value);
  } else {
    window.localStorage.removeItem('humpinatorPostSaver-' + thread);
    window.localStorage.removeItem('humpinatorPosted-' + thread);
  }
};

var restorePostMessage = function(thread){
  var savedpost = window.localStorage.getItem('humpinatorPostSaver-' + thread);

  if (savedpost){
    $('textarea[name="message"]').val(decodeURIComponent(savedpost)); // restore old message, if exists
  }
};

var matched = $('input[name="t"][type="hidden"]');

if (matched.length > 0){
  var thread_id = matched.val();

  $(document).on('keyup click', 'form[action="posting.php"] textarea[name="message"]', function() {
    rememberPostMessage(thread_id);
  });

  $(document).on('click', 'form[action="posting.php"] input[type="button"], form select', function() {
    rememberPostMessage(thread_id);
  });

  $(document).on('click', 'form[action="posting.php"] input[type="submit"]:not([value="Preview"])', function() {
    window.localStorage.setItem('humpinatorPosted-' + thread_id, '1');
  });
}

// Restore messages lost on refresh, etc.
console.log("ref:" + document.referrer);

if (matched.length > 0 && document.referrer.match(/viewtopic\.php/) === null && window.localStorage.getItem('humpinatorPosted-' + thread_id) === null){
  restorePostMessage(thread_id);
  rememberPostMessage(thread_id); // keep remembering until user posts the message. Survives multiple refreshes this way
} else if (matched.length > 0) {
    window.localStorage.removeItem('humpinatorPostSaver-' + thread_id);
    window.localStorage.removeItem('humpinatorPosted-' + thread_id);
}

/* FULL REPLY FORM */
if (getValue("fullReplyForm") === "true"){
  var form = $('form[name="qrform"]');
  if (form.length > 0){
    $.ajax("http://www.nfohump.com/forum/posting.php?mode=reply&t=" + form.find('input[type="hidden"][name="t"]').val(), {
      dataType: 'html',
      success: function(data, textStatus, jqXHR){
        var content = $('<div/>').append(data.replace("urchinTracker();", "")).find('form[name="post"]');
        content.find('table:first').remove(); // remove the additional breadcrumbs leftovers
        content.attr("id", "qrform");
        content.find("textarea").val(form.find("textarea").val()).attr("id", "msg");

        form.replaceWith(content);
        
        if (getValue("fullEmoticonSet") === "true"){
          var old_emoticons = content.find('table[cellpadding="5"]');
          var new_smilies = form.find(".smilies").addClass("humpinator-emoticon-set");
          old_emoticons.replaceWith(new_smilies);
        }        
      }
    });
  }
}

/* Prevent accidental spoiler openings */
if (getValue("confirmSpoiler") === "true"){
  $('img[src="templates/NFOrce8/images/icon_expand.gif"]').removeAttr('onclick');
  $(document).on('click', 'img[src="templates/NFOrce8/images/icon_expand.gif"], img[src="templates/NFOrce8/images/icon_collapse.gif"]', function(e){
    var btn = $(this);
    var opened = getValue("openedSpoilers");
    if (typeof(opened) !== "string"){
      opened = [];
    } else {
      opened = opened.split(",");
    }
    var spoiler = btn.closest('tbody').find('tr > td > div[id^="spoiler"]');

    var sid = spoiler.closest('.row2, .row1').find('table > tbody > tr > td > a[href^="viewtopic.php"]').attr('href').split("#")[1] + "_" + spoiler.attr("name").replace("spoiler", "");

    if (btn.attr('src') === "templates/NFOrce8/images/icon_expand.gif"){
      if (spoiler.hasClass("already-opened") || opened.indexOf(sid) != -1 || window.confirm("Do you really want to open this?")){
        btn.attr('src', 'templates/NFOrce8/images/icon_collapse.gif');
        spoiler.show().addClass("already-opened");
        if (opened.indexOf(sid) == -1){
          opened.push(sid);
        }
        setValue("openedSpoilers", opened.join(","));
        fitImages(spoiler.find('img[src^="http"]'), $(window).width(), imageBuffer);
      }
    } else {
      spoiler.hide();
      btn.attr('src', 'templates/NFOrce8/images/icon_expand.gif');
    }
  });
}


/* STYLE PAGINATION */
if (getValue("betterPagination") === "true"){
  $('a[href*=start]:contains(Previous):not(.maintitle), a[href*=start]:contains(Next):not(.maintitle)').parent().addClass("humpinator-pagination");
  $(".humpinator-pagination > a:contains('Previous')").css('font-weight', 'bold').text("« Previous");
  $(".humpinator-pagination > a:contains('Next')").css('font-weight', 'bold').text('Next »');
  $(".humpinator-pagination").contents().filter(function(){
    return this.nodeType == 3 && this.textContent === ", ";
  }).remove();
}

/* MAKE NEW POSTS ABSOLUTE PATH */
// TODO: Release later
/*
if (getValue("newspostsAbsolute") === "true"){
  var newposts = $('.row1').find('.topictitle').find('a').has('img[alt="View newest post"]');
  $(newposts).each(function(i, o){
    var threadurl = $(this).attr('href');
    console.log($(this).attr('href'), '->');
    (function(that, delaymult){ // closure to smuggle vars that disappear after every .each() loop for use in callbacks
      var delay = 1000 * delaymult; // spread out the page loads by 1s intervals
      setTimeout(function(){ // only fetch pages after a certain period, saving server from too much surprise sex
        $.get(threadurl, function(data, textStatus, jqXHR){
          var doc = $('<div/>').append(data.replace("urchinTracker();", ""));
          var newpostlink = $(doc).find('.row2').find('a').find('img[src="templates/NFOrce8/images/icon_minipost_new.gif"]').parent().first();
          if (newpostlink !== undefined && newpostlink.length !== 0 && $(newpostlink).attr('href') !== undefined){
            console.log('new post found: ' + $(that).attr('href') + ' -> ' + $(newpostlink).attr('href'));
            $(that).attr('href', $(newpostlink).attr('href'));
          } else {
            console.log('no new post found for ' + $(that).attr('href'));
          }
        });
      }, 1000 * 10 + delay);
    })(this, i); // this->that, i->delaymult
  });
}
*/

/* MISC */

/* Toggle checkboxes by clicking on labels */
$(document).on('click', 'td > span.gen', function(){
  $(this).parent().find('input[type="checkbox"]').trigger('click');
});

/* Inject required javascript into the page */
function injectjs(link){
  $('<script type="text/javascript" src="' + link + '"/>').appendTo($('head'));
}

if (typeof(chrome) !== "undefined"){
  injectjs(chrome.extension.getURL('inject_quick_reply.js'));
}