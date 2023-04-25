import { getItem, setItem } from '$utils/googlePlace';

const setInputElementValue = (elementName, value) => {
  $(`input[name=${elementName}]`).val(value);
};

const setAddressComponents = (googlePlace, componentForm) => {
  let route = "";
  let streetNumber = "";

  googlePlace.address_components.forEach(component => {
    const addressType = component.types[0];
    const type = componentForm.address_components[addressType];

    if (type) {
      const val = component[type];
      if (addressType === "route") route = val;
      else if (addressType === "street_number") streetNumber = val;
      else setInputElementValue(addressType, val);
    }
  });

  setInputElementValue("restaurant-address", `${streetNumber} ${route}`);
};

const setTypes = (googlePlace) => {
  if (!googlePlace.types) return;
  const typesAsString = googlePlace.types.join(", ");
  setInputElementValue("place_types", typesAsString);
};

const setOtherComponents = (googlePlace, componentForm) => {
  Object.keys(componentForm).forEach(key => {
    if (key === "address_components") return;
    const value = googlePlace[key];
    if (value) setInputElementValue(key, value);
  });
};

export const setGooglePlaceDataToForm = (googlePlace) => {
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

  setAddressComponents(googlePlace, componentForm);
  setTypes(googlePlace);
  setOtherComponents(googlePlace, componentForm);
};