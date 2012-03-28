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
});

// fit images once spoiler is opened
$('td.postRow img[src="templates/NFOrce8/images/icon_expand.gif"]').on('click',function(){
  fitImages($('td.postRow div[name^="spoiler"] img[src^="http"]'), $(window).width(),buffer);
});