import {
  toggleValidationMsg,
  validateCheckboxRadio,
  validateInput,
  validationCalled,
} from '$utils/formValidations';
import { fillHubSpot, mirrorHS } from '$utils/hubspotLogic';

// --- MultiStep Form Handling ---
export const multiStep = (hubspotform, inputMapping) => {
  var form = $('[data-form="multistep"]');
  var hsform = $(hubspotform);

  form.each(function () {
    // Vars
    var placeChanged = false;
    var self = $(this);
    var x = 0;

    // Check for query flow
    var steps = $(self).find('[data-form="step"]');
    var totalSteps = steps.length;

    // Initialize the form
    $(self).find('.field-validation').hide();
    $(self)
      .find('[data-text=total-step]')
      .each(function () {
        $(this).text(totalSteps);
      });
    $(self).find('[data-form="step"]').hide();

    // Initial Clear
    $(self).find('.field-validation').hide();
    $(self).find('[data-form="submit-btn"]').hide();
    $(self)
      .find('[data-text=total-step]')
      .each(function () {
        $(this).text(totalSteps);
      });
    steps.hide();

    function formProgress(x) {
      const currentStep = $(self).find('[data-text=current-step]');
      const totalStep = $(self).find('[data-text=total-step]');

      // Ensure the lowest value for x is 1
      x = x + 1;

      let formattedX = x;

      if (totalStep.text() >= 10 && x < 10) {
        formattedX = '0' + x;
      }

      currentStep.text(formattedX);
    }

    // Update Displayed Form Step
    function updateStep() {
      //hide unhide steps
      steps.hide();
      formProgress(x);
      if (x === totalSteps - 1) {
        $(steps[x]).find('[data-form="next-btn"]').text('Submit');
      }
      $(steps[x]).fadeIn('slow');

      //hide unhide button
      const showOrHide = (selector, condition) => $(self).find(selector).toggle(condition);

      if (x === 0 && steps.length !== 1) {
        showOrHide('[data-form="next-btn"]', true);
        showOrHide('[data-form="back-btn"]', false);
        showOrHide('[data-form="submit-btn"]', false);
      } else if (x === steps.length - 1) {
        showOrHide('[data-form="next-btn"]', false);
        showOrHide('[data-form="back-btn"]', false);
        showOrHide('[data-form="submit-btn"]', true);
      } else {
        showOrHide('[data-form="next-btn"]', true);
        showOrHide('[data-form="back-btn"]', true);
        showOrHide('[data-form="submit-btn"]', false);
      }
    }

    // Functions for clicks
    function nextStep() {
      if (x < steps.length - 1) {
        let isValid = validation();
        if (isValid) {
          x++;
          updateStep();
        }
      }
    }

    function backStep() {
      if (x > 0) {
        x -= 1;
        updateStep();
      }
    }

    // Form Validation
    function validation() {
      let isValid = true;

      const inputs = $(steps[x]).find(':input:visible,select');
      inputs.each(function () {
        isValid = validateInput(this) && isValid;
        console.log(isValid);
      });

      const checkboxes = $(steps[x]).find(':checkbox:visible');
      const radios = $(steps[x]).find(':radio:visible');

      isValid = validateCheckboxRadio(checkboxes, 'checkbox') && isValid;
      isValid = validateCheckboxRadio(radios, 'radio') && isValid;

      // Pass Email
      var blacklistInput = hsform.find('input[name=blacklist]').val();
      var blackArr = blacklistInput.split(',');
      var emailVal = self.find('input[type=email]').val();

      if (blackArr.includes(emailVal) && isValid) {
        isValid = false;
        self.trigger('submit');
      }

      validationCalled.add(x);
      return isValid;
    }

    // Validate on Input Change
    $(steps).on(
      'input change',
      ':input:visible, select, :checkbox:visible, :radio:visible',
      function () {
        if (validationCalled.has(x)) {
          validateInput(this);
        }
      }
    );

    function removeRequiredForElements() {
      const steps = $(self).find('[data-form="step"]').not(':visible');
      console.log(steps);
      for (let i = 0; i < steps.length; i++) {
        $(steps[i])
          .find(':input[required], select[required]')
          .each(function () {
            if (!$(this).val()) $(this).data('initially-required', true);
            $(this).removeAttr('required');
          });
      }
    }

    // Clicks
    $(self)
      .find('[data-form="next-btn"]')
      .on('click', function () {
        nextStep();
      });
    $(self)
      .find('[data-form="back-btn"]')
      .on('click', function () {
        backStep();
      });

    $(self)
      .find('[data-form="submit-btn"]')
      .on('click', function (e) {
        let button = $(this);

        e.preventDefault();

        let isValid = validation();
        console.log(isValid);

        if (isValid) {
          fillHubSpot(self, hsform, inputMapping);
          hsform.find('input[type=submit]').trigger('click');
          // set button to disabled
          let initText = $('[data-form="submit-btn"]').val();
          button.val('Submitting');
          button.addClass('disabled');
          button.attr('type', 'disabled');
          setTimeout(function () {
            mirrorHS(hsform);
            // set button back to normal
            button.val(initText);
            button.removeClass('disabled');
            button.attr('type', 'submit');
          }, 3000);
        }
      });

    updateStep();
  });
};
