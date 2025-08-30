import { v4 as uuidv4 } from 'uuid';

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

function initMixpanel() {
  if (!window.mixpanel || !window.mixpanel.__SV) {
    var mixpanel = (window.mixpanel = window.mixpanel || []);
    mixpanel._i = [];

    mixpanel.init = function (e, f, c) {
      function g(a, d) {
        var b = d.split('.');
        2 == b.length && ((a = a[b[0]]), (d = b[1]));
        a[d] = function () {
          a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }

      var a = mixpanel;
      'undefined' !== typeof c ? (a = mixpanel[c] = []) : (c = 'mixpanel');
      a.people = a.people || [];

      a.toString = function (a) {
        var d = 'mixpanel';
        'mixpanel' !== c && (d += '.' + c);
        a || (d += ' (stub)');
        return d;
      };

      a.people.toString = function () {
        return a.toString(1) + '.people (stub)';
      };

      var i =
        'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'.split(
          ' '
        );

      for (var h = 0; h < i.length; h++) g(a, i[h]);

      var j = 'set set_once union unset remove delete'.split(' ');

      a.get_group = function () {
        function b(c) {
          d[c] = function () {
            call2_args = arguments;
            call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
            a.push([e, call2]);
          };
        }

        for (
          var d = {}, e = ['get_group'].concat(Array.prototype.slice.call(arguments, 0)), c = 0;
          c < j.length;
          c++
        )
          b(j[c]);

        return d;
      };

      mixpanel._i.push([e, f, c]);
    };

    mixpanel.__SV = 1.2;

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.async = true;
    e.src =
      'undefined' !== typeof MIXPANEL_CUSTOM_LIB_URL
        ? MIXPANEL_CUSTOM_LIB_URL
        : 'file:' === document.location.protocol &&
          '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//)
        ? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
        : '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';

    var g = document.getElementsByTagName('script')[0];
    g.parentNode.insertBefore(e, g);
  }
}

// Load required scripts
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);

  script.onload = function () {
    console.log('Script loaded successfully');
    if (callback) callback();
  };

  script.onerror = function () {
    console.error('Failed to load script');
  };
}

// Initialize with your project token
initMixpanel();
mixpanel.init('8e3c791cba0b20f2bc5aa67d9fb2732a', {
  record_sessions_percent: 100,
  record_mask_text_selector: '',
});

