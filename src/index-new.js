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

// #region Nav

$(document).ready(() => {
  // Scroll
  const navbar = $('.nav');
  const scrollHeight = $(navbar).height();

  // Create the GSAP timeline animation
  const navbarAnimation = gsap.timeline({ paused: true }).to(
    navbar,
    {
      height: '4.8rem',
      top: '0.6rem',
      paddingRight: '1.6rem',
      paddingLeft: '0.8rem',
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      duration: 0.8,
      ease: Power1.easeInOut,
    },
    '<'
  );

  window.onscroll = () => {
    if (navbar.length) {
      if (window.scrollY > scrollHeight / 2) {
        if (!navbar.hasClass('fixed')) {
          navbar.addClass('fixed');
        }
      } else {
        if (navbar.hasClass('fixed')) {
          navbar.removeClass('fixed');
        }
      }
    }
  };

  // Click
  // Function to create observer and handle class change
  function createObserver(targetSelector, callback) {
    const targetNodes = $(targetSelector);
    targetNodes.each(function () {
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            callback(mutation.target);
          }
        });
      });
      observer.observe(this, { attributes: true, attributeFilter: ['class'] }); // Pass the DOM node directly
    });
  }

  // Callbacks for different elements
  let dropdwonTimeout;
  function dropdownCallback(targetElement) {
    if ($(targetElement).hasClass('w--open') || $('.nav_menu-link.dropdown').hasClass('w--open')) {
      $('.nav').addClass('open');
    } else {
      $('.nav').removeClass('open');
    }
  }

  // Opened Menu
  // --- Scroll Disabler
  let scrollPosition;
  let menuOpen = false;

  const disableScroll = () => {
    if (!menuOpen) {
      scrollPosition = $(window).scrollTop();
      $('html, body').scrollTop(0).addClass('overflow-hidden');
      $('.nav').addClass('open');
    } else {
      $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
      $('.nav').removeClass('open');
    }
    menuOpen = !menuOpen;
  };

  // Create observers for the elements with their respective callbacks
  createObserver('.nav_menu-link.dropdown', dropdownCallback);
  createObserver('.w-nav-button', disableScroll);
});
// #endregion
