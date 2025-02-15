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

$(document).ready(() => {
  // Qualification Variable
  let qualified;
  let isSchedule = typeof scheduleFlow !== 'undefined' && scheduleFlow;

  // FullStory ID
  // check local storage for an existing user ID
  let userId = getItem('userId');

  // if none exists, generate a new one and save it
  if (!userId) {
    userId = uuidv4();
    setItem('userId', userId);
  }

  // #region Functions
  function logFullstory(status) {
    // Device Data
    function getBrowserAndDeviceInfo() {
      const { userAgent } = navigator;
      const browser = navigator.appName;
      const { platform } = navigator;
      const { language } = navigator; // This gives the language of the OS

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

    if (typeof FS !== 'undefined' && FS) {
      FS.event(status, FS.identify(userId, eventVars));
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
            logFullstory('Submission Disqualified');
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

    // Partner Stack Filling
    function checkAndLogParam(paramName) {
      let paramValue = new URLSearchParams(window.location.search).get(paramName);
      if (paramValue) {
        return paramValue; // Return here ends the function
      }
      return null; // It's a good practice to return a default value if nothing is found
    }

    setInputElementValue('0-2/ps_partner_key', checkAndLogParam('ps_partner_key'));
    setInputElementValue('0-2/ps_xid', checkAndLogParam('ps_xid'));
    setInputElementValue('ps_partner_key', checkAndLogParam('ps_partner_key'));
    setInputElementValue('ps_xid', checkAndLogParam('ps_xid'));
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
      logFullstory('Form Button Clicked');
      handleHubspotForm(hsForm);
    }
  }

  // Handle Submit
  function fireSubmit() {
    processQualificationAndForm();
  }

  const successSubmit = () => {
    const success = $('.demo-form_success');
    const showSchedule = isSchedule && qualified;
    const shouldRedirect =
      !window.location.href.includes('/blog/') &&
      !window.location.href.includes('/resources/') &&
      !window.location.href.includes('/downloads/');

    // Toggle Loading
    toggleLoader(false);
    wfForm.hide();

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
    else if (shouldRedirect) {
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
  hbspt.forms.create({
    portalId: '6449395',
    formId: 'f3807262-aed3-4b9c-93a3-247ad4c55e60',
    target: '#hbst-form',
    onFormReady: onFormReadyCallback,
    onFormSubmit: function () {
      console.log('Submit');
      logFullstory('Form Submission Attempt');
    },
    onFormSubmitted: () => {
      logFullstory('Form Submission Sent');
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
  new Cleave('input[name="cellphone"]', {
    numericOnly: true,
    blocks: [0, 3, 3, 4, 10],
    delimiters: ['(', ') ', '-'],
    delimiterLazyShow: true,
  });

  //#endregion
});
