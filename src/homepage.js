import { heroVideo } from '$utils/globals';
import { createSwiper, swipers } from '$utils/swipers';

$(document).ready(() => {

  // // --- Hero Slider
  // createSwiper('.n_testimonials', '.n_testimonials-content', 'hp-testimonials', {
  //   slidesPerView: 'auto',
  //   spaceBetween: 32,
  //   effect: 'fade',
  //   fadeEffect: {
  //     crossFade: true,
  //   },
  //   on: {
  //     init: () => {
  //       $('.n_testimonials-nav_item').eq(0).addClass('active');
  //     },
  //     slideChange: function () {
  //       let currentIndex = this.activeIndex;
  //       navigationItems.removeClass('active');
  //       navigationItems.eq(currentIndex).addClass('active');
  //     },
  //   },
  // });

  // let heroSlider = swipers['hp-testimonials'][0];

  // // Navigation
  // let navigationItems = $('.n_testimonials-nav_item');

  // // Navigation Click
  // navigationItems.on('click', function () {
  //   let index = $(this).closest('.w-dyn-item').index();
  //   heroSlider.slideTo(index);
  // });
});
