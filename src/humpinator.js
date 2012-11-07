/* IMAGE RESIZING */
var imageBuffer = 50;
if (getValue("fitImages") === "true"){

  var max_width = $(window).width();
  var selector = 'td.postRow img[src^="http"]';
  var dfd = $(selector).imagesLoaded();

  dfd.progress(function(isBroken, $images, $proper, $broken){
    fitImages($proper.filter('img:not([data-original-width])'), max_width, imageBuffer);
  });

  $(document).on('mouseenter mouseleave', 'a.humpinator-wrapper', function(e){
    var img = $(this).find('img');
    if (img.width() != img.data("originalWidth")){
      $(this).find('span.humpinator-label').animate({top: (e.type == 'mouseenter' ? 0 : -60)}, 100);
    }
  });

  $(window).on('resize',function(){
    //alert($(window).width());
    fitImages($(selector), $(window).width(), imageBuffer);
  }).trigger('resize');

  // fit images once spoiler is opened
  $('td.postRow img[src="templates/NFOrce8/images/icon_expand.gif"]').on('click', function(){
    fitImages($('td.postRow div[name^="spoiler"] img[src^="http"]'), $(window).width(), imageBuffer);
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
          var content = $('<div/>').append(data.replace("urchinTracker();", "")).find("table.forumline table[width='100']");
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
fullEmoticonSet();

/* INSTANT POST REDIRECT */
if (getValue("instantRedirect") === "true"){
  var instantRedirect = function(){
    $('form[name="qrform"] input[value="Post Reply"], form[name="post"] input[value="Submit"]').attr('data-disable-with', "Wait...");
    $('form[name="qrform"], form[name="post"]').attr('data-remote', true).attr('data-type', "text");
    $('form[name="post"] input[value="Preview"]').on('click', function(){
      $(this).closest('form').removeAttr('data-remote');
    });
  };

  instantRedirect();
  $(document).on('ajax:success', 'form[name="post"], form[name="qrform"]', function(e, data){
    var content = $('<div/>').html(data.replace("urchinTracker();", "")).find("td > span > a[href^='viewtopic']:contains('Here')");
    if (content.length > 0){
      window.location.href = "http://www.nfohump.com/forum/" + content.attr('href');
    } else {
      window.location.reload();
    }
  });
}
/* REMEMBER MESSAGES BEFORE SUBMITTING */
var rememberPostMessage = function(){
  window.sessionStorage.setItem('humpinatorPostSaver', encodeURIComponent($('textarea[name="message"]').val()));
};

var restorePostMessage = function(){
  var savedpost = window.sessionStorage.getItem('humpinatorPostSaver');
  if (savedpost){
    $('textarea[name="message"]').val(decodeURIComponent(savedpost)); // restore old message, if exists
    window.sessionStorage.removeItem('humpinatorPostSaver'); // and remove it so it doesn't linger
  }
};
$(document).on('click', 'form input[type="submit"]', rememberPostMessage);

/* FULL REPLY FORM */
if (getValue("fullReplyForm") === "true"){
  var form = $('form[name="qrform"]');
  if (form.length > 0){
    $.ajax("http://www.nfohump.com/forum/posting.php?mode=reply&t=" + form.find('input[type="hidden"][name="t"]').val(), {
      dataType: 'html',
      success: function(data, textStatus, jqXHR){
        var content = $('<div/>').append(data.replace("urchinTracker();", "")).find('form[name="post"]');
        content.find('table:first').remove(); // remove the additional breadcrumbs leftovers
        form.replaceWith(content);
        // Ajax posting for full reply form
        fullEmoticonSet();
        if (getValue("instantRedirect") === "true"){
          instantRedirect();
        } else {
          restorePostMessage();
        }
      }
    });
  }
}

/* INSTANT QUOTING */
if (getValue("instantQuotes") === "true"){
  $(document).on('click', 'div.forumbutton > ul#navlist > li > a[href^="posting.php?mode=quote"]', function(){
    var button = $(this).hide();
    $.ajax($(this).attr('href'), {
      dataType: 'text',
      success: function(data, textStatus, jqXHR){
        var textarea = $(document).find('textarea[name="message"]');
        var current_value = textarea.val();
        var content = $('<div/>').append(data.replace("urchinTracker();", "")).find('textarea[name="message"]');
        textarea.val(current_value + (current_value.length == 0 ? "" : "\n") + content.val());
        if (getValue("scrollAfterQuote") === "true"){
          scrollViewportTo(textarea, 100);
        }
        button.show();
      }
    });
    return false;
  });
}

/* Clicking on nicks inserts @nickname in reply form */
if (getValue("mentionNicks") === "true"){
  $(document).on('click', 'div[id="userprofile"] > span.nav > b',function(){
    console.log($(this).text());
    var mention, textarea, value;
    mention = "[b]@" + $(this).text() + "[/b]: ";
    textarea = $('form[name="qrform"] textarea, form[name="post"] textarea');
    value = textarea.val();
    if (value.length === 0){
      mention = mention + "\n";
    } else {
      mention = value + "\n\n" + mention + "\n";
    }
    textarea.val(mention);
    textarea.focus().selectRange(mention.length + value.length + 1, mention.length + value.length + 1);
  }).on('hover', 'div[id="userprofile"] > span.nav > b', function(){
      $(this).css('cursor', 'pointer');
    });
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
        console.log("click 3");
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
  $("div.forumline td.topSpaceRow[align='right'], td.bodyline > form > table > tbody > tr:eq(1) > td[align='right']").addClass("pagination");
  $("div.forumline").next('table').find("td[align='right']").addClass("pagination");
  $("td.pagination > span.gensmall > a:contains('Previous')").css('font-weight', 'bold').text("« Previous");
  $("td.pagination > span.gensmall > a:contains('Next')").css('font-weight', 'bold').text('Next »');
  $("td.pagination > span.gensmall").contents().filter(function(){
    return this.nodeType == 3 && this.textContent === ", ";
  }).remove();
}

/* EMBED YOUTUBE LINKS */
if (getValue("embedYoutube") === "true"){
  $('a').each(function(i, o){
    var videoid = false;
    if ($(this).attr('href') === undefined){
      return;
    }
    if ($(this).attr('href').toLowerCase().indexOf('www.youtube.') !== -1 && $(this).attr('href').toLowerCase().indexOf('/watch?') !== -1){
      videoid = $(this).attr('href').split('?')[1]; // only params
      videoid = videoid.split('#')[0]; // discard hash
      videoid = videoid.split('&'); // split params
      videoid.forEach(function(o, i){ // find videoid
        var sp = o.split('=');
        if (sp[0] === 'v'){ // we found v=?? param, so we have our guy
          videoid = sp[1];
          return false;
        }
        return true;
      });
    } else if ($(this).attr('href').toLowerCase().indexOf('youtu.be') !== -1){
      videoid = $(this).attr('href').split('?')[0]; // only before params
      videoid = videoid.split('/');
      videoid = videoid[videoid.length - 1]; // only last url bit
    }
    if (videoid !== false){
      var embedstring;
      if (getValue("embedYoutubeNewstyle") === "true"){
        embedstring = '<br/><iframe width="640" height="360" src="http://www.youtube.com/embed/' + videoid + '" frameborder="0" allowfullscreen></iframe><br/>';
      } else {
        embedstring = '<br/><object width="640" height="360"><param name="movie" value="http://www.youtube.com/v/' + videoid + '?version=3&amp;hl=en_GB"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/' + videoid + '?version=3&amp;hl=en_GB" type="application/x-shockwave-flash" width="640" height="360" allowscriptaccess="always" allowfullscreen="true"></embed></object><br/>';
      }
      if (getValue("embedYoutubeButtons") === "true"){
        (function(that, embedstring){
          var youtubebutton = $('<button>').html('embed').css('padding', '0').click(function(){
            $(this).replaceWith(embedstring);
          });
          $(that).after(youtubebutton);
        })(this, embedstring);
      } else {
        $(this).after(embedstring);
      }
    }
  });
}
/* MAKE NEW POSTS ABSOLUTE PATH */
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
          //var newpostlink = $(doc).find('.row2').find('a').find('img[src="templates/NFOrce8/images/icon_minipost_new.gif"]').parent().first();
          var newpostlink = $(doc).find('.bodyline').find('.gensmall a');
          if (newpostlink !== undefined  && $(newpostlink).attr('href') !== undefined){
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
if (getValue("newspostsAbsolute") === "true"){
  var newposts = $('.row1').find('.topictitle').find('a').has('img[alt="View newest post"]');
  $(newposts).each(function(i, o){
    var threadurl = $(this).attr('href');
    (function(that, delaymult){ // closure to smuggle vars that disappear after every .each() loop for use in callbacks
      var delay = 2000 * delaymult; // spread out the page loads by 2s intervals
      setTimeout(function(){ // only fetch pages after a certain period, saving server from too much surprise sex
        console.log($(that).attr('href'), '->');
        var threadid=$(that).attr('href').split('?')[1].split('&');
        threadid.forEach(function(o, i){ // find videoid
          var sp = o.split('=');
          if (sp[0] === 't'){ // we has thread
            threadid = sp[1];
            return false;
          }
          return true;
        });
        var searchvars={
          'search_keywords':'a b c d e f g h i j k l m n o p q r s t u v w x y z',
          'search_terms':'any',
          'sort_by':0,
          'sort_dir':'DESC',
          'show_results':'posts',
          'return_chars':1,
          't':threadid
        };
        $.post('http://www.nfohump.com/forum/search.php',searchvars, function(data, textStatus, jqXHR){
          var doc = $('<div/>').append(data.replace("urchinTracker();", ""));
          var newpostlink = $(doc).find('img[src="templates/NFOrce8/images/icon_minipost_new.gif"]').parent().find('a').not('.postdetails').last();
          // TODO: add further search if newpostlink.length===50
          if (newpostlink !== undefined  && $(newpostlink).attr('href') !== undefined){
            console.log('new post found: ' + $(that).attr('href') + ' -> ' + $(newpostlink).attr('href'));
            $(that).attr('href', $(newpostlink).attr('href'));
          } else {
            console.log('no new post found for ' + $(that).attr('href'));
          }
        });
      }, 1000 * 20 + delay);
    })(this, i); // this->that, i->delaymult
  });
}

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