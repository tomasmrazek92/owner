var test;
const getPlaceFromSessionStorage = () => {
  const value = localStorage.getItem('restaurant');
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

const setGooglePlaceDataToForm = (googlePlace) => {
  if (googlePlace) {
    var componentForm = {
      name: '',
      international_phone_number: '',
      website: '',
      place_id: '',
      rating: '',
      user_ratings_total: '',
      address_components: {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'short_name',
        postal_code: 'short_name',
      },
    };
    // Get All Address Info
    if (googlePlace.address_components) {
      for (var i = 0; i < googlePlace.address_components.length; i++) {
        var addressType = googlePlace.address_components[i].types[0];
        var type = componentForm.address_components[addressType];
        var input = $('input[name=' + addressType + ']');
        input.val('');
        var val = googlePlace.address_components[i][type];
        if (type) {
          // Check for Address Name and Number
          if (addressType == 'route' || addressType == 'street_number') {
            if (addressType == 'route') {
              var route = val;
            } else if (addressType == 'street_number') {
              var streetNumber = val;
            }
            var address = $('input[name=restaurant-address');
            address.val(streetNumber + ' ' + route);
          } else {
            // Everything Else
            input.val(val);
          }
        }
      }
    }

    // set types
    if (googlePlace.types) {
      const typesAsString = googlePlace.types.join(', ');
      var address = $('input[name=place_types').val(typesAsString);
    }

    // Get Everything Else
    $.each(componentForm, function (key) {
      var value = googlePlace[key];
      var input = $('input[name=' + key + ']');
      input.val('');
      if (key == 'address_components') {
        return;
      }
      if (input) {
        input.val(value);
      }
    });
  }
};

var placeChanged = false;
var alertInit = false;
$(document).ready(function () {
  // set place from previous page
  const googlePlaceFromStorage = getPlaceFromSessionStorage();
  if (googlePlaceFromStorage) {
    setGooglePlaceDataToForm(googlePlaceFromStorage);
    $('input[name="restaurant-name"]').val(localStorage.getItem('restaurant-value'));
    placeChanged = true;
    alertInit = false;
  }

  var gpaOptions = {
    componentRestrictions: { country: 'us' },
  };

  var gpaInput = $('input[name="restaurant-name"]');
  gpaInput.each(function () {
    const autocomplete = new google.maps.places.Autocomplete(this, gpaOptions);
    var self = $(this);
    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();
      const value = self.val();
      setGooglePlaceDataToForm(place);
      localStorage.setItem('restaurant-value', value);
      localStorage.setItem('restaurant', JSON.stringify(place));
      $('input[name="restaurant-name"]').val(localStorage.getItem('restaurant-value'));
      $('input[name="restaurant-name"]').siblings('.field-validation').hide();
      placeChanged = true;
      alertInit = false;
    });
  });
});

