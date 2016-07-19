<<<<<<< HEAD
// $(document).ready(function () {
//   //SHOWING FULL MENU
//   $(".bt-menu-trigger").on('click', function(){
//   		console.log("Clicked");
//   	if( $('#root').css('margin', '0')) {
//   		console.log('margin 0');
//   	}
//       $("#root").css('margin', '30px 30px 30px 90px');
//   });

// });
=======
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
>>>>>>> origin/master
