import { v4 as uuidv4 } from 'uuid';
import { heroVideo, videoPlay } from '$utils/globals';
import { initGooglePlaceAutocomplete } from '$utils/googlePlace';
import { createSwiper } from '$utils/swipers';
import { handleUTMParams } from '$utils/utms';

// #region Mixpanel and userID
function initMixpanel() {
  if (!window.mixpanel || !window.mixpanel.__SV) {
    var mixpanel = (window.mixpanel = window.mixpanel || []);
    mixpanel._i = [];

    mixpanel.init = function (e, f, c) {
      function g(a, d) {
        var b = d.split('.');
        2 == b.length && ((a = a[b[0]]), (d = b[1]));
        a[d] = function () {
          a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }

      var a = mixpanel;
      'undefined' !== typeof c ? (a = mixpanel[c] = []) : (c = 'mixpanel');
      a.people = a.people || [];

      a.toString = function (a) {
        var d = 'mixpanel';
        'mixpanel' !== c && (d += '.' + c);
        a || (d += ' (stub)');
        return d;
      };

      a.people.toString = function () {
        return a.toString(1) + '.people (stub)';
      };

      var i =
        'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'.split(
          ' '
        );

      for (var h = 0; h < i.length; h++) g(a, i[h]);

      var j = 'set set_once union unset remove delete'.split(' ');

      a.get_group = function () {
        function b(c) {
          d[c] = function () {
            call2_args = arguments;
            call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
            a.push([e, call2]);
          };
        }

        for (
          var d = {}, e = ['get_group'].concat(Array.prototype.slice.call(arguments, 0)), c = 0;
          c < j.length;
          c++
        )
          b(j[c]);

        return d;
      };

      mixpanel._i.push([e, f, c]);
    };

    mixpanel.__SV = 1.2;

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.async = true;
    e.src =
      'undefined' !== typeof MIXPANEL_CUSTOM_LIB_URL
        ? MIXPANEL_CUSTOM_LIB_URL
        : 'file:' === document.location.protocol &&
          '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//)
        ? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
        : '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';

    var g = document.getElementsByTagName('script')[0];
    g.parentNode.insertBefore(e, g);
  }
}
// Initialize with your project token
initMixpanel();

mixpanel.init('8e3c791cba0b20f2bc5aa67d9fb2732a', {
  record_sessions_percent: 100,
  record_mask_text_selector: '',
});

$(document).ready(function () {
  // User ID
  // check cookies for an existing user ID
  let webUserId = $.cookie('webTempTatariUserId');

  // if none exists, generate a new one and save it
  if (!webUserId) {
    webUserId = uuidv4();
    $.cookie('webTempTatariUserId', webUserId, {
      domain: '.owner.com',
      path: '/',
    });
  }

  // Also save to window level
  window.webUserId = webUserId;

  // Saves to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    webUserId: webUserId,
  });

  // Identify the user first for the mixPanel
  if (typeof webUserId !== 'undefined' && webUserId) {
    mixpanel.identify(webUserId);

    // Track pageview
    mixpanel.track_pageview({
      page: window.location.pathname,
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
    });
  }
});
// #endregion

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

      $('[prev-restaurant]').text($(prev).attr('data-restaurant'));
      $('[next-restaurant]').text($(next).attr('data-restaurant'));
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

handleUTMParams();

// Prevent Default Submit Action
$('form[data-submit=prevent]').on('submit', function (event) {
  event.preventDefault();
  event.stopPropagation();
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
  const snackBar = $('.snack-bar');
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
  let menuOpen = false;
  var scrollPosition = 0;

  const disableScroll = () => {
    if (!menuOpen) {
      scrollPosition = $(window).scrollTop();
      $('html').scrollTop(0).addClass('overflow-hidden');
      scrollPosition = window.pageYOffset;
      $('body').css({
        overflow: 'hidden',
        position: 'fixed',
        top: `-${scrollPosition}px`,
        width: '100%',
      });
      $('.nav').addClass('open');
      snackBar.hide();
    } else {
      $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
      $('body').css({
        overflow: '',
        position: '',
        top: '',
        width: '',
      });
      $(window).scrollTop(scrollPosition);
      $('.nav').removeClass('open');
      snackBar.show();
    }
    menuOpen = !menuOpen;
  };

  // Create observers for the elements with their respective callbacks
  createObserver('.nav_menu-link.dropdown', dropdownCallback);
  createObserver('.w-nav-button', disableScroll);
});
// #endregion
