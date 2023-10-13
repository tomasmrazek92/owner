"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // node_modules/.pnpm/uuid@9.0.0/node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/.pnpm/uuid@9.0.0/node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }

  // node_modules/.pnpm/uuid@9.0.0/node_modules/uuid/dist/esm-browser/native.js
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native_default = {
    randomUUID
  };

  // node_modules/.pnpm/uuid@9.0.0/node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default = v4;

  // src/utils/globals.js
  var setInputElementValue = (elementName, value) => {
    $(`input[name=${elementName}]`).val(value);
  };

  // src/utils/localStorage.js
  var getItem = (key) => {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };
  var setItem = (key, value) => {
    const serializedValue = typeof value === "object" ? JSON.stringify(value) : value;
    localStorage.setItem(key, serializedValue);
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

  // src/webgenLead.js
  $(document).ready(() => {
    const OWNER_API = typeof devEnv !== "undefined" && devEnv ? "https://dev-api.owner.com" : "https://api.owner.com";
    const devPage = typeof devEnv !== "undefined" && devEnv ? true : false;
    let userId = getItem("userId");
    if (!userId) {
      userId = v4_default();
      setItem("userId", userId);
    }
    const main = $(".main-wrapper");
    const growthForm = $(".growth-form");
    const growthLoading = $(".growth-loading");
    const growthError = $(".growth-error");
    function showLoading() {
      $(main).add(growthError).add(growthForm).stop().fadeOut(500, function() {
        $(growthLoading).fadeIn(400);
      });
      let steps = $(".growth-loading_step");
      let currentIndex = 0;
      function showNextStep() {
        if (currentIndex < steps.length - 1) {
          steps.eq(currentIndex).fadeOut(1e3, function() {
            currentIndex += 1;
            steps.eq(currentIndex).fadeIn(1e3);
            setTimeout(showNextStep, 4e3);
          });
        }
      }
      steps.hide().eq(currentIndex).show();
      setTimeout(showNextStep, 4e3);
    }
    function showError() {
      $(main).add(growthLoading).add(growthForm).stop().hide();
      $(growthError).stop().fadeIn();
    }
    function getPlaceIdFromObject(object) {
      let restaurantObject2 = getItem(object);
      return restaurantObject2.place_id;
    }
    const postRequest = async (placeId) => {
      const response = await fetch(`${OWNER_API}/generator/v1/generations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ googleId: placeId })
      });
      if (!response.ok)
        console.error("POST request error:", response.status, await response.text());
      return await response.json();
    };
    const getGenerationData = async (id) => {
      const response = await fetch(`${OWNER_API}/generator/v1/generations/${id}`);
      const data = await response.json();
      return data;
    };
    const loggedStatuses = /* @__PURE__ */ new Set();
    const checkGenerationStatus = (generationData) => {
      const { status } = generationData;
      if (!loggedStatuses.has(status)) {
        console.log("Checking Generation Status:", generationData);
        loggedStatuses.add(status);
      }
      return status;
    };
    const generateWeb = async (placeId) => {
      try {
        const { id } = await postRequest(placeId);
        if (!id)
          throw new Error("Invalid ID received from POST request");
        return new Promise((resolve, reject) => {
          const intervalId = setInterval(async () => {
            const generationData = await getGenerationData(id);
            const status = checkGenerationStatus(generationData);
            if (status !== "processing") {
              clearInterval(intervalId);
              if (status !== "success")
                return reject(new Error(status));
              resolve(generationData);
            }
          }, 1e3);
        });
      } catch (err) {
        const status = err.message.includes("error") || err.message.includes("cancelled") ? err.message : "";
        const errorWithStatus = { message: err.message, status };
        return errorWithStatus;
      }
    };
    function logEvent(personID, dataObject, status, errorMessage) {
      const eventVars = dataObject;
      console.log(eventVars);
      if (errorMessage)
        eventVars.location.errorMessage = errorMessage;
      if (typeof FS !== "undefined" && FS) {
        FS.event(status, FS.identify(personID, eventVars));
      }
    }
    function handleSuccess(response, requestBody) {
      console.log("Success:", response);
      let finalURL = response.redirectUri + (devPage ? "" : "&fsUserId=" + userId);
      logEvent(
        userId,
        { location: { requestBody }, generatedUrl: finalURL },
        "Website Generation Successful"
      );
      setTimeout(() => {
        window.location.href = finalURL;
      }, 250);
    }
    function handleError(response, requestBody) {
      console.log("Error:", response);
      showError();
      logEvent(userId, { location: { requestBody } }, "Website Generation Failed", respoonse);
    }
    function handleException(err, requestBody) {
      console.log("Error:", err.message);
      showError();
      logEvent(userId, { location: { requestBody } }, "Website Generation Failed", err.message);
    }
    async function handleAPIcall(requestBody) {
      showLoading();
      try {
        const response = await generateWeb(requestBody);
        if (response && response.status === "success") {
          handleSuccess(response, requestBody);
        } else {
          handleError(response, requestBody);
        }
      } catch (err) {
        handleException(err, requestBody);
      }
    }
    let wfForm = $("#growth-form");
    let hsForm;
    const successSubmit = () => {
      logEvent(
        userId,
        {
          displayName: wfForm.find($("input[name=first-name]")).val() + " " + wfForm.find($("input[name=last-name]")).val(),
          email: wfForm.find($("input[name=email]")).val(),
          firstName: wfForm.find($("input[name=first-name]")).val(),
          lastName: wfForm.find($("input[name=last-name]")).val(),
          phone: wfForm.find($("input[name=cellphone]")).val()
        },
        "Enter Contact Information Successful"
      );
      let requestBody = getPlaceIdFromObject(restaurantObject);
      handleAPIcall(requestBody);
    };
    $("[data-form=generateBtn]").on("click", async function() {
      const isValid = validateInput($("input[name=restaurant-name]"));
      if (!isValid)
        return console.log("Validation Invalid");
      if (devPage) {
        let requestBody2 = getPlaceIdFromObject(restaurantObject);
        handleAPIcall(requestBody2);
        return;
      }
      let requestBody = getPlaceIdFromObject(restaurantObject);
      logEvent(userId, { location: { requestBody } }, "Website Generation Started");
      $(main).fadeOut(500, function() {
        $(growthForm).fadeIn(400);
      });
    });
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
      hear: "how_did_you_hear_about_us",
      page_url: "last_pdf_download"
      // ...
    };
    $("[data-form=submit-btn]").on("click", function(e) {
      e.preventDefault();
      let isValid = true;
      wfForm.find(":input:visible, select").each(function() {
        let validate = validateInput($(this));
        isValid = isValid && validate;
      });
      if (isValid) {
        setInputElementValue("page_url", window.location.pathname);
        fillHubSpot(wfForm, hsForm, inputMapping);
        handleHubspotForm(hsForm);
      }
    });
  });
})();
//# sourceMappingURL=webgenLead.js.map
