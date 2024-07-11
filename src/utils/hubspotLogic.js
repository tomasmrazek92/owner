// --- Fill HubSpot Forms
export const fillHubSpot = (formElement, hsform, mapping) => {
  var $form = $(formElement);
  var hsform = $(hsform);

  // Collect data from the form
  Object.keys(mapping).forEach(function (sourceInputName) {
    var targetInputNames = mapping[sourceInputName];
    // Look for Input
    var $sourceInput = $form.find(
      'input[name="' + sourceInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '"]'
    );
    // Otherwise look for select
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

      // Check if Checkbox
      if (targetInput.attr('type') === 'checkbox') {
        if (String(inputValue).toLowerCase() === 'true') {
          targetInput.prop('checked', true);
        } else {
          targetInput.prop('checked', false);
        }
      } else if (hasMatchingSibling(targetInput, '.hs-datepicker')) {
        targetInput.siblings('input[readonly]').val(inputValue).change();
      } else {
        targetInput.val(inputValue);
      }

      // Perform focus and blur actions for required items
      if (['phone', 'mobilephone', 'email', 'pred_gmv'].includes(targetInputName)) {
        targetInput.get(0).focus({ preventScrol: true });
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

// Hahdle Errors and submit form
export const handleHubspotForm = (form) => {
  // Elems
  const button = $('[data-form="submit-btn"]');

  // Validation
  let isError;

  // Button States
  const disableButton = () => {
    button.addClass('disabled');
  };
  const enableButton = () => {
    button.removeClass('disabled');
  };

  toggleLoader(true);
  disableButton();

  // Fallback for Hubspot Validation to happen
  setTimeout(() => {
    // Run the Validation and stop the animation
    isError = mirrorHS(form);
    enableButton();

    // Check condition and submit the form otherwise
    if (!isError) {
      form[0].submit();
    } else {
      toggleLoader(false);
    }
  }, 3000);
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
