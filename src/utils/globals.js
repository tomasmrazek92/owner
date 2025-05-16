export const setInputElementValue = (elementName, value) => {
  const $input = $(`input[name="${elementName}"]`);

  if ($input.attr('type') === 'checkbox') {
    $input.prop('checked', value);
  } else {
    $input.val(value);
  }
};

export const getInputElementValue = (elementName) => {
  return $(`input[name="${elementName}"]`).val();
};

// Condition Logic for input
export const locationType = () => {
  $('select[name="person-type"]').on('change', function () {
    let val = $(this).val();

    // Show Locations
    if (val === "I'm a restaurant owner or manager") {
      $('#locations-wrap').show();
    } else {
      $('#locations-wrap').hide();
    }
  });
};

// --- VideoPlay
export const videoPlay = () => {
  const videoBoxes = $('[vimeo-btn]');
  const modal = $('[vimeo-modal]');
  const videoElement = modal.find('video').get(0); // get DOM element from jQuery object

  const initializePlayer = (videoLink) => {
    videoElement.src = videoLink;
    videoElement.load();
    videoElement.play().catch(console.error);

    modal.fadeIn('fast', () => {
      $('body').addClass('no-animation');
    });
  };

  const cleanupPlayer = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
    videoElement.pause();
    videoElement.removeAttribute('src'); // Clear the video source
    $('body').removeClass('no-animation');
  };

  if (videoBoxes.length > 0) {
    videoBoxes.on('click', function () {
      const videoLink = $(this).attr('vimeo-url');
      if (videoLink) {
        initializePlayer(videoLink);
      }
    });

    modal.children().not('.w-embed').on('click', cleanupPlayer);
  }

  $('[vimeo-close]').on('click', function () {
    modal.fadeOut();
    cleanupPlayer();
  });
};

export const heroVideo = () => {
  $('[hero-video-thumb]').click(function (e) {
    let allVideos = $('[hero-video]');
    let video = $(this).closest('[hero-video-box]').find('[hero-video]')[0];
    e.stopPropagation();

    // Pause all expect the new one
    allVideos.not(video).each(function () {
      $(this)[0].pause();
    });

    if (video.paused) {
      video.play();
    }
    $(this).hide();
  });
};
