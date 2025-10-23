import { validateInput } from '$utils/formValidations';
import { getInputElementValue, locationType, setInputElementValue } from '$utils/globals';
import {
  handleHubspotForm,
  onFormReadyCallback,
  toggleLoader,
  waitForFormReady,
} from '$utils/hubspotLogic';
import { getItem, setItem } from '$utils/localStorage';
import { getParamsFromSession } from '$utils/utms';

const timer = (() => {
  const logs = [];
  let lastTime = 0;
  let startTime = 0;
  let globalIndex = 0;
  let isPaused = true;
  let totalPausedTime = 0;
  let pauseStartTime = 0;

  const logToConsole = (type, index, label, stepTime, actualTotalTime, data) => {
    if (
      localStorage.getItem('isStagingForMe') === 'true' ||
      window.location.origin.includes('webflow.io')
    ) {
      if (type === 'event') {
        console.log(
          `[Event #${index}]: ${label}: ${stepTime.toFixed(
            2
          )}ms (active time: ${actualTotalTime.toFixed(2)}ms)`
        );
        if (data && Object.keys(data).length > 0) {
          console.log('  Data:', data);
        }
      } else if (type === 'pause') {
        console.log('[Timer]: Paused');
      } else if (type === 'resume') {
        console.log('[Timer]: Resumed');
      } else if (type === 'table') {
        console.table(logs);
      }
    }
  };

  return {
    log: (label, data) => {
      const now = performance.now();

      if (!startTime) {
        startTime = now;
        lastTime = now;
        globalIndex = 1;
        logs.push({ label, step: 0, total: 0, index: globalIndex, data });

        logToConsole('event', globalIndex, label, 0, 0, data);
        return;
      }

      globalIndex++;

      let actualTotalTime = now - startTime - totalPausedTime;
      if (isPaused && pauseStartTime) {
        actualTotalTime -= now - pauseStartTime;
      }

      const stepTime = now - lastTime;

      logs.push({ label, step: stepTime, total: actualTotalTime, index: globalIndex, data });
      lastTime = now;

      logToConsole('event', globalIndex, label, stepTime, actualTotalTime, data);
    },

    pause: () => {
      if (!isPaused) {
        isPaused = true;
        pauseStartTime = performance.now();
        logToConsole('pause');
      }
    },

    resume: () => {
      if (isPaused && pauseStartTime) {
        totalPausedTime += performance.now() - pauseStartTime;
        isPaused = false;
        pauseStartTime = 0;
        logToConsole('resume');
      }
    },

    dump: () => {
      logToConsole('table');
      return logs;
    },

    reset: () => {
      logs.length = 0;
      lastTime = 0;
      startTime = 0;
      globalIndex = 0;
      isPaused = true;
      totalPausedTime = 0;
      pauseStartTime = 0;
    },

    getLogs: () => logs,
  };
})();

// Load required scripts
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);

  script.onload = function () {
    if (callback) callback();
  };

  script.onerror = function () {
    console.error('Failed to load script:', src);
  };
}

