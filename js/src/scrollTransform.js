;
(function () {
  'use strict';

  var cl_change = 'modified',
    cl_not_change = 'not-modified',
    ie = (function () {
      var undef, rv = -1; // Return value assumes failure.
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      var trident = ua.indexOf('Trident/');

      if (msie > 0) {
        // IE 10 or older => return version number
        rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      } else if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rvNum = ua.indexOf('rv:');
        rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
      }

      return ((rv > -1) ? rv : undef);
    }()),
    started = false,
    docElem = window.document.documentElement,
    scrollVal,
    noscroll,
    isAnimating,
    isRevealed,
    forced = false,
    $container = $(''),

    preventDefault = function (e) {
      e = e || window.event;
      if (e.preventDefault)
        e.preventDefault();
      e.returnValue = false;
    },

    disable_scroll = function () {
      window.onmousewheel = document.onmousewheel;
      document.onkeydown = function (e) {
        var keys = [32, 37, 38, 39, 40];
        for (var i = keys.length; i--;) {
          if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
          }
        }
      };
      document.body.ontouchmove = function (e) {
        preventDefault(e);
      };
    },
    enable_scroll = function () {
      window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
    },

    toggle = function (reveal) {
      isAnimating = true;

      if (reveal) {
        $container.addClass(cl_change);
        $container.removeClass(cl_not_change);
      } else {
        noscroll = true;
        disable_scroll();
        $container.removeClass(cl_change);
        $container.addClass(cl_not_change);
      }

      // simulating the end of the transition:
      setTimeout(function () {
        isRevealed = !isRevealed;
        isAnimating = false;
        if (reveal) {
          noscroll = false;
          enable_scroll();
        }
      }, 600);
    },

    scrollY = function () {
      return window.pageYOffset || docElem.scrollTop;
    },
    scrollPage = function () {
      if(!forced){
        scrollVal = scrollY();

        if (noscroll && !ie) {
          if (scrollVal < 0) return false;
          // keep it that way
          window.scrollTo(0, 0);
        }
  
        if (isAnimating) {
          return false;
        }
  
        if (scrollVal <= 0 && isRevealed) {
          toggle(false);
        } else if (scrollVal > 0 && !isRevealed) {
          toggle(true);
        }
      }      
    };
  
  
  


  window.ScrollTransform = function (elem) {
    $container = $(elem);

    var pageScroll = scrollY();
    noscroll = pageScroll === 0;

    disable_scroll();

    if (pageScroll) {
      isRevealed = true;
      $container.addClass(cl_change);
      $container.removeClass(cl_not_change);
    }

    if(!started){
      window.addEventListener('scroll', scrollPage);
      started = true;
    }
    return {
      force: function(){
        isRevealed = true;
        noscroll = false;
        forced = true;
        $container.addClass(cl_change);
        $container.removeClass(cl_not_change);
      },
      down: function(){
        toggle(true);
      }
    }
  }


})();