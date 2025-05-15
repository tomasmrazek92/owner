import { toggleValidationMsg } from '$utils/formValidations.js';
import { createSwiper } from '$utils/swipers';

// #region Scroll Disabler

// #endregion

// #region Swipers
createSwiper('.section_hp-slider', '.hp-slider_wrap', 'hp-hero', {
  slidesPerView: 1,
  spaceBetween: 12,
  threshold: 40,
  autoplay: {
    delay: 20000,
  },
  on: {
    autoplayStart: function () {
      $('.hp-slider_wrap .w-slider-dot').removeClass('stopped');
    },
    autoplayStop: function () {
      $('.hp-slider_wrap .w-slider-dot').addClass('stopped');
    },
    slideChange: function (swiper) {
      let slide = $(swiper.slides).eq(swiper.realIndex);
      let video = slide.find('.w-background-video video');

      if (video.length && !video.hasClass('playing')) {
        video.addClass('playing');
        video[0].play();
      }
    },
  },
});

createSwiper('.section_exp-tabs', '.exp-tabs_tabs', 'exp-tabs-menu', {
  slidesPerView: 1,
  spaceBetween: 20,
  slideToClickedSlide: true,
  autoplay: {
    delay: 7000,
  },
  on: {
    autoplayStart: function () {
      $('.swiper-slide-active .exp-tabs_tabs-progress-line').removeClass('stopped');
    },
    autoplayStop: function () {
      $('.swiper-slide-active .exp-tabs_tabs-progress-line').addClass('stopped');
    },
    slideChange: function (swiper) {
      const firstSwiperKey = Object.keys(swipers['exp-tabs-content'])[0];
      const firstSwiper = swipers['exp-tabs-content'][firstSwiperKey];
      firstSwiper.slideTo(swiper.realIndex);
    },
  },
  breakpoints: {
    0: {
      spaceBetween: 16,
    },
    992: {
      spaceBetween: 20,
    },
  },
});

createSwiper('.exp-tabs_slider-box', '.exp-tabs_slider', 'exp-tabs-content', {
  slidesPerView: 1,
  spaceBetween: 0,
  on: {
    slideChange: function (swiper) {
      if (window.innerWidth < 992) {
        const firstSwiperKey = Object.keys(swipers['exp-tabs-menu'])[0];
        const firstSwiper = swipers['exp-tabs-menu'][firstSwiperKey];
        firstSwiper.slideTo(swiper.realIndex);
      }
    },
  },
  breakpoints: {
    0: {
      spaceBetween: 10,
      allowTouchMove: true,
    },
    992: {
      spaceBetween: 0,
      allowTouchMove: false,
    },
  },
});

// #endregion

// #region Grader

$(document).ready(function () {
  initGooglePlaces('#grader-name', '.predictions-container');
});

