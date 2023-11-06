import { validateInput } from '$utils/formValidations';
import { setInputElementValue } from '$utils/globals';
import {
  fillHubSpot,
  handleHubspotForm,
  onFormReadyCallback,
  waitForFormReady,
} from '$utils/hubspotLogic';

$(document).ready(() => {
  // Custom Select
  $('.nice-select li').on('click', function () {
    $('.nice-select .current').css('color', 'white');
  });

  // -- Forms
  let wfForm = $('#demo-form');
  let hsForm;

  // Handle Submit
  const successSubmit = () => {
    window.location.href = 'https://www.owner.com/funnel-demo-requested';
  };

  // Initialize the HubSpot form
  hbspt.forms.create({
    portalId: '6449395',
    formId: 'f3807262-aed3-4b9c-93a3-247ad4c55e60',
    target: '#hbst-form',
    onFormReady: onFormReadyCallback,
    onFormSubmitted: successSubmit,
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
    'number-of-locations': 'of_locations_number',
    hear: 'how_did_you_hear_about_us',
    page_url: 'last_pdf_download',
    page_lang: 'page_lang',

    // ...
  };

  // Submit Action
  $('[data-form=submit-btn]').on('click', function (e) {
    let button = $(this);

    e.preventDefault();

    let isValid = true;

    wfForm.find(':input:visible, select').each(function () {
      let validate = validateInput($(this));
      isValid = isValid && validate;
    });

    if (isValid) {
      // Custom Inputs
      setInputElementValue('page_url', window.location.pathname);
      setInputElementValue('page_lang', $('html').attr('lang'));
      fillHubSpot(wfForm, hsForm, inputMapping);
      handleHubspotForm(hsForm);
    }
  });

  // Condition Logic
  $('select[name="person-type"]').on('change', function () {
    let val = $(this).val();
    if (val === "I'm a restaurant owner or manager") {
      $('#locations-wrap').show();
    } else {
      $('#locations-wrap').hide();
    }
  });
});
