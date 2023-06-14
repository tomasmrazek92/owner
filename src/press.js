import { createSwiper } from '$utils/swipers';

let heroCarousel = $('.n_section-press-hero');

if (heroCarousel) {
  createSwiper(heroCarousel, '.swiper.press', 'press-slider', {
    slidesPerView: 1.75,
    spaceBetween: 32,
    centeredSlides: true,
    loop: true,
    autoloop: {
      delay: 4000,
    },
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
        slidesPerView: 1.5,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 1.75,
        spaceBetween: 32,
      },
      1440: {
        slidesPerView: 2.5,
        spaceBetween: 32,
      },
    },
  });
}
