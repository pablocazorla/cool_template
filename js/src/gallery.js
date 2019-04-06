var UnrialGallery = function () {
  "use strict";

  // UTILS *************************************
  var round = function (num) {
      return Math.round(num);
    },
    randomNum = (function () {
      var dat = new Date();
      return dat.getTime();
    })();
  // END UTILS *********************************

  // HTML *************************************
  var $Gallery = $('<div class="unrial-gallery"/>'),
    $close = $('<div class="ug-close"><i class="fa fa-times"></i></div>').appendTo($Gallery),
    $pad = $('<div class="ug-pad"><i class="fa fa-cog fa-spin fa-2x fa-fw ug-loading"></i></div>').appendTo($Gallery),
    $ugpCont = $('<div class="ugp-content"/>').appendTo($pad),
    $pinterest = $('<a data-pin-do="buttonPin" href="https://www.pinterest.com/pin/create/button/?url=aaaa"></a>').appendTo($ugpCont),
    $img = $('<img src="" alt=""/>').appendTo($ugpCont),
    $ugpLabel = $('<div class="ugp-label"/>').appendTo($pad),
    $label = $('<div class="ugp-label-cont"/>').appendTo($ugpLabel),
    $carousel = $('<div class="ug-carousel"/>').appendTo($Gallery),
    $wrap = $('<div class="ugc-wrap"/>').appendTo($carousel),
    $wrapContent = $('<div class="ugc-content"/>').appendTo($wrap),
    $btnLeft = $('<div class="ugc-btn ugc-btn-left"><i class="fa fa-chevron-left"></i></div>').appendTo($wrapContent),
    $btnRight = $('<div class="ugc-btn ugc-btn-right"><i class="fa fa-chevron-right"></i></div>').appendTo($wrapContent),
    $carr = $('<div class="ugc-scroller"/>').appendTo($wrapContent),
    $scroller = $('<div class="ugc-scroller-content"/>').appendTo($carr);

  $Gallery.appendTo('body');
  var $clone = $('<img src="" alt="" id="ug-clone-img"/>').appendTo('body');
  // END HTML *********************************

  // VARIABLES *************************************
  var currentScrolled = 0,
    currentLeft = 0,
    scrollered = false,
    firstItemWidth = 0,
    bLeftDisabled = false,
    bRightDisabled = false,
    length = 0,
    loadingItem = false,
    activatedGallery = false;
  // END VARIABLES *********************************

  // LOAD IMAGE *************************************
  var loadImage = function (opt, callback) {
    $pad.removeClass("loaded");
    var imgDummy = new Image();
    imgDummy.onload = function () {
      $img.attr({
        src: opt.src + "?" + randomNum,
        alt: opt.text
      });
      $pad.addClass("loaded");
      $label.text(opt.text);

      // Pinterest

      var pinImage = window.location.href + '&media=' + opt.src + '&description=' + opt.text;


      var pinImageUrl = 'https://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(pinImage);


      $pinterest.attr('href',pinImageUrl);
      /*
      
      https://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Flocalhost%3A7889%2Funrial%2Fdev%2F2019%2F02%2F05%2Fpraesent-magna-sapiens%2F%26media%3D%2Funrial%2Fdev%2Fwp-content%2Fuploads%2F2019%2F02%2F100_max.jpg%26description%3DLa%20tercera%20samnurai%203%20que%20debe%20ser%20mas%20largo%20que%20todos

      https%3A%2F%2Funrial.com
      &
      media=https%3A%2F%2Fuuu.com%2Fmiimagen
      &
      description=Esta%20es%20mi%20imagen

      */






      if (callback) {
        setTimeout(function () {
          callback.apply(null, [$img[0]]);
        }, 50);
      }
    };
    imgDummy.src = opt.src;
  };
  // END LOAD IMAGE *********************************

  // UPDATE CAROUSEL *************************************
  var updateCarousel = function (imgSrc, index) {
    length = imgSrc.length;
    $scroller.html("");

    var indexImage = index,
      imageArray = [];

    var $firstItem = null;

    var createItem = function (src, i) {
      var $item = $(
        '<div class="ugc-item"><div class="ugs-item-cont"><img src="' +
        src.thumb +
        '" alt="" data-pin-nopin="true"/></div></div>'
      );
      if (i === index) {
        $item.addClass("current");
      }
      $scroller.append($item);
      if (i === 0) {
        $firstItem = $item;
      }

      imageArray.push($item);

      $item.click(function () {
        if (!loadingItem) {
          loadingItem = true;

          if (imageArray[indexImage]) {
            imageArray[indexImage].removeClass("current");
          }

          indexImage = i;

          $item.addClass("current");

          loadImage({
            src: src.big,
            text: src.text
          }, function () {
            loadingItem = false;
          });
        }
      });
    };
    imgSrc.forEach(createItem);

    var setSize = function () {
      firstItemWidth = $firstItem.outerWidth();
      var scrollerWidth = round(firstItemWidth * length),
        carrWidth = round($carr.outerWidth());
      if (scrollerWidth > carrWidth) {
        // scrollered
        currentScrolled = 0;
        currentLeft = 0;
        scrollered = true;
        $carousel.addClass("scrollered");
        $scroller.css({
          width: scrollerWidth + 50 + "px",
          left: "0px"
        });
        $btnLeft.addClass("disabled");
        $btnRight.removeClass("disabled");
        bLeftDisabled = true;
        bRightDisabled = false;
      } else {
        // no scrollered
        scrollered = false;
        $carousel.removeClass("scrollered");
        $scroller.css({
          width: "auto",
          left: "auto"
        });
      }
    };
    setSize();
    window.addEventListener("resize", setSize);
  };
  // END UPDATE CAROUSEL *********************************

  // BUTTONS *************************************
  $btnLeft.click(function () {
    if (scrollered && currentScrolled > 0) {
      currentScrolled--;
      currentLeft += firstItemWidth;
      $scroller.css({
        left: currentLeft + "px"
      });

      if (bRightDisabled) {
        bRightDisabled = false;
        $btnRight.removeClass("disabled");
      }
      if (currentScrolled === 0 && !bLeftDisabled) {
        bLeftDisabled = true;
        $btnLeft.addClass("disabled");
      }
    }
  });
  $btnRight.click(function () {
    if (scrollered && currentScrolled < length - 1) {
      currentScrolled++;
      currentLeft -= firstItemWidth;
      $scroller.css({
        left: currentLeft + "px"
      });

      if (bLeftDisabled) {
        bLeftDisabled = false;
        $btnLeft.removeClass("disabled");
      }
      if (currentScrolled === length - 1 && !bRightDisabled) {
        bRightDisabled = true;
        $btnRight.addClass("disabled");
      }
    }
  });
  // END BUTTONS *********************************

  // PUBLIC *************************************
  var G = {
    activate: function (opt) {
      if (!activatedGallery) {
        activatedGallery = true;

        var wst = $(window).scrollTop();

        $Gallery.addClass("waiting");
        opt.$fig.addClass("loading");

        loadImage(opt, function (imgBig) {
          opt.$fig.removeClass("loading");

          var dThumb = opt.imgThumb.getBoundingClientRect(),
            dBig = imgBig.getBoundingClientRect();

          setTimeout(function () {
            $clone
              .attr("src", opt.imgThumb.src)
              .css({
                top: round(dThumb.top + wst),
                left: round(dThumb.left),
                width: round(dThumb.width),
                height: round(dThumb.height)
              })
              .addClass("shown");

            setTimeout(function () {
              $clone.css({
                top: round(dBig.top + wst),
                left: round(dBig.left),
                width: round(dBig.width),
                height: round(dBig.height)
              });

              setTimeout(function () {
                $Gallery.removeClass("waiting").addClass("shown");
                setTimeout(function () {
                  $clone.removeClass("shown");
                  activatedGallery = false;
                }, 320);
              }, 510);
            }, 50);
          }, 50);
        });
        updateCarousel(opt.imgSrc, opt.index);
      }
    },
    deactivate: function () {
      $Gallery.removeClass("shown");
    }
  };
  // END PUBLIC *********************************

  // CLOSE BUTTON *************************************
  $close.on("click", function () {
    G.deactivate();
  });
  // END CLOSE BUTTON *********************************

  return G;
};