var cookieAd = function () {
  'use strict';

  // Utils
  var setCookie = function (name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    getCookie = function (name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    };


  var cookieName = 'unrialAcceptCookies',
    c = getCookie(cookieName);

  if (!c) {
    var $ad = $('<div class="cookie-ad"><div class="ca-col ca-col-text">Usamos cookies para mejorar tu experiencia y realizar tareas de analítica.</div></div>').appendTo('body'),
      $col = $('<div class="ca-col"/>').appendTo($ad),
      $btn = $('<div class="btn btn-primary">Aceptar</div>').appendTo($col);

    $btn.click(function () {
      setCookie(cookieName, 'true', 365);
      $ad.fadeOut(200);
    });
  }

  /*

  <div class="cookie-ad">
    <div class="ca-col ca-col-text">
      Usamos cookies para mejorar tu experiencia y realizar tareas de analítica.
    </div>
    <div class="ca-col">
      <div class="btn btn-primary">Aceptar</div>
    </div>
  </div>
      
  */
};