"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/globals.js
  var setInputElementValue = (elementName, value) => {
    $(`input[name=${elementName}]`).val(value);
  };
  var videoPlay = () => {
    const vimeoboxes = $("[vimeo-btn]");
    const modal = $(".n_vimeo-lightbox");
    const iframe = modal.find("iframe").get(0);
    let player = null;
    const initializePlayer = (vimeoLink) => {
      if (player) {
        player.unload().catch(console.error);
      }
      iframe.src = vimeoLink;
      iframe.addEventListener("load", function() {
        player = new Vimeo.Player(iframe);
        player.play().catch(console.error);
      });
    };
    const cleanupPlayer = () => {
      if (player) {
        player.pause().then(() => player.unload()).catch(console.error);
        iframe.src = "";
      }
    };
    if (vimeoboxes.length > 0) {
      vimeoboxes.on("click", function() {
        const vimeoLink = $(this).attr("vimeo-url");
        if (vimeoLink) {
          initializePlayer(vimeoLink);
        }
      });
      modal.children().not(".w-embed").on("click", cleanupPlayer);
    }
  };
  var heroVideo = () => {
    $("[hero-video-thumb]").click(function(e) {
      let video = $(this).closest("[hero-video-box]").find("[hero-video]")[0];
      e.stopPropagation();
      if (video.paused) {
        video.play();
      }
      $("[hero-video-thumb]").hide();
    });
  };

  // src/utils/formValidations.js
  var toggleValidationMsg = (element, condition, msg) => {
    const validation = $(element).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");
    const formField = $(element).closest(".form-field, [form-field]");
    formField.toggleClass("error", condition);
    validation.toggle(condition);
    if (msg) {
      validation.text(msg);
    }
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
        console.log("place-changed");
        const place = autocomplete.getPlace();
        const value = self.val();
        toggleValidationMsg(self, false, $(self).attr("base-text"));
        setGooglePlaceDataToForm(place);
        setItem("restaurant-value", value);
        setItem(restaurantObject, place);
        setInputElementValue("restaurant-name", getItem("restaurant-value"));
      });
    });
  };

  // src/utils/swipers.js
  var swipers = [];
  var createSwiper = (componentSelector, swiperSelector, classSelector, options) => {
    const arrows = ".swiper_arrow";
    const pagination = ".swiper-navigation";
    $(componentSelector).each(function() {
      let index = $(this).index();
      let instanceClass = `${classSelector}_${index}`;
      $(this).find(swiperSelector).addClass(instanceClass);
      $(this).find(arrows).addClass(instanceClass);
      $(this).find(pagination).addClass(instanceClass);
      let swiperOptions = Object.assign({}, options, {
        speed: 250,
        navigation: {
          prevEl: `${arrows}.prev.${instanceClass}`,
          nextEl: `${arrows}.next.${instanceClass}`
        },
        pagination: {
          el: `${pagination}.${instanceClass}`,
          type: "bullets",
          bulletActiveClass: "w-active",
          bulletClass: "w-slider-dot"
        }
      });
      for (let key in options) {
        if (key in swiperOptions) {
          swiperOptions[key] = options[key];
        }
      }
      let swiper = new Swiper(`${swiperSelector}.${instanceClass}`, swiperOptions);
      swipers[classSelector] = swipers[classSelector] || {};
      swipers[classSelector][index] = swiper;
    });
  };

  // src/index.js
  $(document).ready(() => {
    gsap.registerPlugin(ScrollTrigger);
    initGooglePlaceAutocomplete();
    videoPlay();
    heroVideo();
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
    function checkVisibility() {
      if (window.innerWidth <= 991) {
        let button = $('.main-wrapper .n_button[href="/demo"]').first();
        let navButton = $(".n_navbar_actions .n_button");
        if (button.length) {
          if (!isInViewport(button)) {
            navButton.fadeIn();
          } else {
            navButton.fadeOut();
          }
        }
      }
    }
    window.onscroll = checkVisibility;
    $(window).on("load", checkVisibility);
    function isInViewport(element) {
      var rect = element.get(0).getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }
    let scrollPosition;
    let menuOpen = false;
    const disableScroll = () => {
      if (!menuOpen) {
        scrollPosition = $(window).scrollTop();
        $("html, body").scrollTop(0).addClass("overflow-hidden");
      } else {
        $("html, body").scrollTop(scrollPosition).removeClass("overflow-hidden");
      }
      menuOpen = !menuOpen;
    };
    $(".n_navbar-hamburger").on("click", disableScroll);
    let backBtn = $(".n_navbar-back");
    let navBrand = $(".n_nav_brand");
    const switchNav = (btn, nav) => {
      backBtn.toggle(btn);
      navBrand.toggle(nav);
    };
    let movingDiv = document.querySelector(".n_navbar-dropdown-bg");
    let dropdowns = document.querySelectorAll(".n_navbar-dropdown");
    let arrow = document.querySelector(".n_navbar-arrow");
    let divIsActive = false;
    let leaveTimeout;
    let duration = 0.3;
    let lastIndex;
    const moveDiv = (element) => {
      if (leaveTimeout)
        clearTimeout(leaveTimeout);
      let submenu = element.querySelector(".n_navbar-dropdown_wrap");
      let menuBox = element.querySelectorAll(".n_navbar-dropdown_wrap-inner");
      let rect = submenu.getBoundingClientRect();
      let tl = gsap.timeline({ defaults: { ease: Circ.easeOut } });
      let rectX = element.getBoundingClientRect();
      let centerX = rectX.width / 2;
      if (!divIsActive) {
        tl.set(movingDiv, {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        });
        tl.set(arrow, {
          x: `${centerX}px`,
          yPercent: 100
        });
        tl.to(movingDiv, { autoAlpha: 1, duration });
        tl.to(arrow, { yPercent: 0, duration: 0.15 }, "<0.1");
        divIsActive = true;
      } else {
        tl.to(movingDiv, {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          duration
        });
        tl.to(
          arrow,
          {
            duration: 0.25,
            x: `${centerX}px`
          },
          "<"
        );
        if (lastIndex < element.index) {
          tl.fromTo(
            menuBox,
            {
              xPercent: 5
            },
            {
              xPercent: 0,
              duration: 0.2
            },
            "<"
          );
        } else if (lastIndex > element.index) {
          tl.fromTo(
            menuBox,
            {
              xPercent: -5
            },
            {
              xPercent: 0,
              duration: 0.2
            },
            "<"
          );
        }
      }
      lastIndex = element.index;
    };
    const delayedHideDiv = () => {
      leaveTimeout = setTimeout(hideDiv, 10);
    };
    const hideDiv = () => {
      gsap.to(movingDiv, { duration, autoAlpha: 0 });
      divIsActive = false;
    };
    window.addEventListener("resize", hideDiv);
    ScrollTrigger.matchMedia({
      // large
      "(min-width: 992px)": function() {
        dropdowns.forEach((dropdown, index) => {
          dropdown.index = index;
          dropdown.addEventListener("mouseenter", () => moveDiv(dropdown));
          dropdown.addEventListener("mouseleave", delayedHideDiv);
          window.addEventListener("resize", () => {
            if (dropdown.matches(":hover")) {
              moveDiv(dropdown);
            }
          });
        });
      }
    });
    $(".n_navbar-dropdown").on("click", function() {
      if ($(window).width() < 992) {
        switchNav(true, false);
      }
    });
    $(document).on("click", function() {
      if ($(window).width() < 992) {
        setTimeout(function() {
          let openDropdown = $(".w-dropdown-toggle.w--open");
          if (!openDropdown.length) {
            switchNav(false, true);
          } else {
          }
        }, 170);
      }
    });
    $(window).on("resize", function() {
      if ($(window).width() > 991) {
        switchNav(false, true);
      }
    });
    $("form[data-submit=prevent]").submit(function(e) {
      e.preventDefault();
    });
    $("form[data-submit=prevent]").on("keydown", function(e) {
      if (e.key === "Enter") {
        $(this).find("[data-submit]").click();
      }
    });
    let tabs = $(".n_feature-tab");
    let openClass = "current";
    let firstClick = true;
    let visualsHeight;
    tabs.each(function() {
      let items = $(this).find(".n_feature-tab_list-item");
      let visuals = $(this).find(".n_feature-tab_visual").find(".n_feature-tab_visual-inner");
      let actionsMask = $(this).find(".n_feature-tab_list-item_actions");
      let visualReMask = $(this).find(".n_feature-tab_visual_r");
      visualsHeight = visualReMask.height();
      items.on("click", function() {
        let self = $(this);
        let index = self.index();
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
              visuals.find("video").each(function() {
                let allVideo = $(this)[0];
                allVideo.currentItem = 0;
                allVideo.pause();
              });
              let video = visuals.eq(index).find("video")[0];
              if (video) {
                video.currentTime = 0;
                video.addEventListener("canplaythrough", function() {
                  video.play();
                });
              }
            }
          });
          firstClick = false;
        }
      });
      let resizeTimeout;
      const triggerItemClick = () => items.eq(0).trigger("click", false);
      triggerItemClick();
      let windowWidth2 = window.innerWidth;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const currentWindowWidth = window.innerWidth;
          if (currentWindowWidth !== windowWidth2) {
            visualsHeight = $(visualReMask).css("height", "auto").height();
            items.removeClass(openClass);
            triggerItemClick();
            windowWidth2 = currentWindowWidth;
          }
        }, 250);
      });
      function revealTab(elem) {
        let mask = $(elem).find(actionsMask);
        let visualRe = $(elem).find(visualReMask);
        let allItems = $(actionsMask).add(visualReMask);
        if (window.innerWidth < 991) {
          $(visualReMask).show();
        } else {
          $(visualReMask).hide();
        }
        allItems.animate({ height: 0 }, { duration: firstClick ? 0 : 400, queue: false });
        if (mask.length) {
          mask.stop().animate(
            {
              height: mask.get(0).scrollHeight
            },
            { duration: firstClick ? 0 : 400, queue: false },
            function() {
              $(mask).height("auto");
            }
          );
        }
        if (visualRe.length) {
          visualRe.stop().css("height", "auto");
        }
      }
    });
    let swiper;
    let reVisuals;
    let init = false;
    let pendingVideo = null;
    function swiperMode() {
      const mobile = window.matchMedia("(min-width: 0px) and (max-width: 991px)");
      const desktop = window.matchMedia("(min-width: 992px)");
      let visuals = $(".hp-slider_visuals._1").find(".hp-slider_visuals-item");
      let listItems = $(".hp-slider_content-inner._1").find(".hp-slider_list-item");
      let slides = $(".hp-slider_slider._1").find(".swiper-slide.n_hp-slider");
      if (desktop.matches) {
        if (init) {
          if (swiper && swiper.destroyed === false) {
            swiper.destroy(true, true);
          }
          if (reVisuals && reVisuals.destroyed === false) {
            reVisuals.destroy(true, true);
          }
          init = false;
        }
        swiper = new Swiper(".hp-slider_slider._1", {
          slidesPerView: 1,
          speed: 250,
          navigation: {
            prevEl: `.swiper_arrow.prev.n_hp-slider`,
            nextEl: `.swiper_arrow.next.n_hp-slider`
          },
          autoHeight: true,
          slideToClickedSlide: true,
          observer: true,
          observeParents: true,
          on: {
            beforeTransitionStart: (swiper2) => {
              let index = swiper2.realIndex;
              crossfade(visuals, index, true);
              crossfade(listItems, index);
            },
            slideChange: (swiper2) => {
              let index = swiper2.realIndex;
              slides.each(function() {
                if ($(this).index() < index) {
                  $(this).find(".hp-slider_slide").addClass("offset");
                } else {
                  $(this).find(".hp-slider_slide").removeClass("offset");
                }
              });
            }
          },
          breakpoints: {
            0: { autoHeight: true },
            480: { autoHeight: true },
            768: { autoHeight: true },
            992: { autoHeight: true }
          }
        });
        init = true;
      } else if (mobile.matches) {
        if (init) {
          if (swiper) {
            swiper.destroy(true, true);
          }
          init = false;
        }
        swiper = new Swiper(".hp-slider_slider._2", {
          slidesPerView: 1,
          speed: 250,
          navigation: {
            prevEl: `.swiper_arrow.prev.n_hp-slider`,
            nextEl: `.swiper_arrow.next.n_hp-slider`
          },
          autoHeight: true,
          slideToClickedSlide: true,
          observer: true,
          observeParents: true,
          on: {
            slideChange: (swiper2) => {
              playSliderVideo($(".hp-slider_visuals-box._2").find("video").eq(swiper2.realIndex)[0]);
            }
          },
          breakpoints: {
            0: { autoHeight: true },
            480: { autoHeight: true },
            768: { autoHeight: true },
            992: { autoHeight: true }
          }
        });
        reVisuals = new Swiper(".hp-slider_visuals-box._2", {
          slidesPerView: 1,
          speed: 250,
          autoHeight: true,
          slideToClickedSlide: true,
          observer: true,
          observeParents: true
        });
        swiper.controller.control = reVisuals;
        reVisuals.controller.control = swiper;
        init = true;
      }
    }
    function crossfade(elements, index, instant) {
      elements.filter(":visible").css("position", "absolute").stop().animate({ opacity: 0 }, instant ? 0 : "fast", function() {
        $(this).hide();
      });
      elements.eq(index).css("position", "relative").css("opacity", 0).show().stop().animate({ opacity: 1 }, instant ? 0 : "fast");
      const mediaQuery = window.matchMedia("(min-width: 922px)");
      let selector;
      if (mediaQuery.matches) {
        selector = ".hp-slider_visuals-item video";
      } else {
        selector = ".hp-slider_visuals-box._2 video";
      }
      let video = $(selector).eq(index)[0];
      if (video) {
        playSliderVideo(video);
      }
    }
    let currentPlayingVideo = null;
    function handleVideoEvent(e) {
      if (e.target === currentPlayingVideo) {
        const index = swiper.realIndex;
        const nextIndex = (index + 1) % swiper.slides.length;
        swiper.slideTo(nextIndex);
      } else {
      }
    }
    function playSliderVideo(el) {
      const mediaQuery = window.matchMedia("(min-width: 922px)");
      let selector;
      if (mediaQuery.matches) {
        selector = ".hp-slider_visuals-item video";
      } else {
        selector = ".hp-slider_visuals-box._2 video";
      }
      const videos = document.querySelectorAll(selector);
      if (currentPlayingVideo) {
        currentPlayingVideo.removeEventListener("ended", handleVideoEvent);
      }
      currentPlayingVideo = el;
      currentPlayingVideo.addEventListener("ended", handleVideoEvent);
      videos.forEach((video) => {
        if (video !== el) {
          video.pause();
          video.currentTime = 0;
        }
      });
      setTimeout(() => {
        const playPromise = currentPlayingVideo.play();
        if (playPromise) {
          playPromise.then(() => {
            console.log("Playback started");
          }).catch((err) => {
            console.log("Playback failed", err);
          });
        }
      }, 100);
    }
    window.addEventListener("load", function() {
      swiperMode();
    });
    var windowWidth = window.innerWidth;
    window.addEventListener("resize", function() {
      if (window.innerWidth !== windowWidth) {
        windowWidth = window.innerWidth;
        swiperMode();
      }
    });
    let observer;
    function initializeObserver() {
      if (observer) {
        observer.disconnect();
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const visibleVideo = $(entry.target).find("video:visible")[0];
              if (visibleVideo) {
                playSliderVideo(visibleVideo);
                observer.disconnect();
              }
            }
          });
        },
        {
          threshold: 0.5
        }
      );
      observer.observe($(".hp-slider_inner")[0]);
    }
    $(document).ready(function() {
      initializeObserver();
    });
    let csSlider = $(".n_section-cs");
    if (csSlider) {
      createSwiper(csSlider, ".swiper.n_case-studies", "case-study-slider", {
        slidesPerView: 1,
        spaceBetween: 48
      });
    }
  });
})();
//# sourceMappingURL=index.js.map
