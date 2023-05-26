import { createSwiper, swipers } from '$utils/swipers';

// --- Hero Video

let video = $('#hero-video')[0];

$('.n_hero-video_thumb').click(function (e) {
  e.stopPropagation(); // Prevent event propagation to avoid conflicts
  if (video.paused) {
    video.play();
  }
  $(this).hide();
});

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
let featureSection = '.n_section-hp-slider';
let progressBar = $('.hp-slider_nav-progress');
const duration = 5000;
let progress = true;
let isInView = false;

// Set the Slider when it gets into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target === $(featureSection)[0]) {
      if (entry.isIntersecting) {
        createSwiper(featureSection, '.hp-slider_slider', 'hp-features', {
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

        isInView = true;
      }
    }
  });
});

// Observe the featureSlider element
observer.observe($(featureSection)[0]);

let featuresSliders = null; // Will be set when the slider is created and initialized

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
