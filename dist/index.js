"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/globals.js
  var setInputElementValue = (elementName, value) => {
    $(`input[name=${elementName}]`).val(value);
  };

  // src/utils/localStorage.js
  var getItem = (key) => {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };
  var setItem = (key, value) => {
    const serializedValue = typeof value === "object" ? JSON.stringify(value) : value;
    localStorage.setItem(key, serializedValue);
  };

  // src/utils/googlePlace.js
  var restaurantObject = "restaurant";
  var setAddressComponents = (googlePlace, componentForm) => {
    let route = "";
    let streetNumber = "";
    googlePlace.address_components.forEach((component) => {
      const addressType = component.types[0];
      const type = componentForm.address_components[addressType];
      if (type) {
        const val = component[type];
        if (addressType === "route")
          route = val;
        else if (addressType === "street_number")
          streetNumber = val;
        else
          setInputElementValue(addressType, val);
      }
    });
    setInputElementValue("restaurant-address", `${streetNumber} ${route}`);
  };
  var setTypes = (googlePlace) => {
    if (!googlePlace.types)
      return;
    const typesAsString = googlePlace.types.join(", ");
    setInputElementValue("place_types", typesAsString);
  };
  var setOtherComponents = (googlePlace, componentForm) => {
    Object.keys(componentForm).forEach((key) => {
      if (key === "address_components")
        return;
      const value = googlePlace[key];
      if (value)
        setInputElementValue(key, value);
    });
  };
  var setGooglePlaceDataToForm = (googlePlace) => {
    if (!googlePlace)
      return;
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
        postal_code: "short_name"
      }
    };
    setAddressComponents(googlePlace, componentForm);
    setTypes(googlePlace);
    setOtherComponents(googlePlace, componentForm);
  };
  var initGooglePlaceAutocomplete = () => {
    const googlePlaceFromStorage = getItem(restaurantObject);
    if (googlePlaceFromStorage) {
      setGooglePlaceDataToForm(googlePlaceFromStorage);
      setInputElementValue("restaurant-name", getItem("restaurant-value"));
    }
    const gpaOptions = {};
    $('input[name="restaurant-name"]').each(function() {
      const autocomplete = new google.maps.places.Autocomplete(this, gpaOptions);
      const self = $(this);
      autocomplete.addListener("place_changed", function() {
        const place = autocomplete.getPlace();
        const value = self.val();
        setGooglePlaceDataToForm(place);
        setItem("restaurant-value", value);
        setItem(restaurantObject, place);
        setInputElementValue("restaurant-name", getItem("restaurant-value"));
      });
    });
  };

  // src/index.js
  $(document).ready(() => {
    initGooglePlaceAutocomplete();
    window.onscroll = () => {
      let navbar = $(".n_nav-wrapper");
      let scrollHeight = $(navbar).height();
      if ($(navbar)) {
        if (window.scrollY > scrollHeight / 2) {
          $(navbar).addClass("pinned");
        } else {
          $(navbar).removeClass("pinned");
        }
      }
    };
    $("form[data-submit=prevent]").submit(function(e) {
      e.preventDefault();
    });
    $("form[data-submit=prevent]").on("keydown", function(e) {
      if (e.key === "Enter") {
        $(this).find("[data-submit]").click();
      }
    });
  });
  var tabs = $(".n_feature-tab");
  var openClass = "current";
  var firstClick = true;
  tabs.each(function() {
    let items = $(this).find(".n_feature-tab_list-item");
    let visuals = $(this).find(".n_feature-tab_visual").find(".n_feature-tab_visual-inner");
    let actionsMask = $(this).find(".n_feature-tab_list-item_actions");
    let visualReMask = $(this).find(".n_feature-tab_visual_r");
    items.on("click", function() {
      let self = $(this);
      let index = self.index();
      console.log(visuals);
      if (!self.hasClass(openClass)) {
        self.addClass(openClass);
        revealTab(self);
        let openItems = items.filter("." + openClass).not(self);
        openItems.each(function() {
          let currentItem = $(this);
          currentItem.removeClass(openClass);
        });
        let animationCount = 0;
        visuals.fadeOut(firstClick ? 0 : 250, function() {
          if (++animationCount === visuals.length) {
            visuals.eq(index).fadeIn(firstClick ? 0 : 2 % 0);
          }
        });
        firstClick = false;
      }
    });
    let resizeTimeout;
    const triggerItemClick = () => items.eq(0).trigger("click", false);
    triggerItemClick();
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        items.removeClass(openClass);
        triggerItemClick();
      }, 250);
    });
    function revealTab(elem) {
      let mask = $(elem).find(actionsMask);
      let visualRe = $(elem).find(visualReMask);
      let visibleItems = mask.add(visualRe);
      let allItems = $(actionsMask).add(visualReMask);
      if (window.innerWidth < 991) {
        $(visualReMask).show();
      } else {
        $(visualReMask).hide();
      }
      allItems.animate({ height: 0 }, firstClick ? 0 : 400);
      visibleItems.animate(
        {
          height: visibleItems.get(0).scrollHeight
        },
        firstClick ? 0 : 400,
        function() {
          $(this).height("auto");
        }
      );
    }
  });
})();
//# sourceMappingURL=index.js.map