// MultiStep Form
var form = $('[data-form="multistep"]');
form.each(function () {
  // Vars
  var self = $(this);
  var x = 0;
  var curStep = 0;
  var steps = $(self).find('[data-form="step"]');
  var progressbarClone = $(self).find('[data-form="progress-indicator"]').clone();
  var progressbar;
  var fill = false;

  // Initial Clear
  $(self).find('.field-validation').hide();
  $(progressbarClone).removeClass('current');
  $(self).find('[data-form="progress"]').children().remove();
  $(self)
    .find('[data-text="total-steps"]')
    .text($(self).find('[data-form="step"]:not([data-card="true"])').length);
  $(self).find('[data-form="submit-btn"]').hide();
  $(self).find('[data-text="current-step"]').text('0');
  $(self).find(steps[x]).data('card') ? (curStep = curStep + 0) : (curStep = curStep + 1);
  steps.hide();

  function updateStep(form) {
    // Progress
    $(self).find('[data-form="custom-progress-indicator"]').removeClass('current');
    $(self).find($('[data-form="custom-progress-indicator"]')[x]).addClass('current');
    $(steps[x]).find(':input').trigger('input');

    //hide unhide steps
    steps.hide();
    $(steps[x]).fadeIn('slow');
    $(progressbar[x]).addClass('current');
    document.dispatchEvent(new Event('readystatechange'));

    //hide unhide button
    if (x === 0) {
      $(self).find('[data-form="next-btn"]').show();
      $(self).find('[data-form="back-btn"]').hide();
      $(self).find('[data-form="submit-btn"]').hide();
      if (!$(self).find('[data-form="next-btn"]').length) {
        $(self).find('[data-form="submit-btn"]').show();
      }
    } else if (x === steps.length - 1) {
      $(self).find('[data-form="next-btn"]').hide();
      $(self).find('[data-form="submit-btn"]').show();
      $(self).find('[data-form="back-btn"]').show();
    } else {
      $(self).find('[data-form="next-btn"]').show();
      $(self).find('[data-form="back-btn"]').show();
      $(self).find('[data-form="submit-btn"]').hide();
    }
  }

  function validation(form) {
    var inputValidate = true;
    var emailPass = true;
    var placeValidation = 'Please select a business location from the search results.';
    $(steps[x])
      .find(':input:visible,select')
      .each(function () {
        if ($(this).prop('required')) {
          var validation = $(this).siblings('.field-validation');
          if (!$(this).val() == '') {
            // check for email
            if ($(this).is('[type="email"]')) {
              var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
              if (!emailReg.test($(this).val())) {
                validation.show();
                $(this).siblings('.field-validation').text('Please fill correct email address.');
                inputValidate = false;
              } else {
                validation.hide();
              }
            }
            // check Google Place
            else if ($(this).attr('name') == 'restaurant-name') {
              if (!placeChanged) {
                $(this).siblings('#restaurant-help').hide();
                validation.show();
                validation.text(placeValidation);
                inputValidate = false;
                alertInit = false;
              }
              // Check for type
              var typesInput = $('.demo-form input[name=place_types]').val();
              var typesArr = typesInput.split(', ');

              if (!typesArr.includes('restaurant')) {
                if (!alertInit) {
                  validation.text(
                    'Are you sure this is correct? Please update your entry to a recognized restaurant.'
                  );
                  validation.show('fasts');
                  $(this).siblings('#restaurant-help').hide();
                  inputValidate = false;
                  alertInit = true;
                }
              } else {
                validation.hide();
              }
            }
            // other inputs
            else {
              validation.hide();
            }
          } else {
            if ($(this).attr('name') == 'restaurant-name') {
              validation.text(placeValidation);
              console.log(placeValidation);
              alertInit = false;
            }
            validation.show();
            inputValidate = false;
          }
        }
      });

    // Pass Email
    var blacklistInput = hsform.find('input[name=blacklist]').val();
    var blackArr = blacklistInput.split(',');
    var emailVal = $('.demo-form input[type=email]').val();

    if (blackArr.includes(emailVal) && inputValidate) {
      console.log('Includes');
      inputValidate = false;
      emailPass = false;
      $('form[name=wf-form-Get-A-Free-Demo-Form]').trigger('submit');
    }

    return inputValidate;
  }

  // Buttons
  function nextStep() {
    if (x < steps.length - 1) {
      // validation();
    }
    $(self)
      .find('[data-text="current-step"]')
      .text($(steps[x]).data('card') ? (curStep = curStep + 0) : (curStep = curStep + 1));
  }

  function backStep() {
    if (x > 0) {
      $(progressbar[x]).removeClass('current');
      x--;
      updateStep();
    }
    $(self)
      .find('[data-text="current-step"]')
      .text((curStep = curStep - 1));
  }

  // Clicks
  $(self)
    .find('[data-form="next-btn"]')
    .on('click', function () {
      nextStep();
    });
  $(self)
    .find('[data-form="back-btn"]')
    .on('click', function () {
      backStep();
    });

  $(self)
    .find('[data-form="submit-btn"]')
    .on('click', function (e) {
      let button = $(this);

      e.preventDefault();

      let isValid = validation();

      if (isValid) {
        fillHubSpot();
        hsform.find('input[type=submit]').trigger('click');
        console.log('HS SUBMIT');
        // set button to disabled
        let initText = $('[data-form="submit-btn"]').val();
        button.val('Submitting');
        button.addClass('disabled');
        button.attr('type', 'disabled');
        setTimeout(function () {
          mirrorHS();
          // set button back to normal
          button.val(initText);
          button.removeClass('disabled');
          button.attr('type', 'submit');
        }, 3000);
      }
    });

  // Progress
  steps.each(function () {
    $(self).closest(form).find('[data-form="progress"]').append(progressbarClone.clone());
  });
  progressbar = $(self).find('[data-form="progress"]').children();

  updateStep();
});

