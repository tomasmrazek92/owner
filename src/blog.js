import { createSwiper } from '$utils/swipers';

// Swipers
let blogSwipers = $('.slider.n_blog-post');
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

// Filters
$('.n_blog-radio-field').on('click', function () {
  if ($(this).is('[fs-cmsfilter-element="clear"]')) {
    $(this).addClass('is-active');
  } else {
    $('[fs-cmsfilter-element="clear"]').removeClass('is-active');
  }
});
