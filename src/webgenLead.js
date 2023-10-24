import { v4 as uuidv4 } from 'uuid';

import { validateInput } from '$utils/formValidations';
import { setInputElementValue } from '$utils/globals';
import { restaurantObject } from '$utils/googlePlace';
import {
  fillHubSpot,
  handleHubspotForm,
  onFormReadyCallback,
  waitForFormReady,
} from '$utils/hubspotLogic';
import { getItem, setItem } from '$utils/localStorage';

$(document).ready(() => {
  // Internal Flow Variables
  const OWNER_API =
    typeof devEnv !== 'undefined' && devEnv ? 'https://dev-api.owner.com' : 'https://api.owner.com';

  const devPage = typeof devEnv !== 'undefined' && devEnv ? true : false;

  // check local storage for an existing user ID
  let userId = getItem('userId');

  // if none exists, generate a new one and save it
  if (!userId) {
    userId = uuidv4();
    setItem('userId', userId);
  }

  // Elements
  const main = $('.main-wrapper');
  const growthForm = $('.growth-form');
  const growthLoading = $('.growth-loading');
  const growthError = $('.growth-error');

  function showLoading() {
    // Hide Rest
    $(main)
      .add(growthError)
      .add(growthForm)
      .stop()
      .fadeOut(500, function () {
        $(growthLoading).fadeIn(400);
      });

    // Get steps
    let steps = $('.growth-loading_step');
    let currentIndex = 0;

    function showNextStep() {
      if (currentIndex < steps.length - 1) {
        steps.eq(currentIndex).fadeOut(1000, function () {
          currentIndex += 1;
          steps.eq(currentIndex).fadeIn(1000);
          setTimeout(showNextStep, 4000);
        });
      }
    }

    // Start the loop
    steps.hide().eq(currentIndex).show();
    setTimeout(showNextStep, 4000);
  }

  function showError() {
    $(main).add(growthLoading).add(growthForm).stop().hide();
    $(growthError).stop().fadeIn();
  }

  function getPlaceIdFromObject(object) {
    let restaurantObject = getItem(object);
    return restaurantObject.place_id;
  }

  // API
  const postRequest = async (placeId) => {
    const response = await fetch(`${OWNER_API}/generator/v1/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ googleId: placeId }),
    });
    if (!response.ok) console.error('POST request error:', response.status, await response.text());
    return await response.json();
  };

  const getGenerationData = async (id) => {
    const response = await fetch(`${OWNER_API}/generator/v1/generations/${id}`);
    const data = await response.json();
    return data;
  };

  const loggedStatuses = new Set();

  const checkGenerationStatus = (generationData) => {
    const { status } = generationData;
    if (!loggedStatuses.has(status)) {
      console.log('Checking Generation Status:', generationData);
      loggedStatuses.add(status);
    }
    return status;
  };

  const generateWeb = async (placeId) => {
    try {
      const { id } = await postRequest(placeId);

      if (!id) throw new Error('Invalid ID received from POST request');

      return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
          const generationData = await getGenerationData(id);
          const status = checkGenerationStatus(generationData);

          // Removed the processing clearinterval and add check for "error"
          if (status !== 'processing') {
            clearInterval(intervalId);
            if (status !== 'success') return reject(new Error(status));
            resolve(generationData);
          }
        }, 1000);
      });
    } catch (err) {
      const status =
        err.message.includes('error') || err.message.includes('cancelled') ? err.message : '';
      const errorWithStatus = { message: err.message, status };
      return errorWithStatus;
    }
  };

  // Logs
  function logEvent(personID, dataObject, status, errorMessage) {
    const eventVars = dataObject;
    console.log(eventVars);
    if (errorMessage) eventVars.location.errorMessage = errorMessage;
    if (typeof FS !== 'undefined' && FS) {
      FS.event(status, FS.identify(personID, eventVars));
    }
  }

  // Handlers
  function handleSuccess(response, requestBody) {
    console.log('Success:', response);

    let finalURL = response.redirectUri + (devPage ? '' : '&fsUserId=' + userId);

    logEvent(
      userId,
      { location: { requestBody }, generatedUrl: finalURL },
      'Website Generation Successful'
    );

    // Fix for LogEvent
    setTimeout(() => {
      window.location.href = finalURL;
    }, 250);
  }

  function handleError(response, requestBody) {
    console.log('Error:', response);
    showError();
    logEvent(userId, { location: { requestBody } }, 'Website Generation Failed', respoonse);
  }

  function handleException(err, requestBody) {
    console.log('Error:', err.message);
    showError();
    logEvent(userId, { location: { requestBody } }, 'Website Generation Failed', err.message);
  }

  async function handleAPIcall(requestBody) {
    showLoading();

    try {
      const response = await generateWeb(requestBody);
      if (response && response.status === 'success') {
        handleSuccess(response, requestBody);
      } else {
        handleError(response, requestBody);
      }
    } catch (err) {
      handleException(err, requestBody);
    }
  }

  // -- Forms
  let wfForm = $('#growth-form');
  let hsForm;

  // Handle Submit
  const successSubmit = () => {
    // Update FS event
    // Start the FS journey
    logEvent(
      userId,
      {
        displayName:
          wfForm.find($('input[name=first-name]')).val() +
          ' ' +
          wfForm.find($('input[name=last-name]')).val(),
        email: wfForm.find($('input[name=email]')).val(),
        firstName: wfForm.find($('input[name=first-name]')).val(),
        lastName: wfForm.find($('input[name=last-name]')).val(),
        phone: wfForm.find($('input[name=cellphone]')).val(),
      },
      'Enter Contact Information Successful'
    );

    let requestBody = getPlaceIdFromObject(restaurantObject);
    handleAPIcall(requestBody);
  };

  // Check Restaurant
  $('[data-form=generateBtn]').on('click', async function () {
    // Validate if restaurant
    const isValid = validateInput($('input[name=restaurant-name]'));

    // Show erorr if not
    if (!isValid) return console.log('Validation Invalid');

    // Check for dev page
    if (devPage) {
      let requestBody = getPlaceIdFromObject(restaurantObject);
      handleAPIcall(requestBody);
      return;
    }

    // Start the FS journey
    let requestBody = getPlaceIdFromObject(restaurantObject);
    logEvent(userId, { location: { requestBody } }, 'Website Generation Started');

    // Show the Form
    $(main).fadeOut(500, function () {
      $(growthForm).fadeIn(400);
    });
  });

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
    hear: 'how_did_you_hear_about_us',
    page_url: 'last_pdf_download',

    // ...
  };

  // Submit Action
  $('[data-form=submit-btn]').on('click', function (e) {
    e.preventDefault();

    let isValid = true;

    wfForm.find(':input:visible, select').each(function () {
      let validate = validateInput($(this));
      isValid = isValid && validate;
    });

    if (isValid) {
      setInputElementValue('page_url', window.location.pathname);
      fillHubSpot(wfForm, hsForm, inputMapping);
      handleHubspotForm(hsForm);
    }
  });
});
