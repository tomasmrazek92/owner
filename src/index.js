import { initGooglePlaceAutocomplete } from '$utils/googlePlace';

$(document).ready(() => {
  // --- Preload Data from Google API ---
  initGooglePlaceAutocomplete();

  // --- Custom Actions ---
  // Prevent Default Submit Action
  $('form[data-form=multistep]').submit(function (e) {
    e.preventDefault();
  });
});

// --- Tabs

let tabs = $('.n_feature-tab');
let isProgrammaticClick = false;
let openClass = 'current';

tabs.each(function () {
  let items = $(this).find('.n_feature-tab_list-item');

  items.on('click', function () {
    if (isProgrammaticClick) {
      return;
    }

    let self = $(this);
    let openItems;
    if (!self.hasClass(openClass)) {
      self.addClass(openClass);
      handleClick(self);
    }

    openItems = items.filter('.' + openClass).not(self);

    openItems.each(function () {
      let currentItem = $(this);
      currentItem.removeClass(openClass);
      handleClick(currentItem);
      console.log(isProgrammaticClick);
    });
  });

  // Open First
  items.eq(0).click();
});

function handleClick(elem) {
  let clickEl = $(elem).find('.n_feature-tab_trigger');
  isProgrammaticClick = true;
  clickEl.click();
  isProgrammaticClick = false;
}
