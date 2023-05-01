const render = (options) => {
  function validateItem(element) {
    if (element.name === 'firstName') {
      return 'Error 1';
    }
    if (element.name === 'lastName') {
      return 'Error 2';
    }

    // this equals to
    if (options && options.extendValidateItem) {
      return options.extendValidateItem(element);
    }

    // this
    return options?.extendValidateItem?.(element);
  }

  const validate = () => {
    [].forEach((item) => validateItem(item));
  };

  onSubmit(validate);
};

// form 1
render();

// form 2
const optionsForForm2 = {
  extendValidateItem: (element) => {
    if (element.name === 'address' && element.value === 'Ostrov nad ohri') {
      return 'Error: Ostrov je dira';
    }
  },
};

render(optionsForForm2);
