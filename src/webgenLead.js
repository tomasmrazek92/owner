import { validateInput } from '$utils/formValidations';
import { restaurantObject } from '$utils/googlePlace';
import { getItem } from '$utils/localStorage';

const OWNER_API = 'https://dev-api.owner.com';

// Elements
const main = $('.main-wrapper');
const growthLoading = $('.growth-loading');
const growthError = $('.growth-error');

/* Hubspot Code
hbspt.forms.create({
  region: 'na1',
  portalId: '6449395',
  target: '.hbs-form',
  formId: 'b855c0bc-befa-48a3-97a8-008570dfce2f',
  onFormReady: onFormReadyCallback,
});
*/

function showLoading() {
  // Hide Rest
  $(main, growthError).fadeOut(500, function () {
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
        setTimeout(showNextStep, 8000);
      });
    }
  }

  // Start the loop
  steps.hide().eq(currentIndex).show();
  setTimeout(showNextStep, 8000);
}

function showError() {
  $(main, growthLoading).hide();
  $(growthError).fadeIn();
}

function getPlaceIdFromObject(object) {
  let restaurantObject = getItem(object);
  return restaurantObject.place_id;
}

// Init Form
// waitForFormReady().then(function (hsform) {});

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
    if (!id) {
      throw new Error('Invalid ID received from POST request');
    }

    console.log('Website Generation Started');
    logEvent('Website Generation Started', placeId);

    let generationData = {};

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        generationData = await getGenerationData(id);
        const status = checkGenerationStatus(generationData);

        if (status !== 'processing') {
          clearInterval(intervalId);
        }

        if (status !== 'success') {
          reject(new Error(status));
        } else {
          console.log('Website Generation Successful', generationData);
          logEvent('Website Generation Successful', placeId);
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
function logEvent(status, place_id, errorMessage = '') {
  const eventStatus =
    status === 'success' ? 'Website Generation Successful' : 'Website Generation Failed';
  const eventVars = { location: { place_id } };
  if (errorMessage) eventVars.location.errorMessage = errorMessage;
  FS.event(eventStatus, FS.setUserVars(eventVars));
}

// Handlers
function handleSuccess(response, requestBody) {
  console.log('Success:', response);
  logEvent('Website Generation Successful', requestBody);
  window.location.href = response.redirectUri;
}

function handleError(response, requestBody) {
  console.log('Error:', response);
  showError();
  logEvent('Website Generation Failed', requestBody);
}

function handleException(err, requestBody) {
  console.log('Error:', err.message);
  showError();
  logEvent('error', requestBody);
}

// Action
$('[data-form=generateBtn]').on('click', async function () {
  const isValid = validateInput($('input[name=restaurant-name]'));
  if (!isValid) return console.log('Validation Invalid');
  showLoading();

  let requestBody = getPlaceIdFromObject(restaurantObject);
  console.log(requestBody);

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
});
