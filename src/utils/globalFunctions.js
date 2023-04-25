const getPlaceFromSessionStorage = () => {
  const value = localStorage.getItem("restaurant");
  return value ? JSON.parse(value) : null;
};

const setGooglePlaceDataToForm = (googlePlace) => {
  if (!googlePlace) return;

  const componentForm = {
    name: "",
    international_phone_number: "",
    website: "",
    place_id: "",
    rating: "",
    user_ratings_total: "",
    address_components: {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_1: "short_name",
      country: "short_name",
      postal_code: "short_name",
    },
  };

  if (googlePlace.address_components) {
    let route = "";
    let streetNumber = "";

    googlePlace.address_components.forEach(component => {
      const addressType = component.types[0];
      const type = componentForm.address_components[addressType];
      const input = $(`input[name=${addressType}]`);

      if (type) {
        const val = component[type];
        if (addressType === "route") route = val;
        else if (addressType === "street_number") streetNumber = val;
        else input.val(val);
      }
    });

    $("input[name=restaurant-address]").val(`${streetNumber} ${route}`);
  }

  if (googlePlace.types) {
    const typesAsString = googlePlace.types.join(", ");
    $("input[name=place_types]").val(typesAsString);
  }

  Object.keys(componentForm).forEach(key => {
    if (key === "address_components") return;
    const value = googlePlace[key];
    const input = $(`input[name=${key}]`);
    if (input) input.val(value);
  });
};

const googlePlaceFromStorage = getPlaceFromSessionStorage();
if (googlePlaceFromStorage) {
  setGooglePlaceDataToForm(googlePlaceFromStorage);
  $('input[name="restaurant-name"]').val(localStorage.getItem("restaurant-value"));
}

const gpaOptions = {
  componentRestrictions: {country: "us"}
};

$('input[name="restaurant-name"]').each(function () {
  const autocomplete = new google.maps.places.Autocomplete(this, gpaOptions);
  const self = $(this);

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    const value = self.val();

    setGooglePlaceDataToForm(place);
    localStorage.setItem("restaurant-value", value);
    localStorage.setItem("restaurant", JSON.stringify(place));
    $('input[name="restaurant-name"]').val(localStorage.getItem("restaurant-value"));
    $('input[name="restaurant-name"]').siblings(".field-validation").hide();
  });
});
