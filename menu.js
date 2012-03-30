/* Draw settings menu */
var leftcolumn = $('#leftdiv');
var menu = $('<div class="menuLeftContainer"><ul class="menuLeftList humpinator-options"/></div>').find(".menuLeftList");
for(var key in options) {
  var checkbox = $('<li><input type="checkbox" name="' + key + '"/><a href="javascript:void(0);">' + options[key].name + '</a></li>');
  if (getValue(key) === "true"){
    checkbox.find('input').prop('checked',true);
  }
  menu.append(checkbox);
}

leftcolumn.append('<div id="menuLeftHeader3"/>');
leftcolumn.append(menu.parent());
leftcolumn.append('<div class="menuLeftFooter"/>');

$(document).on('change','ul.humpinator-options > li > input',function(){
  var key = $(this).attr('name');
  var bool = $(this).is(":checked");
  setValue(key,bool);
  location.reload();
});

$(document).on('click','ul.humpinator-options > li > a',function(){
  $(this).parent().find('input').trigger('click');
});