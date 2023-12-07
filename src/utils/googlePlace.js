import { toggleValidationMsg } from '$utils/formValidations';
import { setInputElementValue } from '$utils/globals';
import { getItem, setItem } from '$utils/localStorage';

const restaurantObject = 'restaurant';

const setAddressComponents = (googlePlace, componentForm) => {
  let route = '';
  let streetNumber = '';

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

  setInputElementValue('restaurant-address', `${streetNumber} ${route}`);
};

const setTypes = (googlePlace) => {
  if (!googlePlace.types) return;
  const typesAsString = googlePlace.types.join(', ');
  setInputElementValue('place_types', typesAsString);
};

const setOtherComponents = (googlePlace, componentForm) => {
  Object.keys(componentForm).forEach((key) => {
    if (key === 'address_components') return;
    const value = googlePlace[key];
    if (value) setInputElementValue(key, value);
  });
};

const setGooglePlaceDataToForm = (googlePlace) => {
  if (!googlePlace) return;

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

  const gpaOptions = {};

  $('input[name="restaurant-name"]').each(function () {
    const autocomplete = new google.maps.places.Autocomplete(this, gpaOptions);
    const self = $(this);

    autocomplete.addListener('place_changed', function () {
      console.log('place-changed');
      const place = autocomplete.getPlace();
      const value = self.val();

      // Reset Val
      toggleValidationMsg(self, false, $(self).attr('base-text'));

      // Set Content
      setGooglePlaceDataToForm(place);
      setItem('restaurant-value', value);
      setItem(restaurantObject, place);
      setInputElementValue('restaurant-name', getItem('restaurant-value'));
    });
  });
};

const checkIfRestaurant = () => {
  // Parse the localStorage object into a JavaScript object
  const placeObject = JSON.parse(localStorage.getItem(restaurantObject));

  // Check if the types array includes at least one of the valid types
  const validTypes = ['bar', 'cafe', 'bakery', 'food', 'restaurant'];
  for (let i = 0; i < validTypes.length; i++) {
    if (placeObject.types.includes(validTypes[i])) {
      return true;
    }
  }
  return false;
};

export {
  checkIfRestaurant,
  initGooglePlaceAutocomplete,
  restaurantObject,
  setGooglePlaceDataToForm,
};
