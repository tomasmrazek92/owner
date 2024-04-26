// import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';

// import './scss/profit-margin-calc.scss';

document.addEventListener('DOMContentLoaded', () => {
  // does this page have the calculator?
  let calc = document.querySelector('#profit-margin-calculator');

  if (!calc) {
    return;
  }

  // move form above the key takeaways
  let mainWrap = document.querySelector('.blog-content_wrap-inner');
  mainWrap.insertAdjacentElement('afterbegin', calc);

  let formInputs = document.querySelectorAll('#profit-margin-calculator input');

  // check each input as the user types.
  Array.from(formInputs).forEach((input) => {
    input.addEventListener('input', (event) => {
      formatCommas(event);
    });
  });

  let calcBtn = document.querySelector('#btn--calculate');
  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // if the form is not valid, return early
    let myForm = e.target.closest('form:invalid');
    if (myForm) {
      return;
    }

    // form is valid, proceed
    // get inputs
    let totalRevenue =
      parseFloat(document.querySelector('#total-revenue').value.replaceAll(',', '')) || 0;
    let cogs = parseFloat(document.querySelector('#cogs').value.replaceAll(',', '')) || 0;
    let operatingCosts =
      parseFloat(document.querySelector('#operating-costs').value.replaceAll(',', '')) || 0;

    let grossProfit = roundOff(((totalRevenue - cogs) / totalRevenue) * 100, 2);
    let netProfit = roundOff(((totalRevenue - operatingCosts) / totalRevenue) * 100, 2);

    // render the output values
    document.querySelector('#output--gross-profit').innerText = `${grossProfit}%`;
    document.querySelector('#output--net-profit').innerText = `${netProfit}%`;

    // determine industry comparison
    let industry = document.querySelector('#restaurant-type').value;
    let low, high;

    switch (industry) {
      case 'cafe':
        low = 10;
        high = 15;
        break;

      case 'casual-dining':
        low = 3;
        high = 9;
        break;

      case 'fast-casual':
        low = 2;
        high = 6;
        break;

      case 'fast-food':
        low = 2;
        high = 6;
        break;

      case 'fine-dining':
        low = 10;
        high = 15;
        break;

      case 'pizzeria':
        low = 15;
        high = 15;
        break;

      default:
        low = 1;
        high = 15;
        break;
    }

    let conjunction = 'within';
    let resultColor = 'off-black';

    if (netProfit < low) {
      conjunction = 'lower than';
      resultColor = 'red';
    } else if (netProfit > high) {
      conjunction = 'higher than';
      resultColor = 'green';
    }

    let message = `Your net profit margin is <strong style="color: var(--${resultColor})">${conjunction}</strong> the industry average of ${low}%-${high}%`;
    document.querySelector('#output--message').innerHTML = message;
    document.querySelector('#output--message').classList.remove('hide');
  });

  let resetBtn = document.querySelector('#btn--reset');
  resetBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // clear input values
    document.querySelector('#total-revenue').value = '';
    document.querySelector('#cogs').value = '';
    document.querySelector('#operating-costs').value = '';

    // clear output values
    document.querySelector('#output--gross-profit').innerText = `0%`;
    document.querySelector('#output--net-profit').innerText = `0%`;

    // scroll to the top of the calc
    document
      .querySelector('#profit-margin-calculator')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /*************************************************************************/
  /**
   * Format currency inputs as the user types
   * @param {e} event
   */
  function formatCommas(event) {
    if (event.target.value.includes('-')) {
      event.target.value = event.target.value.replace('-', '');
    }
    let temp = event.target.value.replace(/[^0-9-.]/g, '');
    temp = parseFloat(temp).toLocaleString('en-US');
    event.target.value = temp.replace(' ', '');

    if (event.target.value === 'NaN') {
      event.target.value = '';
    }
  }

  function roundOff(num, places) {
    const x = Math.pow(10, places);
    return Math.round(num * x) / x;
  }

  // tooltip constructor
  tippy('[data-tippy-content]', {
    appendTo: 'parent',
    arrow: false,

    // useful for debugging and styling
    // hideOnClick: false,
    // trigger: 'click',
  });
});
