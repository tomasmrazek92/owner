import { initGooglePlaceAutocomplete } from '$utils/googlePlace';
import { createSwiper } from '$utils/swipers';

$(document).ready(() => {
  // --- Preload Data from Google API ---
  initGooglePlaceAutocomplete();

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
          switchNav(false, true);
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
  let firstClick = true;

  tabs.each(function () {
    let items = $(this).find('.n_feature-tab_list-item');
    let visuals = $(this).find('.n_feature-tab_visual').find('.n_feature-tab_visual-inner');
    let actionsMask = $(this).find('.n_feature-tab_list-item_actions');
    let visualReMask = $(this).find('.n_feature-tab_visual_r');

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
          items.removeClass(openClass);
          triggerItemClick();
          windowWidth = currentWindowWidth;
        }
      }, 250);
    });

    // Functions
    function revealTab(elem) {
      // Animated Items
      let mask = $(elem).find(actionsMask);
      let visualRe = $(elem).find(visualReMask);

      let visibleItems = mask.add(visualRe);
      let allItems = $(actionsMask).add(visualReMask);

      // Handle respo
      if (window.innerWidth < 991) {
        $(visualReMask).show();
      } else {
        $(visualReMask).hide();
      }

      // Hide others
      allItems.animate({ height: 0 }, { duration: firstClick ? 0 : 400, queue: false });

      // Show Current
      $(elem).addClass(openClass);
      mask.animate(
        { height: mask.get(0).scrollHeight },
        { duration: firstClick ? 0 : 400, queue: false },
        function () {
          $(this).height('auto');
        }
      );
      visualRe.animate(
        { height: visualRe.get(0).scrollHeight },
        { duration: firstClick ? 0 : 400, queue: false },
        function () {
          $(this).height('auto');
        }
      );
    }
  });

  // --- Case Study Section
  let csSlider = $('.n_section-cs');
  console.log(csSlider);
  if (csSlider) {
    console.log('Init');
    createSwiper(csSlider, '.swiper.n_case-studies', 'case-study-slider', {
      slidesPerView: 1,
      spaceBetween: 48,
    });
  }
});