function initGooglePlaces(inputSelector, predictionsSelector) {
  let autocompleteService;
  let placesService;
  let placeId;
  let selectedIndex = -1;
  let currentPredictions = [];

  const $input = $(inputSelector);
  const $predictionsList = $(predictionsSelector);

  if (!$input.length) return;

  // Get place types from data attribute and clean up any quotes
  const placeTypes = $input
    .data('place-types')
    .split(',')
    .map((type) => type.trim().replace(/['"]/g, ''));

  const countryRestrict = $input.data('country-restrict');

  function redirectToGrader(placeId) {
    if (placeId) {
      let redirectUrl = `https://grader.owner.com/?placeid=${placeId}`;

      const utmParams = sessionStorage.getItem('utmWebParams');

      if (utmParams) {
        redirectUrl += `&${utmParams}`;
      }

      window.open(redirectUrl);
    }
  }

  // Initialize Google Places services
  function initializeServices() {
    if (window.google && window.google.maps) {
      autocompleteService = new google.maps.places.AutocompleteService();
      placesService = new google.maps.places.PlacesService(document.createElement('div'));
    } else {
      console.error('Google Maps API not loaded');
    }
  }

  // Handle input changes
  function handleInput(query) {
    placeId = null;
    selectedIndex = -1;

    if (query.length > 0 && autocompleteService) {
      const searchConfig = {
        input: query,
        types: placeTypes,
      };

      if (countryRestrict) {
        searchConfig.componentRestrictions = { country: countryRestrict };
      }

      autocompleteService.getPlacePredictions(searchConfig, (predictions, status) => {
        displayPredictions(predictions, status);

        // Preselect first option if available (but don't scroll yet)
        if (predictions && predictions.length > 0) {
          // Use a slight delay to ensure the DOM is fully rendered
          setTimeout(() => {
            if (
              $predictionsList.is(':visible') &&
              $predictionsList.find('.prediction-item').length > 0
            ) {
              // Just mark the first item as selected without scrolling
              highlightPrediction(0);
            }
          }, 50); // Small delay for DOM rendering
        }
      });
    } else {
      $predictionsList.html('').addClass('hidden');
    }
  }

  // Display predictions
  function displayPredictions(predictions, status) {
    $predictionsList.html('');
    currentPredictions = [];

    if (
      status === google.maps.places.PlacesServiceStatus.OK &&
      predictions &&
      predictions.length > 0
    ) {
      // Store current predictions for reference
      currentPredictions = predictions;

      predictions.forEach((prediction, index) => {
        const $predictionItem = $(`
        <div class="prediction-item" data-place-id="${prediction.place_id}" data-index="${index}">
          <span class="main-text p13">${prediction.structured_formatting.main_text}</span>
          <span class="secondarytext p13 text-color-content-tertiary">${prediction.structured_formatting.secondary_text}</span>
        </div>
      `);

        $predictionsList.append($predictionItem);
      });

      $predictionsList.removeClass('hidden');
    } else {
      $predictionsList.addClass('hidden');
    }
  }

  // Highlight a prediction without scrolling
  function highlightPrediction(index) {
    const $items = $predictionsList.find('.prediction-item');

    if ($items.length === 0) return;

    // Handle boundary cases with proper wrapping
    if (index >= $items.length) {
      index = 0;
    } else if (index < 0) {
      index = $items.length - 1;
    }

    // Remove selection from all items
    $items.removeClass('selected');

    // Add selection to the current item (without scrolling)
    const $selected = $items.eq(index).addClass('selected');
    selectedIndex = index;
    placeId = $selected.data('place-id');
  }

  // Select a prediction by index with scrolling
  function selectPrediction(index) {
    const $items = $predictionsList.find('.prediction-item');

    if ($items.length === 0) return;

    // Handle boundary cases with proper wrapping
    if (index >= $items.length) {
      index = 0;
    } else if (index < 0) {
      index = $items.length - 1;
    }

    // Remove selection from all items
    $items.removeClass('selected');

    // Add selection to the current item
    const $selected = $items.eq(index).addClass('selected');
    selectedIndex = index;
    placeId = $selected.data('place-id');

    // Wait for next frame to ensure DOM is updated before scrolling
  }

  // Handle place selection
  function handlePlaceSelection(placeId) {
    if (placeId && placesService) {
      placesService.getDetails({ placeId: placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Trigger a custom event with the selected place
          $input.trigger('placeSelected', [place]);

          // Update input with selected place name
          $input.val(place.name);

          // Hide predictions
          $predictionsList.addClass('hidden');

          toggleValidationMsg($input, false);
        }
      });
    }
  }

  function handleEnterKey() {
    const $selected = $predictionsList.find('.prediction-item.selected');

    if ($selected.length) {
      placeId = $selected.data('place-id');
      handlePlaceSelection(placeId);
      redirectToGrader(placeId);
      return true;
    }
    return false;
  }

  // Event listeners
  let debounceTimer;

  // Input event for text changes
  $input.on('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleInput($(this).val());
    }, 300);
  });

  $input.on('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleInput($(this).val());
    }, 300);
  });

  // Key navigation
  $input.on('keydown', function (e) {
    const keyCode = e.which;

    // Handle Enter key regardless of dropdown state
    if (keyCode === 13 && placeId) {
      e.preventDefault();
      redirectToGrader(placeId);
      return false;
    }

    // Only process other keys when predictions are visible
    if (!$predictionsList.hasClass('hidden')) {
      switch (keyCode) {
        case 38: // Up arrow
          e.preventDefault();
          selectPrediction(selectedIndex - 1);
          break;
        case 40: // Down arrow
          e.preventDefault();
          selectPrediction(selectedIndex + 1);
          break;
        case 13: // Enter (with visible dropdown)
          e.preventDefault();
          handleEnterKey();
          break;
        case 27: // Escape
          e.preventDefault();
          $predictionsList.addClass('hidden');
          break;
        case 9: // Tab
          if (selectedIndex >= 0) {
            e.preventDefault();
            const $selected = $predictionsList.find('.prediction-item.selected');
            if ($selected.length) {
              placeId = $selected.data('place-id');
              handlePlaceSelection(placeId);
            }
          }
          break;
      }
    }
  });

  // Click event for prediction items
  $predictionsList.on('click', '.prediction-item', function () {
    placeId = $(this).data('place-id');
    toggleValidationMsg($input, false);
    handlePlaceSelection(placeId);
    redirectToGrader(placeId);
  });

  // Update selected item on mouse hover
  $predictionsList.on('mouseenter', '.prediction-item', function () {
    selectedIndex = parseInt($(this).data('index'), 10);
    $predictionsList.find('.prediction-item').removeClass('selected');
    $(this).addClass('selected');
  });

  // Close predictions when clicking outside
  $(document).on('click', function (event) {
    if (!$(event.target).closest(predictionsSelector).length && !$(event.target).is($input)) {
      $predictionsList.addClass('hidden');
      $input.val('');
    }
  });

  // Submit button click handlers
  $('.hp-grader_btn-submit')
    .add('.hp-grader_btn-submit2')
    .on('click', function (e) {
      if (placeId) {
        redirectToGrader(placeId);
      } else {
        toggleValidationMsg($input, true);
      }
    });

  // Initialize services
  initializeServices();
}

