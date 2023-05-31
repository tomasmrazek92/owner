import { validateInput } from '$utils/formValidations';
import { fillHubSpot, mirrorHS, onFormReadyCallback, waitForFormReady } from '$utils/hubspotLogic';

$(document).ready(() => {
  // Custom Select
  $('.nice-select li').on('click', function () {
    $('.nice-select .current').css('color', 'white');
  });

  // -- Forms
  let wfForm = $('#demo-form');
  let hsForm;

  // Initialize the HubSpot form
  hbspt.forms.create({
    portalId: '6449395',
    formId: 'f3807262-aed3-4b9c-93a3-247ad4c55e60',
    target: '#hbst-form',
    onFormReady: onFormReadyCallback, // Use the onFormReadyCallback function as the callback
  });

  // Call the waitForFormReady function
  waitForFormReady().then(function (form) {
    hsForm = $(form);
  });

  // -- Inputs
  const inputMapping = {
    name: ['company', '0-2/name'],
    international_phone_number: ['phone', '0-2/phone'],
    'restaurant-address': ['address', '0-2/address'],
    locality: ['city', '0-2/city'],
    administrative_area_level_1: ['state', '0-2/state'],
    postal_code: ['zip', '0-2/zip'],
    country: ['country', '0-2/country'],
    'first-name': 'firstname',
    'last-name': 'lastname',
    cellphone: 'mobilephone',
    email: 'email',
    'person-type': 'lead_person_type',
    website: 'website',
    place_id: 'place_id',
    place_types: ['place_types_contact', '0-2/place_types'],
    rating: 'place_rating',
    user_ratings_total: 'user_ratings_total',
    hear: 'how_did_you_hear_about_us',
    page_url: 'last_pdf_download',

    // ...
  };

  // Submit
  $('[data-form=submit-btn]').on('click', function (e) {
    let button = $(this);

    e.preventDefault();

    let isValid = true;

    $(':input:visible, select').each(function () {
      let validate = validateInput($(this));
      isValid = isValid && validate;
    });

    if (isValid) {
      fillHubSpot(wfForm, hsForm, inputMapping);
    }

    console.log(isValid);
  });
});
