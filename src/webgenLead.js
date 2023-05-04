import { toggleValidationMsg, validateInput } from '$utils/formValidations';
import { restaurantObject } from '$utils/googlePlace';
import { onFormReadyCallback, waitForFormReady } from '$utils/hubspotLogic';
import { getItem } from '$utils/localStorage';

/* Mapping object
var inputMapping = {}; */

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

console.log(getItem(restaurantObject).website);
function showLoading() {
  // Hide Rest
  $(main, growthError).hide();

  let iframeBox = $('.growth-loading_iframe');
  let iframe = iframeBox.find('iframe');
  let { website } = getItem(restaurantObject);
  let iframeUrl;

  // If
  if (website) {
    if (website.indexOf('http://') >= 0 || website.indexOf('https://') >= 0) {
      iframeUrl = website.replace('http://', 'https://');
    } else {
      iframeUrl = 'https://' + website;
    }
    iframe.attr('src', iframeUrl);
    iframe.on('load', function () {
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
  let restaurantObject = getItem(object);
  return restaurantObject.formatted_address;
}

// Init Form
// waitForFormReady().then(function (hsform) {});

// API
const postRequest = async (address) => {
  const response = await fetch('https://dev-api.owner.com/generator/v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ address }),
  });
  if (!response.ok) console.error('POST request error:', response.status, await response.text());
  return await response.json();
};

const getGenerationData = async (id) => {
  const response = await fetch(`https://dev-api.owner.com/generator/v1/${id}`);
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

const generateWeb = async (address) => {
  try {
    const { id } = await postRequest(address);
    if (!id) {
      throw new Error('Invalid ID received from POST request');
    }

    console.log('Website Generation Started');
    logEvent('Website Generation Started', address);

    let generationData = {};

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        generationData = await getGenerationData(id);
        const status = checkGenerationStatus(generationData);

        if (status === 'error' || status === 'cancelled' || status === 'success') {
          clearInterval(intervalId);
        }

        if (status === 'error' || status === 'cancelled') {
          reject(new Error(status));
        }

        if (status === 'success') {
          console.log('Website Generation Successful', generationData);
          logEvent('Website Generation Successful', address);
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
function logEvent(status, address, errorMessage = '') {
  const eventStatus =
    status === 'success' ? 'Website Generation Successful' : 'Website Generation Failed';
  const eventVars = { location: { address } };
  if (errorMessage) eventVars.location.errorMessage = errorMessage;
  FS.event(eventStatus, FS.setUserVars(eventVars));
}

// Handlers
function handleSuccess(response, requestBody) {
  console.log('Success:', response);
  logEvent('Website Generation Successful', requestBody);
  window.location.href = `https://dev.ordersave.com/partnersite/${response.brandId}`;
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
$('#generateBtn').on('click', async function () {
  const isValid = validateInput($('input[name=restaurant-name]'));
  if (!isValid) return console.log('Validation Invalid');
  showLoading();

  let requestBody = getAddressFromObject(restaurantObject);

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
