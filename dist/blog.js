"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/swipers.js
  var swipers = [];
  var createSwiper = (componentSelector, swiperSelector, classSelector, options) => {
    const arrows = ".swiper_arrow";
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

  // src/blog.js
  var blogSwipers = $(".slider.n_blog-post").not("#swiper-related");
  if (blogSwipers) {
    createSwiper($(blogSwipers), ".swiper.n_blog-post", "blog-swiper", {
      spaceBetween: 20,
      slidesPerView: 3,
      centeredSlides: false,
      lazy: true,
      breakpoints: {
        0: {
          slidesPerView: 1.25,
          spaceBetween: 16
        },
        480: {
          slidesPerView: 1.25,
          spaceBetween: 16
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }
  var blogDetail = $(".n_section-blog_other");
  if (blogDetail) {
    let swiperMode = function() {
      const mobile = window.matchMedia("(min-width: 0px) and (max-width: 991px)");
      const desktop = window.matchMedia("(min-width: 992px)");
      if (desktop.matches) {
        if (init) {
          swiper.destroy(true, true);
          init = false;
        }
      } else if (mobile.matches) {
        if (!init) {
          init = true;
          swiper = new Swiper(".swiper.n_blog-post", {
            slidesPerView: 1.1,
            spaceBetween: 20,
            navigation: {
              prevEl: `.swiper_arrow.n_blog-post.prev`,
              nextEl: `.swiper_arrow.n_blog-post.next`
            }
          });
        }
      }
    };
    swiperMode2 = swiperMode;
    let swiper;
    let init = false;
    window.addEventListener("load", function() {
      swiperMode();
    });
    window.addEventListener("resize", function() {
      swiperMode();
    });
  }
  var swiperMode2;
  $(".n_blog-radio-field").on("click", function() {
    if ($(this).is('[fs-cmsfilter-element="clear"]')) {
      $(this).addClass("is-active");
    } else {
      $('[fs-cmsfilter-element="clear"]').removeClass("is-active");
    }
  });
})();
//# sourceMappingURL=blog.js.map
