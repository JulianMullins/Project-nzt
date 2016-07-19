$(document).ready(function () {
	
$(".bt-menu-trigger").on('click', function(){
  if($('#bt-menu').is('.bt-menu-open')){
      $("#root").css("margin", "30px 30px 30px 90px");
      $("#root").css("transition-duration", ".4s");
      // $('.map').css('margin', '');
    };

  if($('#bt-menu').is('.bt-menu-close')){
      $('#root').css('margin', '');
      $("#root").css("transition-duration", ".2s");
    };
 });
});