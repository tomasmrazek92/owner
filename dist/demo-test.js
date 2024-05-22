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
        if (targetInput.attr("type") === "checkbox") {
          if (String(inputValue).toLowerCase() === "true") {
            targetInput.prop("checked", true);
          } else {
            targetInput.prop("checked", false);
          }
        } else if (hasMatchingSibling(targetInput, ".hs-datepicker")) {
          targetInput.siblings("input[readonly]").val(inputValue).change();
        } else {
          targetInput.val(inputValue);
        }
        if (["phone", "mobilephone", "email", "pred_gmv"].includes(targetInputName)) {
          targetInput.get(0).focus({ preventScrol: true });
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
    let isError;
    const disableButton = () => {
      button.addClass("disabled");
    };
    const enableButton = () => {
      button.removeClass("disabled");
    };
    toggleLoader(true);
    disableButton();
    setTimeout(() => {
      isError = mirrorHS(form);
      enableButton();
      if (!isError) {
        form[0].submit();
      } else {
        toggleLoader(false);
      }
    }, 3e3);
  };
  function toggleLoader(condition) {
    const loader = $(".n_demo-form_loading");
    if (condition) {
      loader.find('[data-animation-type="lottie"]').trigger("click");
      loader.fadeIn();
    } else {
      loader.hide();
    }
  }
  var formReadyPromiseResolver;
  function hasMatchingSibling(inputElement, selector) {
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

  // src/demo-test.js
  $(document).ready(() => {
    let qualified;
    let userId = getItem("userId");
    if (!userId) {
      userId = v4_default();
      setItem("userId", userId);
    }
    console.log(userId);
    function logEvent(personID, dataObject, status, errorMessage) {
      const eventVars = dataObject;
      console.log(eventVars);
      if (errorMessage)
        eventVars.location.errorMessage = errorMessage;
      if (typeof FS !== "undefined" && FS) {
        FS.event(status, FS.identify(personID, eventVars));
      }
    }
    const getRestaurant = () => {
      let restaurant = getItem("restaurant");
      return restaurant;
    };
    function checkQualification() {
      return new Promise((resolve, reject) => {
        try {
          qualified = false;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }
    function callQualification() {
      let restaurant = getRestaurant();
      let data = {
        name: restaurant.name,
        address: restaurant.formatted_address,
        website: restaurant.website,
        email: "jonathan@owner.com",
        token: "AJXuyxPXgGF68NMv",
        sfdc_id: "None"
      };
      let response;
      function callApi(data2) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: "https://owner-ops.net/business-info/",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data2),
            timeout: 15e3,
            success: function(response2) {
              resolve(response2);
            },
            error: function(xhr, status, error) {
              if (status === "timeout") {
                console.log("Error occurred:", error);
                setInputElementValue("execution_time_seconds", 15);
                setInputElementValue("gmv_pred", 0);
                resolve("");
              } else {
                console.log("Error occurred:", error);
                resolve("");
              }
            }
          });
        });
      }
      return callApi(data).then((response2) => {
        console.log(response2);
        return response2[0];
      }).catch((error) => {
        console.error("Error:", error);
        return false;
      });
    }
    function fillFormWithMatchingData(apiData, flag) {
      const inputs = $("#demo-form input");
      const allowedKeys = [
        "brizo_id",
        "base_enrich_date",
        "inbound_add_to_cadence",
        "execution_time_seconds",
        "auto_dq_flag",
        "auto_dq_reason",
        "gmv_pred",
        "inbound_add_to_cadence"
      ];
      if (flag) {
        inputs.each(function() {
          const inputName = $(this).attr("name");
          if (allowedKeys.includes(inputName) && apiData.hasOwnProperty(inputName)) {
            var value = apiData[inputName];
            if (typeof value === "number" || !isNaN(value) && !isNaN(parseFloat(value))) {
              $(this).val(Number(value).toFixed(2));
            } else {
              $(this).val(value);
            }
          }
        });
      } else {
        fillStaticAPIFields(false);
      }
    }
    function internalValidation() {
      let isValid = true;
      wfForm.find(":input:visible, select").each(function() {
        let validate = validateInput($(this));
        isValid = isValid && validate;
      });
      return isValid;
    }
    function fillStaticAPIFields(type) {
      setInputElementValue("base_enrich_date", (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
      setInputElementValue("inbound_add_to_cadence", "true");
      if (type) {
        setInputElementValue("execution_time_seconds", 0);
        setInputElementValue("auto_dq_flags", "true");
      }
      if (type === true) {
        setInputElementValue("auto_dq_reason", "none");
        setInputElementValue("auto_dq_flags", "false");
      }
    }
    function fillCustomFields() {
      setInputElementValue("page_url", window.location.pathname);
      setInputElementValue("page_lang", $("html").attr("lang"));
      setInputElementValue(
        "url",
        (() => {
          var restaurant = getRestaurant();
          var cidLink = restaurant.url;
          return cidLink.split("cid=")[1];
        })()
      );
    }
    async function processQualificationAndForm() {
      let validation = internalValidation();
      if (validation) {
        toggleLoader(true);
        try {
          await checkQualification();
          if (typeof qualified !== "boolean") {
            const result = await callQualification();
            const dqFlag = result.auto_dq_flag;
            if (typeof dqFlag === "string") {
              qualified = result.auto_dq_flag === "True" ? false : true;
              fillFormWithMatchingData(result, true);
            } else {
              qualified = false;
              fillFormWithMatchingData(result, false);
            }
          } else {
          }
        } catch (error) {
          qualified = false;
          console.log("Qualification check or call failed:", error);
        }
        fillCustomFields();
        fillHubSpot(wfForm, hsForm, inputMapping);
        handleHubspotForm(hsForm);
      }
    }
    function fireSubmit() {
      processQualificationAndForm();
    }
    const successSubmit = () => {
      const success = $(".n_demo-form_success");
      toggleLoader(false);
      wfForm.hide();
      success.show();
      window.location.href = qualified ? "https://meetings.hubspot.com/brandon767/sales-inbound-round-robin" : "https://www.owner.com/funnel-demo-requested";
    };
    let wfForm = $("#demo-form");
    let hsForm;
    hbspt.forms.create({
      portalId: "6449395",
      formId: "f3807262-aed3-4b9c-93a3-247ad4c55e60",
      target: "#hbst-form",
      onFormReady: onFormReadyCallback,
      onFormSubmit: () => {
        growsumo.data.name = wfForm.find('input[name="name"]').val();
        growsumo.data.email = wfForm.find('input[name="email"]').val();
        growsumo.data.customer_key = wfForm.find('input[name="email"]').val();
        growsumo.createSignup();
      },
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
      url: "place_cid",
      place_types: ["place_types_contact", "0-2/place_types"],
      rating: "place_rating",
      user_ratings_total: "user_ratings_total",
      "number-of-locations": "of_locations_number",
      hear: "how_did_you_hear_about_us",
      page_url: "last_pdf_download",
      page_lang: "page_lang",
      brizo_id: ["brizo_id", "0-2/brizo_id_account"],
      base_enrich_date: ["auto_enrich_date", "0-2/auto_enrich_date_company"],
      inbound_add_to_cadence: "inbound_add_to_cadence",
      execution_time_seconds: "auto_enrich_time",
      auto_dq_flag: "auto_dq_static",
      auto_dq_reason: ["auto_dq_reason", "0-2/auto_dq_reason_company"],
      gmv_pred: ["pred_gmv", "0-2/pred_gmv_company"]
      // ...
    };
    $("[data-form=submit-btn]").on("click", fireSubmit);
    $(".nice-select li").on("click", function() {
      $(".nice-select .current").css("color", "white");
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
//# sourceMappingURL=demo-test.js.map
