$(document).ready(function () {
  //SHOWING FULL MENU
  // if($('#bt-menu').is('.bt-menu', '.bt-menu-open')){
  //     $("#root").css("margin", "30px 30px 30px 90px");
  //   };
  //
  // if($('#bt-menu').is('.bt-menu', '.bt-menu-close')){
  //     $("#root").css("margin", "0");
  //   };


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
