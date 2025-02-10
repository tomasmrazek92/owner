import { validateInput } from '$utils/formValidations';
import { initGooglePlaceAutocomplete } from '$utils/googlePlace';
import { getItem, setItem } from '$utils/localStorage';
import { createSwiper } from '$utils/swipers';

// #region Swipers
createSwiper('.section_hp-slider', '.hp-slider_wrap', 'hp-hero', {
  slidesPerView: 1,
  spaceBetween: 12,
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

// #endregion

// #region Grader

// Validate Fields Internally
function internalValidation() {
  // Global Validate checker
  let isValid = true;

  // Validate all inputs internally
  $('.hp-slider_item-form form')
    .find(':input:visible, select')
    .each(function () {
      let validate = validateInput($(this));
      isValid = isValid && validate;
    });

  return isValid;
}

$('.hp-grader_btn-submit').on('click', function (e) {
  e.preventDefault();

  let isValid = internalValidation();
  if (isValid) {
    let restaurant = getItem('restaurant');
    window.open(
      `https://grader.owner.com/?placeid=${restaurant.place_id}&utm_source=homepage`,
      '_blank'
    );
  }
});

const waitForGoogleAutocomplete = (callback, maxAttempts = 10) => {
  let attempts = 0;

  const checkAutocomplete = () => {
    attempts++;

    if (window.googleAutocomplete) {
      // Autocomplete exists, execute callback
      callback(window.googleAutocomplete);
    } else if (attempts < maxAttempts) {
      // Try again in 500ms
      setTimeout(checkAutocomplete, 500);
    } else {
      console.warn('Google Autocomplete initialization timeout');
    }
  };

  checkAutocomplete();
};

// Usage
waitForGoogleAutocomplete((autocomplete) => {
  autocomplete.addListener('place_changed', function () {
    let restaurant = getItem('restaurant');
    window.open(
      `https://grader.owner.com/?placeid=${restaurant.place_id}&utm_source=homepage`,
      '_blank'
    );
  });
});

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
