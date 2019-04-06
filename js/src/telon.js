var Telon = function (rsz) {
  "use strict";

  var rec_size = rsz || 40;

  // Random number utility
  var rand = function (min, max) {
    if (min == null && max == null)
      return 0;
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // Store
  var $telon = $('#telon'),
    $wrap = $('#wrap').addClass('overflow'),
    canvas = document.getElementById('canvas-telon'),
    ctx = canvas.getContext("2d"),

    // Variables
    width = $telon.width(),
    height = $telon.height(),    
    color = '#FFFFFF',
    delay = 30,
    randomDelay = 160,
    timeFPS = 60,
    timerRender = null;

  // set canvas size
  canvas.width = width;
  canvas.height = height;

  // Rectangle object
  var Rectangle = function (opt) {
    var x = opt.x,
      y = opt.y,
      opacity = 10,
      o = {
        callback: null,
        delay: rand(0, randomDelay)
      };
    o.render = function () {
      ctx.globalAlpha = 1;
      o.delay -= timeFPS;
      if (o.delay <= 0) {
        opacity -= 1;
        if (opacity === 0 && o.callback) {
          o.callback();
        }
      }
      if (opacity > 0) {
        if (opacity < 10) {
          ctx.globalAlpha = (opacity + rand(-1, 1)) / 10;
        }
        ctx.fillRect(x, y - 0 * (10 - opacity), rec_size, rec_size);
      }
    };
    return o;
  };

  // Create all Rectangles
  var list = [],
    row_num = 0,
    x_pos = 0,
    y_pos = 0;

  while (y_pos < height) {
    var newRectangle = Rectangle({
      x: x_pos,
      y: y_pos
    });

    // delay depends from the row position
    newRectangle.delay += (row_num + 3) * delay;
    list.push(newRectangle);

    // set new position
    x_pos += rec_size;
    if (x_pos > width) {
      x_pos = 0;
      row_num++;
      y_pos += rec_size;
    }
  };

  ctx.fillStyle = color;

  // render function
  var renderAll = function () {
    ctx.clearRect(0, 0, width, height);
    list.forEach(function (R) {
      R.render();
    });
  };

  // set callback to last rectangle
  list[list.length - 1].callback = function () {
    setTimeout(function () {
      if (timerRender) {
        clearInterval(timerRender);
        timerRender = null;
      };
      $telon.hide();
    }, 2 * timeFPS);
  };

  // Render
  renderAll();

  // Loading
  $telon.addClass('loading');

  // set load event
  $(window).on("load", function () {
    $telon.removeClass('loading');
    $telon.addClass('loaded');
    $wrap.removeClass('overflow');
    timerRender = setInterval(function () {
      renderAll();
    }, timeFPS);
  });

  // Set event when unload the page
  window.addEventListener("beforeunload", function (event) {
    $('#telon-exit').addClass('shown');
  });
};