$(document).ready(() => {
  // Load scripts
  loadScript('https://import-cdn.default.com/sdk.js');

  // Qualification Variable
  let qualified;
  let isSchedule = typeof scheduleFlow !== 'undefined' && scheduleFlow;

  // User ID
  // check cookies for an existing user ID
  let webUserId = $.cookie('webTempTatariUserId');

  // if none exists, generate a new one and save it
  if (!webUserId) {
    webUserId = uuidv4();
    $.cookie('webTempTatariUserId', webUserId, {
      domain: '.owner.com',
      path: '/',
    });
  }

  // Also save to window level
  window.webUserId = webUserId;

  // Identify the user first for the mixPanel
  if (typeof webUserId !== 'undefined' && webUserId) {
    mixpanel.identify(webUserId);
  }

  // #region Functions
  function logMixpanel(status) {
    // Device Data
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
    const userInfo = getBrowserAndDeviceInfo();

    const firstName = wfForm.find($('input[name=first-name]')).val();
    const lastName = wfForm.find($('input[name=last-name]')).val();
    const restaurantName = wfForm.find($('input[name=name]')).val();
    const phone = wfForm.find($('input[name=cellphone]')).val();
    const email = wfForm.find($('input[name=email]')).val();

    const eventVars = {
      displayName: firstName + ' ' + lastName,
      restaurantName: restaurantName,
      phone: phone,
      email: email,
      firstName: firstName,
      lastName: lastName,
      ...userInfo,
    };

    // Check if Mixpanel is available
    if (typeof mixpanel !== 'undefined' && mixpanel) {
      // Identify the user
      mixpanel.identify(webUserId);

      // Set user properties
      mixpanel.people.set({
        $first_name: firstName,
        $last_name: lastName,
        $email: email,
        $phone: phone,
        restaurantName: restaurantName,
        ...userInfo,
      });

      // Track the event
      mixpanel.track(status, eventVars);
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

    return restaurant;
  };

  // Qualification Flow Divider
  function checkQualification() {
    return new Promise((resolve, reject) => {
      try {
        if (isSchedule) {
          let restaurant = getRestaurant();

          // Resetting the flag
          qualified = undefined;

          // Conditions
          let isOwner =
            $('select[name="person-type"]').val() === "I'm a restaurant owner or manager";
          let isUS = restaurant.address_components.some(
            (component) => component.short_name === 'US'
          );

          // Instantly follow to success link - Unqualified
          if (!isOwner || !isUS) {
            logMixpanel('Submission Disqualified');
            qualified = false;
          }
        } else {
          // temp for static purpose
          qualified = false;
        }

        resolve(); // Resolve the promise after evaluation
      } catch (error) {
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
    let response;

    function callApi(data) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: 'https://owner-ops.net/business-info/',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(data),
          timeout: 15000,
          success: function (response) {
            console.log(response);
            resolve(response);
          },
          error: function (xhr, status, error) {
            if (status === 'timeout') {
              setInputElementValue('execution_time_seconds', 15);
              setInputElementValue('gmv_pred', 0);
              resolve('');
            } else {
              resolve('');
            }
          },
        });
      });
    }

    // Usage
    return callApi(data)
      .then((response) => {
        return response[0]; // Return the response directly
      })
      .catch((error) => {
        console.error('Error:', error); // Log or handle error as needed
        return false; // Return false on error
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
    } else {
      fillStaticAPIFields(false);
    }
  }

  // Validate Fields Internally
  function internalValidation(el) {
    // Global Validate checker
    let isValid = true;

    // Validate all inputs internally
    el.find(':input:visible, select').each(function () {
      let validate = validateInput($(this));
      isValid = isValid && validate;
    });

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
    // Inputs for insta Qualifiation
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
      logMixpanel('Form Button Clicked');

      disableButton(false);
      let handler = await handleHubspotForm(wfForm, hsForm);
      return handler;
    }

    disableButton(false);
    return false;
  }

  // Handle Submit
  async function fireSubmit() {
    let qualification = await processQualification();

    if (qualification) {
      capturedFormData = scrapeFormFields('#hbst-form');
      submitToDefaultSDK();
      await waitForDefaultSdk();
      hsForm[0].submit();

      setTimeout(() => {
        successSubmit();
      }, 500);
    } else {
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
          selector: '.demo-form_success',
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

        replaceMeetingEmbed();
      } else {
        // No scheduler URL from Default SDK, redirect to static page
        success.show();
      }
    }

    // Success State flow
    if (redirectUrl) {
      success.show();
      window.location.href = redirectUrl;
    } else if (shouldRedirect && !showSchedule) {
      success.show();
      window.location.href = 'https://www.owner.com/funnel-demo-requested';
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
  if (currentUrl.indexOf('dev') !== -1) {
    formId = 'e13f4000-0da1-48db-bc88-752e55c82fe7';
    portalId = '50356338';
  }

  hbspt.forms.create({
    portalId: portalId,
    formId: formId,
    target: '#hbst-form',
    onFormReady: onFormReadyCallback,
    onFormSubmit: function () {
      logMixpanel('Form Submission Attempt');
    },
    onFormSubmitted: async () => {
      logMixpanel('Form Submission Sent');
      trackCapterra();
    },
  });

  // 3. Wait for hsform to be ready so we can refference it
  waitForFormReady().then(function (form) {
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

  let capturedFormData = null;
  let defaultSdkComplete = false;

  function scrapeFormFields(formSelector) {
    const form = $(formSelector);
    const questions = [];
    const responses = {};
    const questionMap = {};

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
          responses[existingQuestion.id] = fieldValue;
        }
        return;
      }

      const question = { id: fieldId, name: fieldName, label: label, type: questionType };
      if (options.length) question.options = options;

      questions.push(question);
      responses[fieldId] = fieldValue;
      questionMap[label] = question;
    });

    return { questions, responses };
  }

  function submitToDefaultSDK() {
    if (!capturedFormData) {
      console.error('No form data');
      return;
    }

    const emailField = Object.keys(capturedFormData.responses).find((key) => key.includes('email'));
    const emailValue = emailField ? capturedFormData.responses[emailField] : null;

    if (!emailValue) {
      console.error('No email found');
      window.defaultSchedulerUrl = null;
      defaultSdkComplete = true;
      return;
    }

    console.log(capturedFormData);

    // Use correct structure from docs
    const data = {
      form_id: 593374,
      team_id: 514,
      email: emailValue,
      responses: capturedFormData.responses,
      questions: capturedFormData.questions,
    };

    console.log('Submission:', data);

    const options = {
      autoSchedulerDisplay: false,
      onSuccess: (response) => {
        console.log('SUCCESS:', response);
        window.defaultSchedulerUrl = response ? response.body.stepDetails.url : null;
        defaultSdkComplete = true;
      },
      onError: (error) => {
        console.error('ERROR:', error);
        window.defaultSchedulerUrl = null;
        defaultSdkComplete = true;
      },
      onSchedulerClosed: (data) => {
        window.location.href = data.redirectUrl;
      },
      onMeetingBooked: (data) => {
        console.log('Meeting booked successfully!', data.payload);
      },
    };

    window.DefaultSDK.submit(data, options);
  }

  function waitForDefaultSdk(timeout = 15000) {
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
        capturedFormData = scrapeFormFields('#hbst-form');
        submitToDefaultSDK();
        await waitForDefaultSdk();
        hsForm[0].submit();
        $('.last-button').hide();

        setTimeout(() => {
          successSubmit();
        }, 500);
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
