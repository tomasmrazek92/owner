import { createSwiper, swipers } from '$utils/swipers';

// --- Hero Slider
createSwiper('.n_testimonials', '.n_testimonials-content', 'hp-testimonials', {
  slidesPerView: 'auto',
  spaceBetween: 32,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  on: {
    slideChange: function () {
      let currentIndex = this.activeIndex;
      navigationItems.removeClass('active');
      navigationItems.eq(currentIndex).addClass('active');
    },
  },
});

let heroSlider = swipers['hp-testimonials'][0];

// Navigation
let navigationItems = $('.n_testimonials-nav_item');

// Navigation Click
navigationItems.on('click', function () {
  let index = $(this).index();
  heroSlider.slideTo(index);
});

// --- Feature Slider
var progressBar = $('.hp-slider_nav-progress');
var duration = 5000;
let progress = true;

// Set the Slider
createSwiper('.n_section-hp-slider', '.hp-slider_slider', 'hp-features', {
  slidersPerView: 'auto',
  spaceBetween: -160,
  loop: true,
  autoplay: {
    delay: duration,
  },
  on: {
    init: function () {
      initProgressBar();
    },
    slideChange: function () {
      updateTitle(this);
      progressBar.stop().css('width', '0%');
    },
    slideChangeTransitionStart: function () {
      initProgressBar();
    },
    touchMove: function () {
      stopProgressBar();
    },
    touchStart: function () {
      stopProgressBar();
    },
    touchEnd: function () {
      stopProgressBar();
    },
  },
});

let featuresSliders = swipers['hp-features'][3];

// Title Change
updateTitle(featuresSliders);

function updateTitle(swiperInstance) {
  let activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
  let title = $(activeSlide).find('.hp-slider_slide').attr('data-title');

  $('.hp-slider_nav-box_inner [data-title]').text(title);
}

// Progress Bar
function stopProgressBar() {
  progress = false;
  progressBar.stop();
}
function initProgressBar() {
  if (progress) {
    progressBar.stop().animate({ width: '100%' }, duration);
  }
}
