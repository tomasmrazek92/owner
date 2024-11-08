import { checkIfRestaurant } from '$utils/googlePlace';

// Email Validation
function validateEmail(input) {
  const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  const isValid = emailReg.test($(input).val());
  toggleValidationMsg($(input), !isValid, 'Please fill correct email address.');

  return isValid;
}

// Validate Google Place
function validateGooglePlace(input) {
  let isValid = true;

  isValid = checkPlaceType(input);

  return isValid;
}

// Validate CheckPlaceType
function checkPlaceType(input) {
  let isValid = checkIfRestaurant();

  if (!isValid) {
    toggleValidationMsg($(input), true);
  } else {
    toggleValidationMsg($(input), false);
  }
  return isValid;
}

// Validate Selects
function validateSelect(input) {
  let select;

  // Check for custom selects
  let searchSelect = $(input).siblings('.select2');
  let niceSelect = $(input).siblings('.nice-select');
  if (searchSelect) {
    select = searchSelect.find('.select2-selection--single');
  } else if (niceSelect) {
    select = $(niceSelect);
  } else {
    select = $(input);
  }

  let isValid = true;

  if ($(input).val() === '') {
    validArr.push(selectVal);
    $(select).addClass('is-invalid');
    isValid = false;
  } else {
    $(select).removeClass('is-invalid');
  }

  return isValid;
}

// Validate Other Inputs
function validateOtherInputs(input) {
  toggleValidationMsg($(input), false);
  return true;
}

// Hangle Empty Inputs
function handleEmptyRequiredInput(input) {
  if ($(input).attr('name') === 'restaurant-name') {
    toggleValidationMsg(
      $(input),
      true,
      'Please select a business location from the search results.'
    );
  }
  toggleValidationMsg($(input), true);
  return false;
}

// Input Validation
export const validateInput = (element) => {
  let input = element;
  let isValidAll = true;

  if ($(input).prop('required')) {
    if ($(input).val()) {
      if ($(input).is('[type="email"]')) {
        isValidAll = validateEmail(input);
      } else if ($(input).attr('name') === 'restaurant-name') {
        isValidAll = validateGooglePlace(input);
      } else if ($(input).is('select')) {
        isValidAll = validateSelect(input);
      } else {
        isValidAll = validateOtherInputs(input);
      }
    } else {
      isValidAll = handleEmptyRequiredInput(input);
    }
  }
  if (!isValidAll) {
    $(input).addClass('error');
  } else {
    toggleValidationMsg($(input), false);
  }

  return isValidAll;
};

// Show/Hide Validation Message
export const toggleValidationMsg = (element, condition, msg) => {
  const validation = $(element)
    .closest('.form-field-wrapper, [field-wrapper]')
    .find('.field-validation, [field-validation]');
  const formField = $(element).closest('.form-field, [form-field]');

  formField.toggleClass('error', condition);
  validation.toggle(condition);
  if (msg) {
    validation.text(msg);
  }
};

// Check for Checkboxes and Radio Buttons
export const validateCheckboxRadio = (elements) => {
  if (!elements.length) return true;

  const atLeastOneChecked = elements.is(':checked');
  const firstGroupItem = elements.first();
  const closestWrapper = firstGroupItem.closest('.form-field-wrapper');

  if (!atLeastOneChecked) {
    toggleValidationMsg(closestWrapper, true);
    return false;
  }
  toggleValidationMsg(closestWrapper, false);
  return true;
};

// Validation Flag
export const validationCalled = new Set();
