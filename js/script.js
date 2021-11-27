$(window).scroll(function(){
  var wScroll = $(this).scrollTop();
  

  if(wScroll > $('#skills').offset().top() - 200){
    $('.to-up').addClass('muncul');
  }

});