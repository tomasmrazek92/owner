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
