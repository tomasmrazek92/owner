import { v4 as uuidv4 } from 'uuid';

import { validateInput } from '$utils/formValidations';
import { getInputElementValue, setInputElementValue } from '$utils/globals';
import {
  fillHubSpot,
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

// Initialize with your project token
initMixpanel();
mixpanel.init('8e3c791cba0b20f2bc5aa67d9fb2732a', {
  record_sessions_percent: 100,
  record_mask_text_selector: '',
});

$(document).ready(() => {
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
            resolve(response);
          },
          error: function (xhr, status, error) {
            if (status === 'timeout') {
              console.log('Error occurred:', error);
              setInputElementValue('execution_time_seconds', 15);
              setInputElementValue('gmv_pred', 0);
              resolve('');
            } else {
              console.log('Error occurred:', error);
              resolve('');
            }
          },
        });
      });
    }

    // Usage
    return callApi(data)
      .then((response) => {
        console.log(response);
        return response[0]; // Return the response directly
      })
      .catch((error) => {
        console.error('Error:', error); // Log or handle error as needed
        return false; // Return false on error
      });
  }

  // Fill data from API
  function fillFormWithMatchingData(apiData, flag) {
    console.log(apiData);
    console.log(flag);
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
        // Check if the input's name matches any key in the API data
        if (allowedKeys.includes(inputName) && apiData.hasOwnProperty(inputName)) {
          var value = apiData[inputName];
          if (typeof value === 'number' || (!isNaN(value) && !isNaN(parseFloat(value)))) {
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
  function internalValidation() {
    // Global Validate checker
    let isValid = true;

    // Validate all inputs internally
    wfForm.find(':input:visible, select').each(function () {
      let validate = validateInput($(this));
      isValid = isValid && validate;
    });

    return isValid;
  }

  // Fill Custom Fields for the insta flow
  function fillStaticAPIFields(type) {
    console.log(type);
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
        console.log('No UTM parameters found in session storage');
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
          console.log(`Set regular input ${paramName} = ${paramValue}`);
        }

        // Check if we have a prefixed input where the base name matches
        if (prefixedInputs[paramName]) {
          prefixedInputs[paramName].val(paramValue);
          console.log(`Set prefixed input 0-2/${paramName} = ${paramValue}`);
        }
      });
    }
    fillFormInputsFromUTMs();

    // Fill User Id
    setInputElementValue('web_user_id', webUserId);
  }

  // Run the Qualification Logic
  async function processQualificationAndForm() {
    // Validate Fields
    let validation = internalValidation();

    console.log(validation);

    // Proceed only if validation pass
    if (validation) {
      // Show Loader
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
        console.log('Qualification check or call failed:', error);
      }

      // Proceed -- DO NOT EDIT !!!!
      fillCustomFields();
      fillHubSpot(wfForm, hsForm, inputMapping);
      logMixpanel('Form Button Clicked');
      handleHubspotForm(hsForm);
    }
  }

  // Handle Submit
  function fireSubmit() {
    processQualificationAndForm();
  }

  const successSubmit = () => {
    const success = $('.demo-form_success');
    const shouldRedirect =
      !window.location.href.includes('/blog/') &&
      !window.location.href.includes('/resources/') &&
      !window.location.href.includes('/downloads/');
    const redirectUrl = wfForm.attr('data-custom-redirect');
    const showSchedule = isSchedule && qualified && redirectUrl === '';

    // Toggle Loading
    toggleLoader(false);
    wfForm.hide();

    // We proceed with the selfSchedule only if we are in the scheduleFlow + we don't have custom redirect set
    if (showSchedule) {
      var meetingSettings = {
        link: 'https://meetings.hubspot.com/jonathan-shenkman/self-scheduling',
        selector: '.demo-form_success',
        email: getInputElementValue('email'),
        fName: getInputElementValue('first-name'),
        lName: getInputElementValue('last-name'),
        company: getInputElementValue('name'),
      };

      function replaceMeetingEmbed(options) {
        // Merge default settings with provided options
        var settings = $.extend({}, meetingSettings, options);

        // Replace content
        $(settings.selector).html(
          '<div class="meetings-iframe-container" data-src="' +
            settings.link +
            `?embed=true&firstName=${settings.fName}&lastName=${settings.lName}&email=${settings.email}&company=${settings.company}"></div>`
        );

        // Load HubSpot script
        $.getScript('https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js').done(
          function () {
            success.show();
          }
        );
      }

      // Basic usage:
      replaceMeetingEmbed();
    }

    // Success State flow
    if (redirectUrl !== '') {
      success.show();
      window.location.href = redirectUrl;
    } else if (shouldRedirect && !showSchedule) {
      success.show();
      window.location.href = 'https://www.owner.com/funnel-demo-requested';
    } else {
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
  const currentUrl = window.location.href;

  // Form for resources
  if (currentUrl.indexOf('/resources/') !== -1) {
    formId = '66b9776c-c640-4b5a-8807-439a721001ff';
  }

  // Referall Page Form
  if (currentUrl.indexOf('refer') !== -1) {
    formId = '969fbdc3-b662-4428-a208-c78b8f20efa6';
  }

  hbspt.forms.create({
    portalId: '6449395',
    formId: formId,
    target: '#hbst-form',
    onFormReady: onFormReadyCallback,
    onFormSubmit: function () {
      console.log('Submit');
      logMixpanel('Form Submission Attempt');
    },
    onFormSubmitted: () => {
      logMixpanel('Form Submission Sent');
      trackCapterra();
      setTimeout(() => {
        successSubmit();
      }, 200);
    },
  });

  // 3. Wait for hsform to be ready so we can refference it
  waitForFormReady().then(function (form) {
    hsForm = $(form);
  });

  // 4. Mapp all input [wfForm: hsForm]
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
    url: 'place_cid',
    place_types: ['place_types_contact', '0-2/place_types'],
    rating: 'place_rating',
    user_ratings_total: 'user_ratings_total',
    'number-of-locations': 'of_locations_number',
    hear: 'how_did_you_hear_about_us',
    page_url: 'last_pdf_download',
    page_lang: 'page_lang',
    brizo_id: ['brizo_id', '0-2/brizo_id_account'],
    base_enrich_date: ['auto_enrich_date', '0-2/auto_enrich_date_company'],
    inbound_add_to_cadence: 'inbound_add_to_cadence',
    execution_time_seconds: 'auto_enrich_time',
    auto_dq_flag: 'auto_dq_static',
    auto_dq_reason: ['auto_dq_reason', '0-2/auto_dq_reason_company'],
    gmv_pred: ['pred_gmv', '0-2/pred_gmv_company'],
    // Refers
    referrer_s_phone_number: 'referrer_s_phone_number',

    // ...
  };

  // 5. Submit Action
  $('[data-form=submit-btn]').on('click', fireSubmit);

  // #endregion

  // #region Custom Actions

  // Condition Logic for input
  $('select[name="person-type"]').on('change', function () {
    let val = $(this).val();

    // Show Locations
    if (val === "I'm a restaurant owner or manager") {
      $('#locations-wrap').show();
    } else {
      $('#locations-wrap').hide();
    }
  });

  // Format US Phone Number
  $('[data-cleave-phone]').each(function () {
    new Cleave($(this), {
      numericOnly: true,
      blocks: [0, 3, 3, 4, 10],
      delimiters: ['(', ') ', '-'],
      delimiterLazyShow: true,
    });
  });

  //#endregion
});
