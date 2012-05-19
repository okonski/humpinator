/* Draw settings menu */
var leftcolumn = $('#leftdiv');
var menu = $('<div class="menuLeftContainer humpinator-menu" style="display: none"><ul class="menuLeftList humpinator-options"/></div>').find(".menuLeftList");
for(var key in options) {
  var checkbox = $('<li title="' + options[key].title + '"><input type="checkbox" name="' + key + '"/><a href="javascript:void(0);">' + options[key].name + '</a></li>');
  if (options[key].sub){
    checkbox.addClass("sub");
  }
  if (getValue(key) === "true"){
    checkbox.find('input').prop('checked',true);
  }
  menu.append(checkbox);
}

leftcolumn.append('<div class="humpinator-menu" style="display: none" id="menuLeftHeader3"/>');
leftcolumn.append(menu.parent());
leftcolumn.append('<div class="humpinator-menu menuLeftFooter" style="display: none"/>');

$(document).on('change','ul.humpinator-options li input',function(){
  var key = $(this).attr('name');
  var bool = $(this).is(":checked");
  setValue(key,bool);
  window.location.reload();
});

$(document).on('click','ul.humpinator-options li a',function(){
  $(this).parent().find('input').trigger('click');
});

$(document).on('mouseenter', '#leftdiv', function () {
  $(this).find('.humpinator-menu').slideDown(100);
}).on('mouseleave', '#leftdiv', function () {
  $(this).find('.humpinator-menu').slideUp(100);
});