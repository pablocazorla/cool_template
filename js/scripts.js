// SCRIPTS
$('document').ready(function () {
  'use strict';

  var $window = $(window);


  // IMG WRAP
  var $imgWrap = $('.img-wrap'),
    resizeImgWrap = function () {
      $imgWrap.each(function () {
        var $this = $(this),
          $img = $this.find('>img'),
          modFrame = $this.width() / $this.height(),
          modImg = $img.width() / $img.height();

        if (modFrame < modImg) {
          $this.addClass('vertical');
        } else {
          $this.removeClass('vertical');
        }
      });
    };
  resizeImgWrap();
  $window.on('resize', resizeImgWrap);

  // SLIDER
  $('.slider').each(function () {
    var $slider = $(this),
      $frames = $slider.find('>.frame'),
      length = $frames.length;

    if (length > 0) {

      var current = 0;

      // ARROWS
      var $arrowLeft = $('<div class="arrow arrow-left"><i class="fa fa-chevron-left"></i></div>').appendTo($slider),
        $arrowRight = $('<div class="arrow arrow-right"><i class="fa fa-chevron-right"></i></div>').appendTo($slider);

        // DOTS
      var $sDots = $('<div class="slider-dots"/>').appendTo($slider);
      $frames.each(function(i){
        var $dot = $('<div class="dot" data-num="'+i+'"/>').appendTo($sDots);
      });

      var $dots = $sDots.find('.dot');

      $dots.eq(current).addClass('current');

      var moving = false,
        change = function (num, d) {
          if (!moving) {
            var dir = d || 1,
              next = num !== null ? num : current + dir;
            next = next < 0 ? length - 1 : next;
            next = next >= length ? 0 : next;

            if (next !== current) {
              moving = true;

              var gto = next > current ? -1 : 1;

              gto *= current === 0 && next !== 1 ? -1:1;
              gto *= next === 0 && current !== 1 ? -1:1;



              $frames.eq(next).css('left', (gto * -100) + '%');
             

              setTimeout(function () {
                $frames.eq(current).addClass('anim');
                $frames.eq(next).addClass('anim');
                $dots.eq(current).removeClass('current');
                $dots.eq(next).addClass('current');
                setTimeout(function () {
                  $frames.eq(current).css('left', (gto * 100) + '%');
                  $frames.eq(next).css('left', '0%');

                  setTimeout(function () {
                    $frames.eq(current).removeClass('anim');
                    $frames.eq(next).removeClass('anim');
                    
                    moving = false;
                    current = next;
                    
                  }, 800);

                }, 50);
              }, 50);
            }
          }
        };

      
      // UI
      $arrowLeft.on('click', function () {
        change(null, -1);
      });
      $arrowRight.on('click', function () {
        change(null, 1);
      });

      $dots.on('click', function () {
        var n = $(this).attr('data-num');
        change(parseInt(n,10));
      });
      

      setInterval(function(){
        change(null, 1);
      },10000);

    }
  });

});