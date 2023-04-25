import { getItem, setItem } from '$utils/googlePlace';
import { setGooglePlaceDataToForm } from '$utils/googlePlace';

const googlePlaceFromStorage = getItem('restaurant');
if (googlePlaceFromStorage) {
  setGooglePlaceDataToForm(googlePlaceFromStorage);
  setInputElementValue('restaurant-name', getItem('restaurant-value'));
}

const gpaOptions = {
  componentRestrictions: { country: 'us' },
};

$('input[name="restaurant-name"]').each(function () {
  const autocomplete = new google.maps.places.Autocomplete(this, gpaOptions);
  const self = $(this);

  autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();
    const value = self.val();

    setGooglePlaceDataToForm(place);
    setItem('restaurant-value', value);
    setItem('restaurant', place);
    setInputElementValue('restaurant-name', getItem('restaurant-value'));
    $('input[name="restaurant-name"]').siblings('.field-validation').hide();
  });
});