$('.hp-grader_input').on('focus', function () {
  swipers['hp-hero'][0].autoplay.stop();
});
$('.hp-grader_input').on('blur', function () {
  swipers['hp-hero'][0].autoplay.start();
});

// #endregion

// #region Videos
function initVimeoPlayer() {
  // Select all elements that have [data-vimeo-player-init]
  const vimeoPlayers = document.querySelectorAll('[data-vimeo-player-init]');

  vimeoPlayers.forEach(function (vimeoElement, index) {
    // Add Vimeo URL ID to the iframe [src]
    // Looks like: https://player.vimeo.com/video/1019191082
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
    if (!vimeoVideoID) return;
    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=0&muted=1`;
    vimeoElement.querySelector('iframe').setAttribute('src', vimeoVideoURL);

    // Assign an ID to each element
    const videoIndexID = 'vimeo-player-index-' + index;
    vimeoElement.setAttribute('id', videoIndexID);

    const iframeID = vimeoElement.id;
    const player = new Vimeo.Player(iframeID);

    let videoAspectRatio;

    // Update Aspect Ratio if [data-vimeo-update-size="true"]
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
      player.getVideoWidth().then(function (width) {
        player.getVideoHeight().then(function (height) {
          videoAspectRatio = height / width;
          const beforeEl = vimeoElement.querySelector('.vimeo-player__before');
          if (beforeEl) {
            beforeEl.style.paddingTop = videoAspectRatio * 100 + '%';
          }
        });
      });
    }

    // Function to adjust video sizing
    function adjustVideoSizing() {
      const containerAspectRatio = (vimeoElement.offsetHeight / vimeoElement.offsetWidth) * 100;

      const iframeWrapper = vimeoElement.querySelector('.vimeo-bg__iframe-wrapper');
      if (iframeWrapper && videoAspectRatio) {
        if (containerAspectRatio > videoAspectRatio * 100) {
          iframeWrapper.style.width = `${(containerAspectRatio / (videoAspectRatio * 100)) * 100}%`;
        } else {
          iframeWrapper.style.width = '';
        }
      }
    }

    // Adjust video sizing initially
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
      adjustVideoSizing();
      player.getVideoWidth().then(function () {
        player.getVideoHeight().then(function () {
          adjustVideoSizing();
        });
      });
    } else {
      adjustVideoSizing();
    }

    // Adjust video sizing on resize
    window.addEventListener('resize', adjustVideoSizing);
    // Loaded
    player.on('play', function () {
      vimeoElement.setAttribute('data-vimeo-loaded', 'true');
    });

    // Autoplay
    if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'false') {
      // Autoplay = false
      player.setVolume(1);
      player.pause();
    } else {
      // Autoplay = true
      player.setVolume(0);
      vimeoElement.setAttribute('data-vimeo-muted', 'true');

      // If paused-by-user === false, do scroll-based autoplay
      if (vimeoElement.getAttribute('data-vimeo-paused-by-user') === 'false') {
        function checkVisibility() {
          const rect = vimeoElement.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          inView ? vimeoPlayerPlay() : vimeoPlayerPause();
        }

        // Initial check
        checkVisibility();

        // Handle scroll
        window.addEventListener('scroll', checkVisibility);
      }
    }

    // Function: Play Video
    function vimeoPlayerPlay() {
      vimeoElement.setAttribute('data-vimeo-activated', 'true');
      vimeoElement.setAttribute('data-vimeo-playing', 'true');
      player.play();
    }

    // Function: Pause Video
    function vimeoPlayerPause() {
      vimeoElement.setAttribute('data-vimeo-playing', 'false');
      player.pause();
    }

    // Click: Play
    const playBtns = vimeoElement.querySelectorAll('[data-vimeo-control="play"]');
    playBtns.forEach((playBtn) => {
      playBtn.addEventListener('click', function () {
        player.setVolume(0);
        vimeoPlayerPlay();

        const volume = vimeoElement.getAttribute('data-vimeo-muted') === 'true' ? 0 : 1;
        player.setVolume(volume);
      });
    });

    // Click: Pause
    const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        vimeoPlayerPause();
        // If paused by user => kill the scroll-based autoplay
        if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'true') {
          vimeoElement.setAttribute('data-vimeo-paused-by-user', 'true');
          // Removing scroll listener (if you’d like)
          window.removeEventListener('scroll', checkVisibility);
        }
      });
    }

    // Click: Mute
    const muteBtn = vimeoElement.querySelector('[data-vimeo-control="mute"]');
    if (muteBtn) {
      muteBtn.addEventListener('click', function () {
        if (vimeoElement.getAttribute('data-vimeo-muted') === 'false') {
          player.setVolume(0);
          vimeoElement.setAttribute('data-vimeo-muted', 'true');
        } else {
          player.setVolume(1);
          vimeoElement.setAttribute('data-vimeo-muted', 'false');
        }
      });
    }

    // Fullscreen
    // Check if Fullscreen API is supported
    const fullscreenSupported = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );

    const fullscreenBtn = vimeoElement.querySelector('[data-vimeo-control="fullscreen"]');

    // Hide the fullscreen button if not supported
    if (!fullscreenSupported && fullscreenBtn) {
      fullscreenBtn.style.display = 'none';
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const fullscreenElement = document.getElementById(iframeID);
        if (!fullscreenElement) return;

        const isFullscreen =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement;

        if (isFullscreen) {
          // Exit fullscreen
          vimeoElement.setAttribute('data-vimeo-fullscreen', 'false');
          (
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen
          ).call(document);
        } else {
          // Enter fullscreen
          vimeoElement.setAttribute('data-vimeo-fullscreen', 'true');
          (
            fullscreenElement.requestFullscreen ||
            fullscreenElement.webkitRequestFullscreen ||
            fullscreenElement.mozRequestFullScreen ||
            fullscreenElement.msRequestFullscreen
          ).call(fullscreenElement);
        }
      });
    }

    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      vimeoElement.setAttribute('data-vimeo-fullscreen', isFullscreen ? 'true' : 'false');
    };

    // Add event listeners for fullscreen changes (with vendor prefixes)
    [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'msfullscreenchange',
    ].forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    // Convert seconds to mm:ss
    function secondsTimeSpanToHMS(s) {
      let h = Math.floor(s / 3600);
      s -= h * 3600;
      let m = Math.floor(s / 60);
      s -= m * 60;
      return m + ':' + (s < 10 ? '0' + s : s);
    }

    // Duration
    const vimeoDuration = vimeoElement.querySelector('[data-vimeo-duration]');
    player.getDuration().then(function (duration) {
      if (vimeoDuration) {
        vimeoDuration.textContent = secondsTimeSpanToHMS(duration);
      }
      // Update timeline + progress max
      const timelineAndProgress = vimeoElement.querySelectorAll(
        '[data-vimeo-control="timeline"], progress'
      );
      timelineAndProgress.forEach((el) => {
        el.setAttribute('max', duration);
      });
    });

    // Timeline
    const timelineElem = vimeoElement.querySelector('[data-vimeo-control="timeline"]');
    const progressElem = vimeoElement.querySelector('progress');

    function updateTimelineValue() {
      player.getDuration().then(function () {
        const timeVal = timelineElem.value;
        player.setCurrentTime(timeVal);
        if (progressElem) {
          progressElem.value = timeVal;
        }
      });
    }

    if (timelineElem) {
      ['input', 'change'].forEach((evt) => {
        timelineElem.addEventListener(evt, updateTimelineValue);
      });
    }

    // Progress Time & Timeline (timeupdate)
    player.on('timeupdate', function (data) {
      if (timelineElem) {
        timelineElem.value = data.seconds;
      }
      if (progressElem) {
        progressElem.value = data.seconds;
      }
      if (vimeoDuration) {
        vimeoDuration.textContent = secondsTimeSpanToHMS(Math.trunc(data.seconds));
      }
    });

    // Hide controls after hover on Vimeo player
    let vimeoHoverTimer;
    vimeoElement.addEventListener('mousemove', function () {
      if (vimeoElement.getAttribute('data-vimeo-hover') === 'false') {
        vimeoElement.setAttribute('data-vimeo-hover', 'true');
      }
      clearTimeout(vimeoHoverTimer);
      vimeoHoverTimer = setTimeout(vimeoHoverTrue, 3000);
    });

    function vimeoHoverTrue() {
      vimeoElement.setAttribute('data-vimeo-hover', 'false');
    }

    // Video Ended
    function vimeoOnEnd() {
      vimeoElement.setAttribute('data-vimeo-activated', 'false');
      vimeoElement.setAttribute('data-vimeo-playing', 'false');
      player.unload();
    }
    player.on('ended', vimeoOnEnd);
  });
}

// Initialize Vimeo Player
initVimeoPlayer();

// #endregion

// #region Grader Animations
function initTextLoopAnimation(options) {
  const defaults = {
    container: '[data-ai-label]',
    strings: [
      'Scan your site and see what isn’t working',
      'Find out how to get discovered on Google',
      'See how much sales you could get from keywords',
      'Compare yourself with your local competition',
    ],
    duration: 0.5, // Animation duration for fade in/out
    stayDuration: 2, // How long each text stays visible
    yOffset: 4, // How far text moves during animation
    ease: 'power3.out', // GSAP easing function
  };

  const settings = $.extend({}, defaults, options);
  const $container = $(settings.container);

  if ($container.length === 0) {
    console.error('Animation container not found');
    return;
  }

  // Clear container
  $container.empty();

  // Set container to have position relative and determine the tallest height
  $container.css({
    position: 'relative',
    display: 'block',
    width: '100%',
  });

  // First, we need to create spans for each string and measure their height
  settings.strings.forEach((string, index) => {
    const $span = $('<span class="loop-text"></span>');
    $span.text(string);
    $span.css({
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    });
    $container.append($span);
  });

  // Calculate the maximum height needed
  let maxHeight = 0;
  $container.find('.loop-text').each(function () {
    const height = $(this).outerHeight();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  // Set fixed height based on the tallest text
  $container.css('height', maxHeight + 'px');

  // Create the animation timeline
  const $spans = $container.find('.loop-text');
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
  });

  // Initialize all spans to be invisible and below their final position
  gsap.set($spans, {
    opacity: 0,
    y: settings.yOffset,
  });

  // Add each span to the timeline sequentially
  $spans.each((index, span) => {
    // Fade in and move up
    tl.to(span, {
      opacity: 1,
      y: 0,
      duration: settings.duration,
      ease: settings.ease,
    });

    // Hold for specified duration
    tl.to(span, {
      opacity: 1,
      duration: settings.stayDuration,
    });

    // Fade out and move up
    tl.to(span, {
      opacity: 0,
      y: -settings.yOffset,
      duration: settings.duration,
      ease: settings.ease,
    });

    // Small pause between animations
    tl.to({}, { duration: 0.1 });
  });

  return tl;
}

$(document).ready(function () {
  initTextLoopAnimation();
});

// #endregion

// #region dynamicHeight

$(document).ready(function () {
  let realViewportHeight;
  let availableHeight;

  function updateHeights() {
    if (window.visualViewport) {
      realViewportHeight = window.visualViewport.height;
    } else {
      realViewportHeight = window.innerHeight;
    }

    document.documentElement.style.setProperty('--real-viewport-height', `${realViewportHeight}px`);

    const navHeight = $('.nav_wrap').outerHeight() || 0;
    const formWrapHeight = $('.hp-grader_form2-wrap').outerHeight() || 0;
    const predictionsMarginBottom = parseInt($('.predictions-container').css('margin-bottom')) || 0;
    const formWrapBottomValue = parseInt($('.hp-grader_form2-wrap').css('bottom')) || 0;

    availableHeight =
      realViewportHeight -
      navHeight -
      formWrapHeight -
      predictionsMarginBottom -
      formWrapBottomValue;

    document.documentElement.style.setProperty('--grader-list-height', `${availableHeight}px`);
  }

  updateHeights();

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateHeights);
    window.visualViewport.addEventListener('scroll', updateHeights);
  } else {
    $(window).on('resize', updateHeights);
  }

  $(window).on('orientationchange', function () {
    setTimeout(updateHeights, 100);
  });
});

// #endregion
