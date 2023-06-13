import { toggleValidationMsg } from '$utils/formValidations';

// --- Fill HubSpot Forms
export const fillHubSpot = (formElement, hsform, mapping) => {
  var $form = $(formElement);
  var hsform = $(hsform);
  console.log(hsform);

  // Collect data from the form
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

    // If targetInputNames is not an array, wrap it in an array
    if (!Array.isArray(targetInputNames)) {
      targetInputNames = [targetInputNames];
    }

    // Set the values for the target form (hsform)
    targetInputNames.forEach(function (targetInputName) {
      var targetInput = hsform.find(
        'input[name=' + targetInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ']'
      );

      targetInput.val(inputValue);

      // Perform focus and blur actions only for matched target input names
      if (['phone', 'mobilephone', 'email'].includes(targetInputName)) {
        targetInput.get(0).focus();
        targetInput.get(0).blur();
      }
    });
  });
};

// --- Mirror HubSpot Error Messages ---
export const mirrorHS = (hsform) => {
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

// Declare formReadyPromiseResolver variable
let formReadyPromiseResolver;