function fillHubSpot() {
  var $form = $('[data-form="multistep"]:visible');

  var restaurantname = $form.find('input[name=restaurant-name]').val();
  var name = $form.find('input[name=name]').val();
  var phone = $form.find('input[name=international_phone_number]').val();
  var address = $form.find('input[name=restaurant-address]').val();
  var city = $form.find('input[name=locality]').val();
  var state = $form.find('input[name=administrative_area_level_1]').val();
  var zipcode = $form.find('input[name=postal_code]').val();
  var country = $form.find('input[name=country]').val();
  var firstname = $form.find('input[name=first-name]').val();
  var lastname = $form.find('input[name=last-name]').val();
  var cellphone = $form.find('input[name=cellphone]').val();
  var email = $form.find('input[name=email]').val();
  var userType = $form.find('select[name=person-type]').val();
  var website = $form.find('input[name=website]').val();
  var placeId = $form.find('input[name=place_id]').val();
  var placeTypes = $form.find('input[name=place_types]').val();
  var rating = $form.find('input[name=rating]').val();
  var userRating = $form.find('input[name=user_ratings_total]').val();
  var hearFrom = $form.find('select[name=hear]').val();
  var pageUrl = window.location.pathname;

  // Company Info
  hsform.find('input[name="0-2/name"]').val(name);
  hsform.find('input[name="0-2/phone"]').val(phone);
  hsform.find('input[name="0-2/address"]').val(address);
  hsform.find('input[name="0-2/city"]').val(city);
  hsform.find('input[name="0-2/state"]').val(state);
  hsform.find('input[name="0-2/zip"]').val(zipcode);
  hsform.find('input[name="0-2/country"]').val(country);
  hsform.find('input[name="website"]').val(website);
  hsform.find('input[name="place_id"]').val(placeId);
  hsform.find('input[name="0-2/place_types"]').val(placeTypes);
  hsform.find('input[name="place_rating"]').val(rating);
  hsform.find('input[name="user_ratings_total"]').val(userRating);

  // User
  hsform.find('input[name="firstname"]').val(firstname);
  hsform.find('input[name="lastname"]').val(lastname);
  hsform.find('input[name="mobilephone"]').val(phone);
  hsform.find('input[name="address"]').val(address);
  hsform.find('input[name="city"]').val(city);
  hsform.find('input[name="state"]').val(state);
  hsform.find('input[name="zip"]').val(zipcode);
  hsform.find('input[name="country"]').val(country);
  hsform.find('input[name="place_types_contact"]').val(placeTypes);
  hsform.find('input[name="lead_person_type"]').val(userType);
  hsform.find('input[name=how_did_you_hear_about_us]').val(hearFrom);

  // Extra
  hsform.find('input[name="last_pdf_download"]').val(pageUrl);

  var hsphone = hsform.find('input[name="phone"]');
  hsphone.val(phone);
  hsphone.get(0).focus();
  hsphone.get(0).blur();

  var hsphone = hsform.find('input[name="mobilephone"]');
  hsphone.val(cellphone);
  hsphone.get(0).focus();
  hsphone.get(0).blur();

  var hsemail = hsform.find('input[name="email"]');
  hsemail.val(email);
  hsemail.get(0).focus();
  hsemail.get(0).blur();

  hsform.find('input[name="company"]').val(name);
}

function mirrorHS() {
  let isError = false;

  // HS Phone
  var hsPhoneVal = hsform
    .find('input[name=mobilephone]')
    .parent()
    .siblings('.hs-error-msgs')
    .find('.hs-error-msg')
    .text();
  var gtPhoneVal = $('input[name="cellphone"]').siblings('.field-validation');
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
  var gtEmail = $('input[name="email"]').closest('.form-field').find('.field-validation');
  if (hsEmailVal) {
    gtEmail.text(hsEmailVal);
    gtEmail.show();
    isError = true;
  } else {
    gtEmail.hide();
  }
  console.log('HS MIRROR error', isError);
  return isError;
}
