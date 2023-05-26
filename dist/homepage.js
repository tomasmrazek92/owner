"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/swipers.js
  var swipers = [];
  var createSwiper = (componentSelector, swiperSelector, classSelector, options) => {
    const arrows = ".slider-arrow";
    const pagination = ".swiper-navigation";
    $(componentSelector).each(function() {
      let index = $(this).index();
      let instanceClass = `${classSelector}_${index}`;
      $(this).find(swiperSelector).addClass(instanceClass);
      $(this).find(arrows).addClass(instanceClass);
      $(this).find(pagination).addClass(instanceClass);
      let swiperOptions = Object.assign({}, options, {
        speed: 250,
        navigation: {
          prevEl: `${arrows}.prev.${instanceClass}`,
          nextEl: `${arrows}.next.${instanceClass}`
        },
        pagination: {
          el: `${pagination}.${instanceClass}`,
          type: "bullets",
          bulletActiveClass: "w-active",
          bulletClass: "w-slider-dot"
        }
      });
      for (let key in options) {
        if (key in swiperOptions) {
          swiperOptions[key] = options[key];
        }
      }
      let swiper = new Swiper(`${swiperSelector}.${instanceClass}`, swiperOptions);
      swipers[classSelector] = swipers[classSelector] || {};
      swipers[classSelector][index] = swiper;
    });
  };

  // src/homepage.js
  var video = $("#hero-video")[0];
  $(".n_hero-video_thumb").click(function(e) {
    e.stopPropagation();
    if (video.paused) {
      video.play();
    }
    $(this).hide();
  });
  createSwiper(".n_testimonials", ".n_testimonials-content", "hp-testimonials", {
    slidesPerView: "auto",
    spaceBetween: 32,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    on: {
      slideChange: function() {
        let currentIndex = this.activeIndex;
        navigationItems.removeClass("active");
        navigationItems.eq(currentIndex).addClass("active");
      }
    }
  });
  var heroSlider = swipers["hp-testimonials"][0];
  var navigationItems = $(".n_testimonials-nav_item");
  navigationItems.on("click", function() {
    let index = $(this).index();
    heroSlider.slideTo(index);
  });
  var featureSection = ".n_section-hp-slider";
  var progressBar = $(".hp-slider_nav-progress");
  var duration = 5e3;
  var progress = true;
  var isInView = false;
  var observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === $(featureSection)[0]) {
        if (entry.isIntersecting) {
          createSwiper(featureSection, ".hp-slider_slider", "hp-features", {
            slidersPerView: "auto",
            spaceBetween: -160,
            loop: true,
            autoplay: {
              delay: duration
            },
            on: {
              init: function() {
                initProgressBar();
              },
              slideChange: function() {
                updateTitle(this);
                progressBar.stop().css("width", "0%");
              },
              slideChangeTransitionStart: function() {
                initProgressBar();
              },
              touchMove: function() {
                stopProgressBar();
              },
              touchStart: function() {
                stopProgressBar();
              },
              touchEnd: function() {
                stopProgressBar();
              }
            }
          });
          isInView = true;
        }
      }
    });
  });
  observer.observe($(featureSection)[0]);
  function updateTitle(swiperInstance) {
    let activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    let title = $(activeSlide).find(".hp-slider_slide").attr("data-title");
    $(".hp-slider_nav-box_inner [data-title]").text(title);
  }
  function stopProgressBar() {
    progress = false;
    progressBar.stop();
  }
  function initProgressBar() {
    if (progress) {
      progressBar.stop().animate({ width: "100%" }, duration);
    }
  }
})();
//# sourceMappingURL=homepage.js.map
