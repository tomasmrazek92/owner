// --- inputMatting - [wfForm: hsForm]
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
  url: 'place_cid',
  place_types: ['place_types_contact', '0-2/place_types'],
  rating: 'place_rating',
  user_ratings_total: 'user_ratings_total',
  'number-of-locations': 'of_locations_number',
  hear_input: 'how_did_you_hear_about_us',
  page_url: 'last_pdf_download',
  page_lang: 'page_lang',
  brizo_id: ['brizo_id', '0-2/brizo_id_account'],
  base_enrich_date: ['auto_enrich_date', '0-2/auto_enrich_date_company'],
  inbound_add_to_cadence: 'inbound_add_to_cadence',
  execution_time_seconds: 'auto_enrich_time',
  auto_dq_flag: 'auto_dq_static',
  auto_dq_reason: ['auto_dq_reason', '0-2/auto_dq_reason_company'],
  gmv_pred: ['pred_gmv', '0-2/pred_gmv_company'],
  brand_emrr: 'default_brand_emrr',
  sms_opt_in: 'sms_opt_in',

  // Refers
  referrer_s_name: 'referrer_s_name',
  referrer_s_last_name: 'referrer_s_last_name',
  referrer_s_phone_number: 'referrer_s_phone_number',
  referrer_s_email: 'referrer_s_email',
  // ...
};

// --- Fill HubSpot Forms
const fillHubSpot = (formElement, hsform) => {
  var $form = $(formElement);
  var hsform = $(hsform);
  var mapping = inputMapping;

  Object.keys(mapping).forEach(function (sourceInputName) {
    var targetInputNames = mapping[sourceInputName];
    var $sourceInput = $form.find(
      'input[name="' + sourceInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '"]'
    );

    if ($sourceInput.length === 0) {
      $sourceInput = $form.find(
        'select[name="' + sourceInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '"]'
      );
    }

    var inputValue = $sourceInput.val();

    if ($sourceInput.attr('type') === 'checkbox') {
      inputValue = $sourceInput.is(':checked') ? 'true' : 'false';
    }

    if (!Array.isArray(targetInputNames)) {
      targetInputNames = [targetInputNames];
    }

    targetInputNames.forEach(function (targetInputName) {
      var targetInput = hsform.find(
        'input[name=' + targetInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ']'
      );

      if (targetInput.attr('type') === 'checkbox') {
        targetInput.prop('checked', String(inputValue).toLowerCase() === 'true');
      } else if (hasMatchingSibling(targetInput, '.hs-datepicker')) {
        targetInput.siblings('input[readonly]').val(inputValue).change();
      } else {
        targetInput.val(inputValue);
      }

      if (['phone', 'mobilephone', 'email', 'pred_gmv'].includes(targetInputName)) {
        const element = targetInput.get(0);
        if (element) {
          element.focus({ preventScroll: true });
          element.blur();
        }
      }
    });
  });
};

// --- Mirror HubSpot Error Messages ---
const mirrorHS = (hsform) => {
  let isError = false;

  // HS Phone
  var hsPhoneVal = hsform
    .find('input[name=mobilephone]')
    .parent()
    .siblings('.hs-error-msgs')
    .find('.hs-error-msg')
    .text();
  var gtPhoneVal = $('input[name="cellphone"]')
    .closest('[field-wrapper]')
    .find('[field-validation]');
  if (hsPhoneVal) {
    isError = true;
    gtPhoneVal.text(hsPhoneVal);
    gtPhoneVal.show();
  } else {
    gtPhoneVal.hide();
  }

  // HS Email
  var hsEmailVal = hsform
    .find('input[name=email]')
    .closest('.hs-fieldtype-text')
    .find('.hs-error-msgs')
    .find('.hs-error-msg')
    .text();
  var gtEmail = $('input[name="email"]').closest('[field-wrapper]').find('[field-validation]');
  if (hsEmailVal) {
    gtEmail.text(hsEmailVal);
    gtEmail.show();
    isError = true;
    hsform.find('input[name=email]').val('1');
  } else {
    gtEmail.hide();
  }
  return isError;
};

// --- Locate Hubspot Forms
// Function 1: Callback for onFormReady
export function onFormReadyCallback(form) {
  // Resolve the promise with the located form
  formReadyPromiseResolver(form);
}

// Function 2: Waits for function 1 to be executed and return the form
export function waitForFormReady() {
  return new Promise(function (resolve) {
    formReadyPromiseResolver = resolve;
  });
}

// Hahdle Errors and submit form
export const handleHubspotForm = (formElement, hsform, sensitive) => {
  // Fill in the inputs
  fillHubSpot(formElement, hsform);

  // Wait for while and check if hsform has any validations and return promise
  return new Promise((resolve) => {
    // Validation
    let isError;

    /*
    // Fallback for Hubspot Validation to happen
    setTimeout(() => {
      // Run the Validation and stop the animation
      isError = mirrorHS(hsform);
      // Resolve the promise with the validation result
      resolve(!isError);
    }, 3000);\
    */

    // For Sensitive Inputs such as email and phone we need to wait for the validation to populate
    if (sensitive) {
      setTimeout(() => {
        isError = mirrorHS(hsform);
        resolve(!isError);
      }, 3000);
    } else {
      isError = mirrorHS(hsform);
      resolve(!isError);
    }
  });
};

// Show loading state
export function toggleLoader(condition) {
  const loader = $('[form-loader]');

  if (condition) {
    loader.find('[data-animation-type="lottie"]').trigger('click');
    loader.fadeIn();
  } else {
    loader.hide();
  }
}

// Declare formReadyPromiseResolver variable
let formReadyPromiseResolver;

// Check for sibling
function hasMatchingSibling(inputElement, selector) {
  // Ensure inputElement is a jQuery object and extract the first DOM element
  const domElement = inputElement[0] || inputElement.get(0);
  if (!domElement) {
    return false;
  }

  const { parentNode } = domElement;
  if (!parentNode) {
    return false;
  }

  return Array.from(parentNode.children).some((sib) => sib !== domElement && sib.matches(selector));
}
