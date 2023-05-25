import { initGooglePlaceAutocomplete } from '$utils/googlePlace';

$(document).ready(() => {
  // --- Preload Data from Google API ---
  initGooglePlaceAutocomplete();

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

    console.log(visuals);

    // Check if clicked element is already opened
    if (!self.hasClass(openClass)) {
      // Reveal clicked class
      self.addClass(openClass);
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
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      items.removeClass(openClass);
      triggerItemClick();
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
    allItems.animate({ height: 0 }, firstClick ? 0 : 400);

    // Show Current
    visibleItems.animate(
      {
        height: visibleItems.get(0).scrollHeight,
      },
      firstClick ? 0 : 400,
      function () {
        $(this).height('auto');
      }
    );
  }
});
