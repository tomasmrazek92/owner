"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/localStorage.js
  var getItem = (key) => {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
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
          isValid = validateSelect(input);
        } else {
          isValidAll = validateOtherInputs(input);
        }
      } else {
        isValidAll = handleEmptyRequiredInput(input);
      }
    }
    if (!isValidAll) {
      $(input).addClass("error");
    }
    return isValidAll;
  };
  function validateEmail(input) {
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const isValid2 = emailReg.test($(input).val());
    toggleValidationMsg($(input), !isValid2, "Please fill correct email address.");
    return isValid2;
  }
  function validateGooglePlace(input) {
    let isValid2 = true;
    isValid2 = checkPlaceType(input);
    return isValid2;
  }
  var hasRun = false;
  function checkPlaceType(input) {
    if (hasRun) {
      return true;
    }
    let isValid2 = checkIfRestaurant();
    if (!isValid2) {
      toggleValidationMsg(
        $(input),
        true,
        "Are you sure this is correct? Please update your entry to a recognized restaurant."
      );
    } else {
      toggleValidationMsg($(input), false);
    }
    hasRun = true;
    return isValid2;
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
    let isValid2 = true;
    if ($(input).val() === "") {
      validArr.push(selectVal);
      $(select).addClass("is-invalid");
      isValid2 = false;
    } else {
      $(select).removeClass("is-invalid");
    }
    return isValid2;
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
  var toggleValidationMsg = (element, condition, msg) => {
    const validation = $(element).closest(".form-field-wrapper").find(".field-validation");
    const formField = $(element).closest(".form-field");
    formField.toggleClass("error", condition);
    validation.toggle(condition);
    if (msg) {
      validation.text(msg);
    }
  };

  // src/webgenLead.js
  var main = $(".main-wrapper");
  var growthLoading = $(".growth-loading");
  var growthError = $(".growth-error");
  console.log(getItem(restaurantObject).website);
  function showLoading() {
    $(main, growthError).hide();
    let iframeBox = $(".growth-loading_iframe");
    let iframe = iframeBox.find("iframe");
    let { website } = getItem(restaurantObject);
    let iframeUrl;
    if (website) {
      if (website.indexOf("http://") >= 0 || website.indexOf("https://") >= 0) {
        iframeUrl = website.replace("http://", "https://");
      } else {
        iframeUrl = "https://" + website;
      }
      iframe.attr("src", iframeUrl);
      iframe.on("load", function() {
        iframeBox.show();
      });
    } else {
      iframeBox.hide();
    }
    $(growthLoading).fadeIn();
  }
  function showError() {
    $(main, growthLoading).hide();
    $(growthError).fadeIn();
  }
  function getAddressFromObject(object) {
    let restaurantObject2 = getItem(object);
    return restaurantObject2.formatted_address;
  }
  var postRequest = async (address) => {
    const response = await fetch("https://dev-api.owner.com/generator/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ address })
    });
    if (!response.ok)
      console.error("POST request error:", response.status, await response.text());
    return await response.json();
  };
  var getGenerationData = async (id) => {
    const response = await fetch(`https://dev-api.owner.com/generator/v1/${id}`);
    const data = await response.json();
    return data;
  };
  var loggedStatuses = /* @__PURE__ */ new Set();
  var checkGenerationStatus = (generationData) => {
    const { status } = generationData;
    if (!loggedStatuses.has(status)) {
      console.log("Checking Generation Status:", generationData);
      loggedStatuses.add(status);
    }
    return status;
  };
  var generateWeb = async (address) => {
    try {
      const { id } = await postRequest(address);
      if (!id) {
        throw new Error("Invalid ID received from POST request");
      }
      console.log("Website Generation Started");
      logEvent("Website Generation Started", address);
      let generationData = {};
      return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
          generationData = await getGenerationData(id);
          const status = checkGenerationStatus(generationData);
          if (status === "error" || status === "cancelled" || status === "success") {
            clearInterval(intervalId);
          }
          if (status === "error" || status === "cancelled") {
            reject(new Error(status));
          }
          if (status === "success") {
            console.log("Website Generation Successful", generationData);
            logEvent("Website Generation Successful", address);
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
  function logEvent(status, address, errorMessage = "") {
    const eventStatus = status === "success" ? "Website Generation Successful" : "Website Generation Failed";
    const eventVars = { location: { address } };
    if (errorMessage)
      eventVars.location.errorMessage = errorMessage;
    FS.event(eventStatus, FS.setUserVars(eventVars));
  }
  function handleSuccess(response, requestBody) {
    console.log("Success:", response);
    logEvent("Website Generation Successful", requestBody);
    window.location.href = `https://dev.ordersave.com/partnersite/${response.brandId}`;
  }
  function handleError(response, requestBody) {
    console.log("Error:", response);
    showError();
    logEvent("Website Generation Failed", requestBody);
  }
  function handleException(err, requestBody) {
    console.log("Error:", err.message);
    showError();
    logEvent("error", requestBody);
  }
  $("#generateBtn").on("click", async function() {
    const isValid2 = validateInput($("input[name=restaurant-name]"));
    if (!isValid2)
      return console.log("Validation Invalid");
    showLoading();
    let requestBody = getAddressFromObject(restaurantObject);
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
  });
})();
//# sourceMappingURL=webgenLead.js.map