$(document).ready(() => {
  // Load scripts
  loadScript('https://import-cdn.default.com/sdk.js');

  let isDev = window.location.href.indexOf('dev') !== -1;

  // Qualification Variable
  let qualified;
  let isSchedule = typeof scheduleFlow !== 'undefined' && scheduleFlow;

  // User ID
  // check cookies for an existing user ID
  let webUserId = $.cookie('webTempTatariUserId');

  // Also save to window level
  if (webUserId) {
    window.webUserId = webUserId;
  }

  // #region Functions

  // Handle redirect
  function handleRedirect(redirect) {
    if (isDev) return;

    let placeId = getInputElementValue('place_id');
    let resName = getInputElementValue('name');
    let dqFlaq = getInputElementValue('auto_dq_flag');
    let prosResult = dqFlaq === 'False' ? 'aql' : 'non-aql';

    const defaultUrl = window.location.href.includes('/demo-grader')
      ? '/demo-thank-you-grader'
      : '/funnel-demo-requested';

    const finalRedirect = `${
      redirect || defaultUrl
    }?placeid=${placeId}&resname=${resName}&prosresult=${prosResult}`;

    // Track
    logMixpanel('Form - Success - Redirect', { redirectUrl: finalRedirect });

    window.location.href = finalRedirect;
  }

  const processMap = new Map();

  function logMixpanel(status, additionalData, options) {
    options = options || {};
    additionalData = additionalData || {};

    const shouldDumpTimer = options.dumpTimer || false;
    const includeConsoleLog = options.consoleLog !== false;
    const skipFormData = options.skipFormData || false;

    const isProcessStart = status.toLowerCase().includes('start');
    const isProcessEnd = status.toLowerCase().includes('end');

    if (isProcessStart) {
      const processName = options.processName || status.split(' - ')[0];
      const now = performance.now();

      if (!processMap.has(processName)) {
        processMap.set(processName, {
          startTime: now,
          totalPausedTime: 0,
          pauseStartTime: 0,
          isPaused: false,
        });
      } else {
        const process = processMap.get(processName);
        if (process.isPaused) {
          process.totalPausedTime += now - process.pauseStartTime;
          process.pauseStartTime = 0;
          process.isPaused = false;
        }
      }

      timer.resume();
    }

    let processCompleteLog = null;

    if (isProcessEnd) {
      const processName = options.processName || status.split(' - ')[0];
      const now = performance.now();
      const process = processMap.get(processName);

      if (process) {
        if (process.isPaused && process.pauseStartTime) {
          process.totalPausedTime += now - process.pauseStartTime;
        }

        const totalActiveTime = now - process.startTime - process.totalPausedTime;

        processCompleteLog = `[Process Complete]: "${processName}" took ${totalActiveTime.toFixed(
          2
        )}ms (active only)`;

        processMap.delete(processName);
      } else {
        processCompleteLog = `[Process Warning]: End called for unknown process "${processName}"`;
      }

      if (processMap.size === 0) timer.pause();
    }

    if (includeConsoleLog) {
      timer.log(status, additionalData);
    }

    if (processCompleteLog) {
      // console.log(processCompleteLog);
    }

    function getBrowserAndDeviceInfo() {
      const { userAgent } = navigator;
      const browser = navigator.appName;
      const { platform } = navigator;
      const { language } = navigator;

      return {
        userAgent,
        browser,
        platform,
        language,
      };
    }

    function parseJSONStrings(obj) {
      const parsed = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === 'string' && value.length > 0) {
            const firstChar = value.trim().charAt(0);
            if (firstChar === '[' || firstChar === '{') {
              try {
                parsed[key] = JSON.parse(value);
              } catch (e) {
                parsed[key] = value;
              }
            } else {
              parsed[key] = value;
            }
          } else {
            parsed[key] = value;
          }
        }
      }
      return parsed;
    }

    function flattenObject(obj, prefix = '') {
      const flattened = {};

      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const value = obj[key];
        const newKey = prefix ? `${prefix}_${key}` : key;

        if (value === null || value === undefined) {
          flattened[newKey] = value;
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              Object.assign(flattened, flattenObject(item, `${newKey}_${index}`));
            } else {
              flattened[`${newKey}_${index}`] = item;
            }
          });
        } else if (typeof value === 'object') {
          Object.assign(flattened, flattenObject(value, newKey));
        } else {
          flattened[newKey] = value;
        }
      }

      return flattened;
    }

    const userInfo = getBrowserAndDeviceInfo();
    const parsedAdditionalData = parseJSONStrings(additionalData);

    let eventVars = {
      ...userInfo,
      ...parsedAdditionalData,
    };

    if (!skipFormData && typeof wfForm !== 'undefined') {
      const firstName = wfForm.find($('input[name=first-name]')).val();
      const lastName = wfForm.find($('input[name=last-name]')).val();
      const restaurantName = wfForm.find($('input[name=name]')).val();
      const phone = wfForm.find($('input[name=cellphone]')).val();
      const email = wfForm.find($('input[name=email]')).val();

      eventVars = {
        ...eventVars,
        displayName: firstName + ' ' + lastName,
        restaurantName: restaurantName,
        phone: phone,
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
    }

    const timerLogs = timer.getLogs();

    if (timerLogs.length > 0) {
      const lastLog = timerLogs[timerLogs.length - 1];

      eventVars.stepActiveTime = lastLog.step;
      eventVars.totalActiveTime = lastLog.total;
      eventVars.eventIndex = lastLog.index;

      if (processMap.size > 0) {
        const [processName, process] = processMap.entries().next().value;
        eventVars.processTime = performance.now() - process.startTime - process.totalPausedTime;
        eventVars.processName = processName;
      }
    }

    const flattenedEventVars = flattenObject(eventVars);

    if (typeof mixpanel !== 'undefined' && mixpanel) {
      if (typeof webUserId !== 'undefined' && webUserId) {
        mixpanel.identify(webUserId);
      }

      if (!skipFormData && typeof wfForm !== 'undefined') {
        const firstName = flattenedEventVars.firstName;
        const lastName = flattenedEventVars.lastName;
        const email = flattenedEventVars.email;
        const phone = flattenedEventVars.phone;
        const restaurantName = flattenedEventVars.restaurantName;

        if (email || phone) {
          mixpanel.people.set({
            $first_name: firstName,
            $last_name: lastName,
            $email: email,
            $phone: phone,
            restaurantName: restaurantName,
            ...userInfo,
          });
        }
      }

      mixpanel.track(status, flattenedEventVars);
    }

    if (shouldDumpTimer) {
      if (typeof mixpanel !== 'undefined' && mixpanel && timerLogs.length > 0) {
        const timerEventVars = {
          ...userInfo,
          parentEvent: status,
          totalActiveTime: timerLogs[timerLogs.length - 1].total,
        };

        timerLogs.forEach((logEntry, idx) => {
          const stepKey = logEntry.label || `step_${idx + 1}`;
          timerEventVars[stepKey] = logEntry.step;
        });

        mixpanel.track('Full Timer Log', timerEventVars);
      }

      timer.dump();
      timer.reset();
    }
  }

  function trackCapterra() {
    var capterra_vkey = 'db833abde57f505b06b0e4b2bfe5e24f',
      capterra_vid = '2226621',
      ct = document.createElement('img');
    ct.src =
      'https://ct.capterra.com/capterra_tracker.gif?vid=' + capterra_vid + '&vkey=' + capterra_vkey;
    document.body.appendChild(ct);
  }

  // store Restaurant
  const getRestaurant = () => {
    let restaurant = getItem('restaurant');

    // Track
    logMixpanel('Form Init - GetRestaurant', { restaurant: restaurant });

    return restaurant;
  };

  // Qualification Flow Divider
  function checkQualification() {
    // Track
    logMixpanel('Form Qualification - Start');

    let isOwner;
    let isUS;

    return new Promise((resolve, reject) => {
      try {
        if (isSchedule) {
          let restaurant = getRestaurant();

          // Resetting the flag
          qualified = undefined;

          // Conditions
          isOwner = $('select[name="person-type"]').val() === "I'm a restaurant owner or manager";
          isUS = restaurant.address_components.some((component) => component.short_name === 'US');

          // Instantly follow to success link - Unqualified
          if (!isOwner || !isUS) {
            qualified = false;
          }
        } else {
          // Track
          logMixpanel('Form Qualification - End', {
            status: 'No Schedule Flow',
          });

          // temp for static purpose
          qualified = false;
        }

        // Track
        logMixpanel('Form Qualification - End', {
          status:
            qualified === undefined || qualified === true
              ? 'Success - Qualified for Enrichment'
              : 'Submission InstaDisqualified',
          isOwner: isOwner,
          isUS: isUS,
        });

        resolve(); // Resolve the promise after evaluation
      } catch (error) {
        // Track
        logMixpanel('Form Qualification - End', {
          status: 'Flow Error',
          errorMessage: error.message,
          errorType: error.name,
        });

        reject(error); // Reject the promise if an error occurs
      }
    });
  }

  // Qualification API Call
  function callQualification() {
    let restaurant = getRestaurant();
    let data = {
      name: restaurant.name,
      address: restaurant.formatted_address,
      website: restaurant.website,
      email: 'jonathan@owner.com',
      token: 'AJXuyxPXgGF68NMv',
      sfdc_id: 'None',
    };

    function callApi(data) {
      return new Promise((resolve, reject) => {
        // Track
        logMixpanel('Enrichment API - Start');

        $.ajax({
          url: 'https://owner-ops.net/business-info/',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(data),
          timeout: 40000,
          success: function (response) {
            // Track
            logMixpanel('Enrichment API - End', {
              status: 'Completed',
              response: response,
            });
            resolve(response);
          },
          error: function (xhr, status, error) {
            // Track
            logMixpanel('Enrichment API - End', {
              error: error,
              status: xhr.status,
              response: xhr.responseJSON || xhr.responseText,
            });

            if (status === 'timeout') {
              setInputElementValue('execution_time_seconds', 40);
              setInputElementValue('gmv_pred', 0);
            }

            resolve(null);
          },
        });
      });
    }

    return callApi(data).then((response) => {
      if (response && response[0]) {
        return response[0];
      }
      return false; // Return false if no valid response
    });
  }

  // Fill data from API
  function fillFormWithMatchingData(apiData, flag) {
    const inputs = $('[demo-form] input');
    const allowedKeys = [
      'brizo_id',
      'base_enrich_date',
      'inbound_add_to_cadence',
      'execution_time_seconds',
      'auto_dq_flag',
      'auto_dq_reason',
      'gmv_pred',
    ];

    // Flag = We run this only when the apiCall runned
    if (flag) {
      // Fill all the fiels coming from API
      inputs.each(function () {
        const inputName = $(this).attr('name');
        if (allowedKeys.includes(inputName) && apiData.hasOwnProperty(inputName)) {
          var value = apiData[inputName];

          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            $(this).val(value.split('T')[0]);
          } else if (typeof value === 'number' || (!isNaN(value) && !isNaN(parseFloat(value)))) {
            $(this).val(Number(value).toFixed(2));
          } else {
            $(this).val(value);
          }
        }
      });

      // Also calculate the brand_emrr
      function calculateEMRR() {
        let predGMV = apiData.gmv_pred;
        let locations = parseInt(getInputElementValue('number-of-locations'));

        let EMRR;

        if (locations === 1) {
          EMRR = 499 + 0.05 * predGMV;
        } else {
          EMRR = 599 + 0.05 * predGMV * locations + 299 * (locations - 1);
        }

        setInputElementValue('brand_emrr', EMRR);
      }
      calculateEMRR();
    } else {
      fillStaticAPIFields(false);
    }
  }

  // Validate Fields Internally
  function internalValidation(el) {
    // Track
    logMixpanel('Form Internal Validation - Start');

    // Global Validate checker
    let isValid = true;

    // Validate all inputs internally
    el.find(':input:visible, select').each(function () {
      let validate = validateInput($(this));
      isValid = isValid && validate;
    });

    // Track
    logMixpanel('Form Internal Validation - End', { status: isValid });

    return isValid;
  }

  // Fill Custom Fields for the insta flow
  function fillStaticAPIFields(type) {
    setInputElementValue('base_enrich_date', new Date().toISOString().slice(0, 10));
    setInputElementValue('inbound_add_to_cadence', 'true');
    // Inputs for insta Disqualification
    if (type === false) {
      setInputElementValue('execution_time_seconds', 0);
      setInputElementValue('auto_dq_flags', 'true');
    }
    // Inputs for insta Qualifiation - Currently NOT USED in the flow
    if (type === true) {
      setInputElementValue('execution_time_seconds', 0);
      setInputElementValue('auto_dq_reason', 'none');
      setInputElementValue('auto_dq_flags', 'false');
      setInputElementValue('self_service_scheduling_shown', true);
    }
  }

  function fillCustomFields() {
    // Some quick input filling
    setInputElementValue('page_url', isSchedule ? '/demo-schedule' : window.location.pathname);
    setInputElementValue('page_lang', $('html').attr('lang'));
    setInputElementValue(
      'url',
      (() => {
        // Splitting the URL at 'cid=' and taking the second part
        var restaurant = getRestaurant();
        if (restaurant && restaurant.url) {
          var cidLink = restaurant.url;
          return cidLink.split('cid=')[1];
        }
        return 'none'; // or an appropriate fallback value
      })()
    );

    // Function to set input field values from UTM parameters
    function fillFormInputsFromUTMs() {
      // Get all UTM parameters from session storage
      const utmParams = getParamsFromSession();

      if (!utmParams || Object.keys(utmParams).length === 0) {
        return;
      }

      // Find all form inputs to check against
      const allInputs = $('input');

      // Group inputs by whether they have the "0-2/" prefix or not
      const regularInputs = {};
      const prefixedInputs = {};

      allInputs.each(function () {
        const inputName = $(this).attr('name');
        if (!inputName) return;

        if (inputName.startsWith('0-2/')) {
          // For prefixed inputs, store with the key being everything after "0-2/"
          const baseKey = inputName.substring(4); // Remove "0-2/"
          prefixedInputs[baseKey] = $(this);
        } else {
          // Store regular inputs with their full name
          regularInputs[inputName] = $(this);
        }
      });

      // For each UTM parameter, try to find matching inputs
      Object.keys(utmParams).forEach((paramName) => {
        const paramValue = utmParams[paramName];

        if (!paramValue) return;

        // Check if we have a regular input matching this param name
        if (regularInputs[paramName]) {
          regularInputs[paramName].val(paramValue);
        }

        // Check if we have a prefixed input where the base name matches
        if (prefixedInputs[paramName]) {
          prefixedInputs[paramName].val(paramValue);
        }
      });
    }
    fillFormInputsFromUTMs();

    // Fill User Id
    setInputElementValue('web_user_id', webUserId);
  }

  function disableButton(state) {
    // Choose which button
    let button;
    if ($('[data-form="submit-btn"]').is(':visible')) {
      button = $('[data-form="submit-btn"]');
    } else {
      button = $('[data-form="next-btn"]');
    }

    if (state) {
      const originalText = button.text();
      button.addClass('disabled');
      button.attr('data-original-text', originalText);
      button.children('div:first-child').text('Processing');
    } else {
      const originalText = button.attr('data-original-text');
      button.removeClass('disabled');
      button.children('div:first-child').text(originalText);
    }
  }

  // Run the Qualification Logic
  async function processQualification() {
    // Init
    disableButton(true);

    // Validate Fields
    let validation = internalValidation(wfForm);

    // Proceed only if validation pass
    if (validation) {
      toggleLoader(true);
      try {
        // Wait for checkQualification to complete
        await checkQualification();

        // Call API only if InstaQualification is not set
        if (typeof qualified !== 'boolean') {
          const result = await callQualification();
          const dqFlag = result.auto_dq_flag;

          // We tag all submissions which runned the API
          setInputElementValue('self_service_enrichment_api_used', true);

          // We check if the returned value contains the dgFlag
          if (typeof dqFlag === 'string') {
            qualified = result.auto_dq_flag === 'True' ? false : true; // if dgFlaq equals true, it means its disqualified.
            fillFormWithMatchingData(result, true); // We fill the data with API logic

            if (qualified) {
              setInputElementValue('self_service_scheduling_shown', true); // We tag the checkbox as the final destination is the schedule page
            }
          } else {
            qualified = false; // No API Result so insta disqualified
            fillFormWithMatchingData(result, false); // We fill the data without API
          }
        } else {
          fillStaticAPIFields(qualified);
        }
      } catch (error) {
        qualified = false;
      }

      // Proceed -- DO NOT EDIT !!!!
      fillCustomFields();
      disableButton(false);

      logMixpanel('Form Mirror - Hubspot - Start');
      let handler = await handleHubspotForm(wfForm, hsForm);
      logMixpanel('Form Mirror - Hubspot - End', { status: handler });

      return handler;
    }

    disableButton(false);
    return false;
  }

  // Handle Submit
  async function fireSubmit() {
    // Reset timer
    timer.reset();

    // Track
    logMixpanel('Submit Attempt - Start');

    // Qualify the User
    let qualification = await processQualification();

    if (qualification) {
      // Scrape the data for the SDK\
      capturedFormData = scrapeFormFields();

      // Track
      logMixpanel('Submit Attempt - End', { status: 'success' });
      logMixpanel('HS Form - Submission - Start');

      // Fire the submission
      hsForm[0].submit();
    } else {
      // Track
      logMixpanel('Submit Attempt - End', { status: 'validation failed' });
      toggleLoader(false);
    }
  }

  const successSubmit = () => {
    const success = $('.demo-form_success');
    const shouldRedirect =
      !window.location.href.includes('/blog/') &&
      !window.location.href.includes('/resources/') &&
      !window.location.href.includes('/downloads/');
    const redirectUrl = wfForm.attr('data-custom-redirect');
    const showSchedule = isSchedule && qualified && !redirectUrl;

    // Toggle Loading
    wfForm.hide();
    toggleLoader(false);

    // We proceed with the selfSchedule only if we are in the scheduleFlow + we don't have custom redirect set
    if (showSchedule) {
      // Check if we have a valid scheduler URL from Default SDK
      if (window.defaultSchedulerUrl) {
        var settings = {
          link: window.defaultSchedulerUrl,
          selector: '.demo-form_success-box',
        };

        function replaceMeetingEmbed() {
          var url = new URL(settings.link);

          $(settings.selector).html(
            '<div class="meetings-iframe-container" style="width: 100%; height: 900px;"><iframe src="' +
              url.toString() +
              '" width="100%" height="100%" frameborder="0" allow="camera; microphone; autoplay; encrypted-media; fullscreen; display-capture"></iframe></div>'
          );
          success.css('background-color', 'white');
          success.show();
        }

        logMixpanel('Default Scheduler - Open');

        replaceMeetingEmbed();
      } else {
        // No scheduler URL from Default SDK, redirect to static page
        success.show();
      }
    }

    // Track
    logMixpanel(
      'Form - Success Submission',
      {},
      {
        dumpTimer: true,
      }
    );

    // Success State flow
    if (redirectUrl) {
      success.show();
      handleRedirect(redirectUrl);
    } else if (shouldRedirect && !showSchedule) {
      success.show();
      handleRedirect();
    } else if (!showSchedule) {
      success.show();
    }
  };

  // #endregion

  // #region Flow Logic

  // 1. Define Forms
  let wfForm = $('[demo-form]');
  let hsForm;

  // 2. Initialize the HubSpot form

  // Default form ID
  let formId = 'f3807262-aed3-4b9c-93a3-247ad4c55e60';
  let portalId = '6449395';
  const currentUrl = window.location.href;

  // Form for resources
  if (currentUrl.indexOf('/resources/') !== -1) {
    formId = '66b9776c-c640-4b5a-8807-439a721001ff';
  }

  // Referall Page Form
  if (currentUrl.indexOf('refer') !== -1) {
    formId = '969fbdc3-b662-4428-a208-c78b8f20efa6';
  }

  // Dev QA
  if (isDev) {
    formId = 'e13f4000-0da1-48db-bc88-752e55c82fe7';
    portalId = '50356338';
  }

  let capturedFormData = null;
  let defaultSdkComplete = false;

  hbspt.forms.create({
    portalId: portalId,
    formId: formId,
    target: '#hbst-form',
    onFormReady: onFormReadyCallback,
    onFormSubmitted: async (data) => {
      // Track
      logMixpanel('HS Form - Submisison - End', { status: 'success' });

      // Handle Default
      submitToDefaultSDK();
      await waitForDefaultSdk();

      // Shows Result
      setTimeout(() => {
        successSubmit();
      }, 500);

      trackCapterra();
    },
  });

  // 3. Wait for hsform to be ready so we can refference it
  waitForFormReady().then(function (form) {
    // Track
    logMixpanel('HSform - Ready');

    hsForm = $(form);
  });

  // 4. Submit Action
  $('[data-form=submit-btn]').on('click', fireSubmit);

  // #endregion

  // #region Custom Actions
  locationType();

  // Format US Phone Number
  $('[data-cleave-phone]').each(function () {
    new Cleave($(this), {
      numericOnly: true,
      blocks: [0, 3, 3, 4, 10],
      delimiters: ['(', ') ', '-'],
      delimiterLazyShow: true,
    });
  });

  // Format Location Numbers
  function validateNumLocations(input) {
    const $input = $(input);
    let value = $input.val().replace(/\D/g, '');

    if (value !== '') {
      const numValue = parseInt(value);
      if (numValue > 999) {
        $input.val('999');
      } else if (numValue < 1) {
        $input.val('1');
      } else {
        $input.val(value);
      }
    }

    return value !== '' && parseInt(value) >= 1 && parseInt(value) <= 999;
  }

  $('#number-of-locations').on('input', function () {
    validateNumLocations(this);
  });

  $('#number-of-locations').on('blur', function () {
    const $input = $(this);
    if ($input.val() === '' || parseInt($input.val()) < 1) {
      $input.val('1');
    }
  });
  //#endregion

  // #region defaulSDK
  function scrapeFormFields() {
    logMixpanel('Default Scrapper - Start');

    const form = $(hsForm);
    const questions = [];
    const responses = {};
    const questionMap = {};
    const numericFields = ['default_brand_emrr', 'pred_gmv', 'pred_gmv_company'];

    form.find('input, textarea, select').each(function () {
      const $field = $(this);
      const fieldType = $field.attr('type');
      const fieldTag = $field.prop('tagName').toLowerCase();
      let fieldName = $field.attr('name');

      if (fieldName && fieldName.includes('/')) {
        fieldName = fieldName.split('/').pop();
      }

      const fieldId = fieldName;
      const label =
        $(`label[for="${fieldId}"]`).text().trim() ||
        $field.closest('.field, .hs-form-field').find('label').text().trim() ||
        $field.attr('placeholder') ||
        fieldName;

      if (!$field.attr('name') || fieldType === 'submit') return;
      if (!label || !fieldId) return;

      let questionType = 'input';
      let options = [];
      let fieldValue = $field.val() || '';

      if (fieldType === 'checkbox') {
        fieldValue = $field.is(':checked') ? 'true' : 'false';
        questionType = 'checkbox';
        options = [fieldValue];
      } else if (fieldType === 'radio') {
        if (!$field.is(':checked')) return;
        fieldValue = $field.val().toString();
        questionType = 'radio';
        options = [fieldValue];
      } else {
        if (!fieldValue.trim() && fieldType !== 'hidden') return;

        if (fieldType === 'email') {
          questionType = 'email';
          const question = { id: 'email', name: 'email', label: 'email', type: questionType };
          if (options.length) question.options = options;

          questions.push(question);
          responses['email'] = fieldValue;
          questionMap['email'] = question;
          return;
        } else if (fieldType === 'tel' || fieldType === 'phone') questionType = 'tel';
        else if (fieldTag === 'textarea') questionType = 'textarea';
        else if (fieldTag === 'select') {
          questionType = 'select';
          $field.find('option').each(function () {
            const optionValue = $(this).val();
            if (optionValue && !$(this).is(':disabled')) options.push(optionValue.toString());
          });
        }
      }

      if (questionMap[label]) {
        const existingQuestion = questionMap[label];
        if (options.length) {
          options.forEach((opt) => {
            const strOpt = opt.toString();
            if (!existingQuestion.options) existingQuestion.options = [];
            if (!existingQuestion.options.includes(strOpt)) existingQuestion.options.push(strOpt);
          });
        }

        if (questionType === 'checkbox') {
          const existingValue = responses[existingQuestion.id];
          responses[existingQuestion.id] = existingValue
            ? Array.isArray(existingValue)
              ? [...existingValue, fieldValue]
              : [existingValue, fieldValue]
            : [fieldValue];
        } else {
          const finalValue =
            numericFields.includes(existingQuestion.id) && fieldValue !== ''
              ? parseFloat(fieldValue)
              : fieldValue;
          responses[existingQuestion.id] = finalValue;
        }
        return;
      }

      const question = { id: fieldId, name: fieldName, label: label, type: questionType };
      if (options.length) question.options = options;

      questions.push(question);

      const finalValue =
        numericFields.includes(fieldId) && fieldValue !== '' ? parseFloat(fieldValue) : fieldValue;
      responses[fieldId] = finalValue;
      questionMap[label] = question;
    });

    logMixpanel('Default Scrapper - End', { questions, responses });
    return { questions, responses };
  }

  function submitToDefaultSDK() {
    // Track
    logMixpanel('DefaultSDK - Submission Attempt - Start');

    if (!capturedFormData) {
      // Track
      logMixpanel('DefaultSDK - Submission Attempt - End', {
        status: 'No form data',
      });
      return;
    }

    const emailField = Object.keys(capturedFormData.responses).find((key) => key.includes('email'));
    const emailValue = emailField ? capturedFormData.responses[emailField] : null;

    if (!emailValue) {
      // Track
      logMixpanel('DefaultSDK - Submission Attempt - End', {
        status: 'No email found',
      });

      window.defaultSchedulerUrl = null;
      defaultSdkComplete = true;
      return;
    }

    // Use correct structure from docs
    const data = {
      form_id: 593374,
      team_id: 514,
      email: emailValue,
      responses: capturedFormData.responses,
      questions: capturedFormData.questions,
    };

    const options = {
      autoSchedulerDisplay: false,
      onSuccess: (response) => {
        // Track
        logMixpanel('DefaultSDK - Submission Attempt - End', {
          status: 'Success',
          response: response,
        });

        window.defaultSchedulerUrl = response ? response.body.stepDetails.url : null;
        defaultSdkComplete = true;
      },
      onError: (error) => {
        // Track
        logMixpanel('DefaultSDK - Submission Attempt - End', {
          status: error,
        });

        window.defaultSchedulerUrl = null;
        defaultSdkComplete = true;
      },
      onSchedulerClosed: (data) => {
        // Track
        logMixpanel('Default Scheduler - Closed');
        handleRedirect();
      },
      onMeetingBooked: (data) => {
        // Redirect to thank you page with a timer
        $('[data-form-success]').css('display', 'flex');
        setTimeout(() => {
          let countdown = 5;
          const timer = $('[data-redirect-timer]');

          timer.text(countdown);

          const interval = setInterval(() => {
            countdown--;
            timer.text(countdown);

            if (countdown === 0) {
              clearInterval(interval);
              handleRedirect();
            }
          }, 1000);
        }, 0);

        // Track
        logMixpanel('Default Scheduler - Meeting booked!', data);
      },
    };

    window.DefaultSDK.submit(data, options);
  }

  function waitForDefaultSdk(timeout = 60000) {
    return new Promise((resolve) => {
      const startTime = Date.now();

      const checkStatus = () => {
        if (defaultSdkComplete || Date.now() - startTime > timeout) {
          resolve();
        } else {
          setTimeout(checkStatus, 100);
        }
      };

      checkStatus();
    });
  }

  //#endregion

  // #region multistep
  function initMultistep() {
    function initGoalFlows() {
      // Remove is-active class from all labels on page load
      $(document).ready(function () {
        $('.goals-screen input[name="goals"]').closest('label').removeClass('is-active');
      });

      // Use click handler
      $(document).on('click', '.goals-screen input[name="goals"]', function (event) {
        // Get the selected value
        const selectedValue = $(this).val();

        // Remove is-active class from all labels and add it to the clicked one
        $('.goals-screen input[name="goals"]').closest('label').removeClass('is-active');
        $(this).closest('label').addClass('is-active');

        // Handle the heading update
        var screen2_heading = $('#screen2_heading');
        if (selectedValue === 'All of the above') {
          screen2_heading.html(
            'Good news! Restaurants see online sales grow by up to <span class="text-color-brand">$8k</span> per month and reduce costs by up to <span class="text-color-brand">$2k</span> per month with Owner'
          );
        } else if (selectedValue === 'Reduce my costs') {
          screen2_heading.html(
            'Good news! Restaurants see costs reduce by up to <span class="text-color-brand">$2k</span> per month with Owner'
          );
        } else {
          screen2_heading.html(
            'Good news! Restaurants see online sales grow by up to <span class="text-color-brand">$8k</span> per month with Owner'
          );
        }

        // Navigate to next screen
        if (nextBtn) {
          nextBtn.click();
        }
      });

      // Remove the change handler completely to avoid double-firing
      $(document).off('change', '.goals-screen input[name="goals"]');
    }

    // Elements
    const steps = document.querySelectorAll('[class*="step-"]');
    const prevBtn = document.querySelector('[data-form="back-btn"]');
    const nextBtn = document.querySelector('[data-form="next-btn"]');
    const submitBtn = document.querySelector('[data-form="multi-submit-btn"]');

    if (!steps.length) return;

    const progressbar = document.querySelector('.progressbar-left');
    const form = document.getElementById('wf-form-email-form-v2');
    const hearSelect = document.getElementById('Hear');

    let currentStep = 0;

    // Update step visibility
    function updateSteps(direction = 'next') {
      const wrapper = document.querySelector('.all-screens');

      if (wrapper) wrapper.style.overflow = 'hidden';

      steps.forEach((step, index) => {
        step.classList.remove(
          'step-hide',
          'step-active',
          'step-slide',
          'step-enter-left',
          'step-enter-right'
        );

        if (index === currentStep) {
          step.classList.add('step-slide', 'step-active');
          step.classList.add(direction === 'next' ? 'step-enter-right' : 'step-enter-left');

          void step.offsetWidth;

          step.classList.remove('step-enter-left', 'step-enter-right');

          setTimeout(() => {
            if (wrapper) wrapper.style.overflow = 'visible';
          }, 400);
        } else {
          step.classList.add('step-hide');
        }
      });

      const isFirstStep = currentStep === 0;
      const isFinalStep = currentStep === steps.length - 1;

      progressbar.style.display = isFirstStep ? 'none' : 'flex';
      nextBtn.style.display = isFirstStep || isFinalStep ? 'none' : 'flex';
      prevBtn.style.display = isFirstStep ? 'none' : 'flex';

      // Remove existing continue-* classes and add current step class
      nextBtn.className = nextBtn.className.replace(/continue-\d+/g, '');
      nextBtn.classList.add(`continue-${currentStep}`);

      updateProgress();
    }

    // Progress bar steps
    function updateProgress() {
      const progressItems = document.querySelectorAll('.progressbar__item-2');
      progressItems.forEach((item, index) => {
        // item.classList.toggle('active-bar', index === currentStep);
        item.classList.toggle('active-bar', index <= currentStep);
      });
    }

    // Event: next step
    nextBtn?.addEventListener('click', async function () {
      if (currentStep < steps.length - 1) {
        const isValid = internalValidation($(steps[currentStep]));
        if (isValid) {
          currentStep++;
          updateSteps('next');
        }
      }
    });

    submitBtn?.addEventListener('click', async function () {
      let qualification = await processQualification();

      for (let i = 0; i < steps.length; i++) {
        const invalidFields = $(steps[i])
          .find('[field-validation]')
          .filter(function () {
            return $(this).css('display') === 'block';
          });

        if (invalidFields.length > 0) {
          toggleLoader(false);
          currentStep = i;
          updateSteps('back');
          break;
        }
      }

      if (qualification) {
        capturedFormData = scrapeFormFields();

        hsForm[0].submit();
        $('.last-button').hide();
      } else {
        toggleLoader(false);
      }
    });

    // Event: prev step
    prevBtn?.addEventListener('click', function () {
      if (currentStep > 0) {
        currentStep--;
        updateSteps('prev');
      }
    });

    // Initialize
    $(document).ready(function () {
      initGoalFlows();
      updateSteps();
    });
  }
  initMultistep();
  // #endregion
});
