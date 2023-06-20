import { createSwiper } from '$utils/swipers';

// Swipers
let blogSwipers = $('.slider.n_blog-post').not('#swiper-related');
if (blogSwipers) {
  createSwiper($(blogSwipers), '.swiper.n_blog-post', 'blog-swiper', {
    spaceBetween: 20,
    slidesPerView: 3,
    centeredSlides: false,
    lazy: true,
    breakpoints: {
      0: {
        slidesPerView: 1.25,
        spaceBetween: 16,
      },
      480: {
        slidesPerView: 1.25,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });
}

let blogDetail = $('.n_section-blog_other');

if (blogDetail) {
  let swiper;
  let init = false;

  function swiperMode() {
    const mobile = window.matchMedia('(min-width: 0px) and (max-width: 991px)');
    const desktop = window.matchMedia('(min-width: 992px)');

    // Disable (for desktop)
    if (desktop.matches) {
      if (init) {
        swiper.destroy(true, true);
        init = false;
      }
    }

    // Enable (for Mobile)
    else if (mobile.matches) {
      if (!init) {
        init = true;
        swiper = new Swiper('.swiper.n_blog-post', {
          slidesPerView: 1.1,
          spaceBetween: 20,
          navigation: {
            prevEl: `.swiper_arrow.n_blog-post.prev`,
            nextEl: `.swiper_arrow.n_blog-post.next`,
          },
        });
      }
    }
  }

  // Load
  window.addEventListener('load', function () {
    swiperMode();
  });

  // Resize
  window.addEventListener('resize', function () {
    swiperMode();
  });
}

// Filters
$('.n_blog-radio-field').on('click', function () {
  if ($(this).is('[fs-cmsfilter-element="clear"]')) {
    $(this).addClass('is-active');
  } else {
    $('[fs-cmsfilter-element="clear"]').removeClass('is-active');
  }
});
