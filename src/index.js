import { heroVideo } from '$utils/globals';
import { initGooglePlaceAutocomplete } from '$utils/googlePlace';
import { createSwiper } from '$utils/swipers';

$(document).ready(() => {
  // --- Preload Data from Google API ---
  initGooglePlaceAutocomplete();

  // --- Play Video
  heroVideo();

  // --- Menu on Scroll
  window.onscroll = () => {
    let navbar = $('.n_nav-wrapper');
    let scrollHeight = $(navbar).height();
    if ($(navbar)) {
      if (window.scrollY > scrollHeight / 2) {
        $(navbar).addClass('pinned');
      } else {
        $(navbar).removeClass('pinned');
      }
    }
  };

  // --- Scroll Disabler
  let scrollPosition;
  let menuOpen = false;

  const disableScroll = () => {
    if (!menuOpen) {
      scrollPosition = $(window).scrollTop();
      $('html, body').scrollTop(0).addClass('overflow-hidden');
    } else {
      $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
    }
    menuOpen = !menuOpen;
  };

  $('.n_navbar-hamburger').on('click', disableScroll);

  // -- Menu dropdown
  let backBtn = $('.n_navbar-back');
  let navBrand = $('.n_nav_brand');

  const switchNav = (btn, nav) => {
    backBtn.toggle(btn);
    navBrand.toggle(nav);
  };

  // Show Back on Click
  $('.n_navbar-dropdown').on('click', function () {
    switchNav(true, false);
  });

  // Check if we should hide "Back"
  $(document).on('click', function () {
    if ($(window).width() < 992) {
      // Click outside of menu
      setTimeout(function () {
        let openDropdown = $('.w-dropdown-toggle.w--open');
        if (!openDropdown.length) {
          openDropdown.trigger('click');
        }
      }, 20);
    }
  });

  // --- Custom Actions ---
  // Prevent Default Submit Action
  $('form[data-submit=prevent]').submit(function (e) {
    e.preventDefault();
  });

  $('form[data-submit=prevent]').on('keydown', function (e) {
    if (e.key === 'Enter') {
      $(this).find('[data-submit]').click();
    }
  });

  // --- Tabs
  let tabs = $('.n_feature-tab');
  let openClass = 'current';
  let visualReHeight;
  let firstClick = true;

  tabs.each(function () {
    let items = $(this).find('.n_feature-tab_list-item');
    let visuals = $(this).find('.n_feature-tab_visual').find('.n_feature-tab_visual-inner');
    let actionsMask = $(this).find('.n_feature-tab_list-item_actions');
    let visualsRe = $(this).find('.n_feature-tab_visual_r');
    let visualReHeight = visualsRe.height();

    items.on('click', function () {
      // Define
      let self = $(this);
      let index = self.index();

      // Check if clicked element is already opened
      if (!self.hasClass(openClass)) {
        // Reveal clicked class
        revealTab(self);

        // Get all opened items except the clicked one
        let openItems = items.filter('.' + openClass).not(self);

        // Remove the class
        openItems.each(function () {
          let currentItem = $(this);
          currentItem.removeClass(openClass);
        });

        // Update visual
        let animationCount = 0;

        visuals.fadeOut(firstClick ? 0 : 250, function () {
          if (++animationCount === visuals.length) {
            visuals.eq(index).fadeIn(firstClick ? 0 : 2 % 0);
          }
        });

        // Remove first click
        firstClick = false;
      }
    });

    // Init handler
    let resizeTimeout;

    const triggerItemClick = () => items.eq(0).trigger('click', false);

    // run on page load
    triggerItemClick();

    // run on resize
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentWindowWidth = window.innerWidth;
        if (currentWindowWidth !== windowWidth) {
          visualReHeight = $(visualsRe).css('height', 'auto').height();
          console.log(visualReHeight);
          items.removeClass(openClass);
          triggerItemClick();
          windowWidth = currentWindowWidth;
        }
      }, 250);
    });

    // Functions
    function revealTab(elem) {
      const mask = $(elem).find(actionsMask);

      const currentVisual = $(elem).find(visualsRe);
      currentVisual.find('img').removeAttr('loading');

      // Handle responsive behavior
      if (window.innerWidth < 991) {
        currentVisual.show();
      } else {
        currentVisual.hide();
      }

      // Hide others
      const allItems = $(actionsMask).add(visualsRe);
      allItems
        .not(mask)
        .not(currentVisual)
        .animate({ height: 0 }, { duration: firstClick ? 0 : 400, queue: false });

      // Show current
      $(elem).addClass(openClass);
      mask
        .stop()
        .animate(
          { height: mask[0].scrollHeight },
          { duration: firstClick ? 0 : 400, queue: false },
          function () {
            console.log('Fire');
            mask.css('height', 'auto');
          }
        );

      currentVisual
        .stop()
        .animate(
          { height: visualReHeight },
          { duration: firstClick ? 0 : 400, queue: false },
          function () {
            currentVisual.css('height', 'auto');
          }
        );
    }
  });

  // --- Features Swiper
  let featureSection = '.n_section-hp-slider';

  if ($(featureSection)) {
    let visuals = $('.hp-slider_visuals-item');
    let listItems = $('.hp-slider_list-item');
    let slides = $('.swiper-slide.n_hp-slider');
    createSwiper(featureSection, '.hp-slider_slider', 'hp-slider', {
      slidesPerView: 1,
      autoHeight: true,
      slideToClickedSlide: true,
      observer: true,
      observeParents: true,
      on: {
        beforeTransitionStart: (swiper) => {
          let index = swiper.realIndex;

          /* Visuals */
          crossfade(visuals, index);

          /* List */
          crossfade(listItems, index);
        },
      },
      breakpoints: {
        0: { autoHeight: true },
        480: { autoHeight: true },
        768: { autoHeight: true },
        992: { autoHeight: true },
      },
    });

    function crossfade(elements, index) {
      elements
        .filter(':visible')
        .css('position', 'absolute')
        .stop()
        .animate({ opacity: 0 }, 'fast', function () {
          $(this).hide();
        });
      elements
        .eq(index)
        .css('position', 'relative')
        .css('opacity', 0)
        .show()
        .stop()
        .animate({ opacity: 1 }, 'fast');
    }
  }

  // --- Case Study Swiper
  let csSlider = $('.n_section-cs');
  if (csSlider) {
    console.log('Init');
    createSwiper(csSlider, '.swiper.n_case-studies', 'case-study-slider', {
      slidesPerView: 1,
      spaceBetween: 48,
    });
  }

  var mySwiper3 = new Swiper('.n_team-swiper', {
    mousewheel: {
      invert: true,
      forceToAxis: true,
    },
    spaceBetween: 32,
    slidesPerView: 5,
    slidesPerGroup: 1,
    loop: false,
    speed: 1200,
    centeredSlides: false,
    lazy: true,
    navigation: {
      nextEl: '.swiper_arrow.next.n_team-arrow',
      prevEl: '.swiper_arrow.prev.n_team-arrow',
    },
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1.25,
        spaceBetween: 16,
      },
      480: {
        slidesPerView: 2.25,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 32,
      },
    },
  });
});
