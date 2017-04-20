var cookies = document.cookie.split(';');
cookies.forEach(function(cookie){
  $('<li>').text(cookie).appendTo('#cookie-list');
});
