import { heroVideo, videoPlay } from '$utils/globals';
import { initGooglePlaceAutocomplete } from '$utils/googlePlace';
import { createSwiper } from '$utils/swipers';

// #region Swipers
createSwiper('.section_testimonials', '.testimonials1_slider', 'testimonials-1', {
  slidesPerView: 1,
  spaceBetween: 48,
  loop: true,
  on: {
    slideChange: (swiper) => {
      let currentIndex = swiper.activeIndex;
      let { length } = swiper.slides;

      let prevIndex = (currentIndex - 1 + swiper.slides.length) % swiper.slides.length;
      let nextIndex = (currentIndex + 1) % swiper.slides.length;

      let prev = swiper.slides.eq(prevIndex);
      let next = swiper.slides.eq(nextIndex);

      $('#prev-restaurant').text($(prev).attr('data-restaurant'));
      $('#next-restaurant').text($(next).attr('data-restaurant'));
      console.log(next);
    },
  },
});

createSwiper('.section_testimonials2', '.testimonials2_wrap .max-width-full', 'testimonials-2', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: '.swiper-navigation.cc-testimonials2',
    type: 'bullets',
    bulletActiveClass: 'cc-active',
    bulletClass: 'swiper-bullet',
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '"><span></span></span>';
    },
  },
  autoplay: { delay: 5000 },
});

createSwiper('.guides_wrap', '.guides_slider', 'guides', {
  spaceBetween: 8,
  loop: true,
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 1,
    },
    992: {
      slidesPerView: 3,
    },
  },
});

// #endregion

// #region Helpers

// Preload Data from Google API
initGooglePlaceAutocomplete();

// Vimeo Players
videoPlay();
heroVideo();

// Prevent Default Submit Action
$('form[data-submit=prevent]').submit(function (e) {
  e.preventDefault();
});

$('form[data-submit=prevent]').on('keydown', function (e) {
  if (e.key === 'Enter') {
    $(this).find('[data-submit]').click();
  }
});

// #endregion
