import { toggleValidationMsg } from '$utils/formValidations';
import { setInputElementValue } from '$utils/globals';
import { getItem, setItem } from '$utils/localStorage';

const restaurantObject = 'restaurant';

const setAddressComponents = (googlePlace, componentForm) => {
  if (!googlePlace) {
    Object.keys(componentForm).forEach((key) => setInputElementValue(key, ''));
    return;
  }

  let route = '';
  let streetNumber = '';

  if (googlePlace.address_components) {
    googlePlace.address_components.forEach((component) => {
      const addressType = component.types[0];
      const type = componentForm.address_components[addressType];

      if (type) {
        const val = component[type];
        if (addressType === 'route') route = val;
        else if (addressType === 'street_number') streetNumber = val;
        else setInputElementValue(addressType, val);
      }
    });
  }

  setInputElementValue('restaurant-address', `${streetNumber} ${route}`);
};

const setTypes = (googlePlace) => {
  if (!googlePlace || !googlePlace.types) return;
  const typesAsString = googlePlace.types.join(', ');
  setInputElementValue('place_types', typesAsString);
};

const setOtherComponents = (googlePlace, componentForm) => {
  if (!googlePlace || !googlePlace.types) return;
  Object.keys(componentForm).forEach((key) => {
    if (key === 'address_components') return;
    const value = googlePlace[key];
    if (value) setInputElementValue(key, value);
  });
};

const setGooglePlaceDataToForm = (googlePlace) => {
  const componentForm = {
    name: '',
    international_phone_number: '',
    website: '',
    place_id: '',
    url: '',
    rating: '',
    user_ratings_total: '',
    address_components: {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'short_name',
      postal_code: 'short_name',
    },
  };

  setAddressComponents(googlePlace, componentForm);
  setTypes(googlePlace);
  setOtherComponents(googlePlace, componentForm);
};

const initGooglePlaceAutocomplete = () => {
  const googlePlaceFromStorage = getItem(restaurantObject);
  if (googlePlaceFromStorage) {
    setGooglePlaceDataToForm(googlePlaceFromStorage);
    setInputElementValue('restaurant-name', getItem('restaurant-value'));
  }

  $('input[name="restaurant-name"]').each(function () {
    const self = $(this);
    const types =
      self
        .attr('data-place-types')
        ?.match(/'([^']+)'/g)
        ?.map((t) => t.replace(/'/g, '')) || [];
    const country = self.attr('data-country-restrict');

    const gpaOptions = {
      types: types.length ? types : undefined,
      componentRestrictions: country ? { country } : undefined,
    };

    // Store the autocomplete instance on window
    window.googleAutocomplete = new google.maps.places.Autocomplete(this, gpaOptions);

    function setValues(state) {
      const place = state ? window.googleAutocomplete.getPlace() : null;
      const value = self.val();

      setGooglePlaceDataToForm(place);
      setItem('restaurant-value', value);
      setItem(restaurantObject, place);
      setInputElementValue('restaurant-name', getItem('restaurant-value'));
    }

    window.googleAutocomplete.addListener('place_changed', function () {
      setValues(true);
      toggleValidationMsg(self, false, $(self).attr('base-text'));
    });

    self.on('change', function () {
      if ($(this).val() !== getItem('restaurant-value')) {
        setValues(false);
      }
    });
  });
};

// Initialize a flag to keep track of validation message display
let validationMsgShown = false;

const checkIfRestaurant = (input) => {
  // Parse the localStorage object into a JavaScript object
  const placeObject = JSON.parse(localStorage.getItem('restaurant'));

  console.log(placeObject);

  // Check if placeObject exists and has a 'types' property that is an array
  if (placeObject && Array.isArray(placeObject.types)) {
    const validTypes = ['bar', 'cafe', 'bakery', 'food', 'restaurant'];

    // Check if any valid type exists in placeObject.types
    const isValid = placeObject.types.some((type) => validTypes.includes(type));

    // Toggle validation message if invalid and hasn't been shown before
    if (!isValid && !validationMsgShown) {
      toggleValidationMsg(input);
      validationMsgShown = true;
      return false;
    }

    return true; // Valid type found, or message has already been shown
  }

  return false; // Return false if placeObject or placeObject.types is invalid
};

export {
  checkIfRestaurant,
  initGooglePlaceAutocomplete,
  restaurantObject,
  setGooglePlaceDataToForm,
};
