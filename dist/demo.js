"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/globals.js
  var setInputElementValue = (elementName, value) => {
    $(`input[name=${elementName}]`).val(value);
  };

  // src/utils/googlePlace.js
  var restaurantObject = "restaurant";
  var checkIfRestaurant = () => {
    const placeObject = JSON.parse(localStorage.getItem(restaurantObject));
    const validTypes = ["bar", "cafe", "bakery", "food", "restaurant"];
    for (let i = 0; i < validTypes.length; i++) {
      if (placeObject.types.includes(validTypes[i])) {
        return true;
      }
    }
    return false;
  };

  // src/utils/formValidations.js
  function validateEmail(input) {
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const isValid = emailReg.test($(input).val());
    toggleValidationMsg($(input), !isValid, "Please fill correct email address.");
    return isValid;
  }
  function validateGooglePlace(input) {
    let isValid = true;
    isValid = checkPlaceType(input);
    return isValid;
  }
  var hasRun = false;
  function checkPlaceType(input) {
    if (hasRun) {
      hasRun = false;
      return true;
    }
    let isValid = checkIfRestaurant();
    if (!isValid) {
      toggleValidationMsg(
        $(input),
        true,
        "Are you sure this is correct? Please update your entry to a recognized restaurant."
      );
    } else {
      toggleValidationMsg($(input), false);
    }
    hasRun = true;
    return isValid;
  }
  function validateSelect(input) {
    let select;
    let searchSelect = $(input).siblings(".select2");
    let niceSelect = $(input).siblings(".nice-select");
    if (searchSelect) {
      select = searchSelect.find(".select2-selection--single");
    } else if (niceSelect) {
      select = $(niceSelect);
    } else {
      select = $(input);
    }
    let isValid = true;
    if ($(input).val() === "") {
      validArr.push(selectVal);
      $(select).addClass("is-invalid");
      isValid = false;
    } else {
      $(select).removeClass("is-invalid");
    }
    return isValid;
  }
  function validateOtherInputs(input) {
    toggleValidationMsg($(input), false);
    return true;
  }
  function handleEmptyRequiredInput(input) {
    if ($(input).attr("name") === "restaurant-name") {
      toggleValidationMsg(
        $(input),
        true,
        "Please select a business location from the search results."
      );
    }
    toggleValidationMsg($(input), true);
    return false;
  }
  var validateInput = (element) => {
    let input = element;
    let isValidAll = true;
    if ($(input).prop("required")) {
      if ($(input).val()) {
        if ($(input).is('[type="email"]')) {
          isValidAll = validateEmail(input);
        } else if ($(input).attr("name") === "restaurant-name") {
          isValidAll = validateGooglePlace(input);
        } else if ($(input).is("select")) {
          isValidAll = validateSelect(input);
        } else {
          isValidAll = validateOtherInputs(input);
        }
      } else {
        isValidAll = handleEmptyRequiredInput(input);
      }
    }
    if (!isValidAll) {
      $(input).addClass("error");
    } else {
      toggleValidationMsg($(input), false);
    }
    return isValidAll;
  };
  var toggleValidationMsg = (element, condition, msg) => {
    const validation = $(element).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");
    const formField = $(element).closest(".form-field, [form-field]");
    formField.toggleClass("error", condition);
    validation.toggle(condition);
    if (msg) {
      validation.text(msg);
    }
  };

  // src/utils/hubspotLogic.js
  var fillHubSpot = (formElement, hsform, mapping) => {
    var $form = $(formElement);
    var hsform = $(hsform);
    Object.keys(mapping).forEach(function(sourceInputName) {
      var targetInputNames = mapping[sourceInputName];
      var $sourceInput = $form.find(
        'input[name="' + sourceInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + '"]'
      );
      if ($sourceInput.length === 0) {
        $sourceInput = $form.find(
          'select[name="' + sourceInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + '"]'
        );
      }
      var inputValue = $sourceInput.val();
      if (!Array.isArray(targetInputNames)) {
        targetInputNames = [targetInputNames];
      }
      targetInputNames.forEach(function(targetInputName) {
        var targetInput = hsform.find(
          "input[name=" + targetInputName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]"
        );
        targetInput.val(inputValue);
        if (["phone", "mobilephone", "email"].includes(targetInputName)) {
          targetInput.get(0).focus();
          targetInput.get(0).blur();
        }
      });
    });
  };
  var mirrorHS = (hsform) => {
    let isError = false;
    var hsPhoneVal = hsform.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text();
    var gtPhoneVal = $('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");
    if (hsPhoneVal) {
      isError = true;
      gtPhoneVal.text(hsPhoneVal);
      gtPhoneVal.show();
    } else {
      gtPhoneVal.hide();
    }
    var hsEmailVal = hsform.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text();
    var gtEmail = $('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");
    if (hsEmailVal) {
      gtEmail.text(hsEmailVal);
      gtEmail.show();
      isError = true;
    } else {
      gtEmail.hide();
    }
    return isError;
  };
  function onFormReadyCallback(form) {
    formReadyPromiseResolver(form);
  }
  function waitForFormReady() {
    return new Promise(function(resolve) {
      formReadyPromiseResolver = resolve;
    });
  }
  var handleHubspotForm = (form) => {
    const button = $('[data-form="submit-btn"]');
    const initText = button.text();
    let isError;
    let animationStep = 0;
    const animationFrames = [".", "..", "..."];
    const updateButtonText = () => {
      const buttonText = `Submitting${animationFrames[animationStep]}`;
      button.text(buttonText);
      animationStep = (animationStep + 1) % animationFrames.length;
    };
    const disableButton = () => {
      button.addClass("disabled");
    };
    const enableButton = () => {
      button.removeClass("disabled").text(initText);
    };
    disableButton();
    const intervalId = setInterval(updateButtonText, 500);
    setTimeout(() => {
      isError = mirrorHS(form);
      clearInterval(intervalId);
      enableButton();
      if (!isError) {
        form.find("input[type=submit]").trigger("click");
      }
    }, 3e3);
  };
  var formReadyPromiseResolver;

  // src/demo.js
  $(document).ready(() => {
    $(".nice-select li").on("click", function() {
      $(".nice-select .current").css("color", "white");
    });
    let wfForm = $("#demo-form");
    let hsForm;
    const successSubmit = () => {
      gtag("event", "ecap", {
        event_category: "lead",
        event_label: "ecap",
        value: 1
      });
      window.location.href = "https://www.owner.com/funnel-demo-requested";
    };
    hbspt.forms.create({
      portalId: "6449395",
      formId: "f3807262-aed3-4b9c-93a3-247ad4c55e60",
      target: "#hbst-form",
      onFormReady: onFormReadyCallback,
      onFormSubmitted: successSubmit
    });
    waitForFormReady().then(function(form) {
      hsForm = $(form);
    });
    const inputMapping = {
      name: ["company", "0-2/name"],
      international_phone_number: ["phone", "0-2/phone"],
      "restaurant-address": ["address", "0-2/address"],
      locality: ["city", "0-2/city"],
      administrative_area_level_1: ["state", "0-2/state"],
      postal_code: ["zip", "0-2/zip"],
      country: ["country", "0-2/country"],
      "first-name": "firstname",
      "last-name": "lastname",
      cellphone: "mobilephone",
      email: "email",
      "person-type": "lead_person_type",
      website: "website",
      place_id: "place_id",
      place_types: ["place_types_contact", "0-2/place_types"],
      rating: "place_rating",
      user_ratings_total: "user_ratings_total",
      "number-of-locations": "of_locations_number",
      hear: "how_did_you_hear_about_us",
      page_url: "last_pdf_download",
      page_lang: "page_lang"
      // ...
    };
    $("[data-form=submit-btn]").on("click", function(e) {
      let button = $(this);
      e.preventDefault();
      let isValid = true;
      wfForm.find(":input:visible, select").each(function() {
        let validate = validateInput($(this));
        isValid = isValid && validate;
      });
      if (isValid) {
        setInputElementValue("page_url", window.location.pathname);
        setInputElementValue("page_lang", $("html").attr("lang"));
        fillHubSpot(wfForm, hsForm, inputMapping);
        handleHubspotForm(hsForm);
      }
    });
    $('select[name="person-type"]').on("change", function() {
      let val = $(this).val();
      if (val === "I'm a restaurant owner or manager") {
        $("#locations-wrap").show();
      } else {
        $("#locations-wrap").hide();
      }
    });
  });
})();
//# sourceMappingURL=demo.js.map
