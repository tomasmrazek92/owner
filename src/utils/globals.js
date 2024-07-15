export const setInputElementValue = (elementName, value) => {
  $(`input[name="${elementName}"]`).val(value);
};

export const getInputElementValue = (elementName) => {
  return $(`input[name="${elementName}"]`).val();
};
// --- VideoPlay

export const videoPlay = () => {
  const videoBoxes = $('[vimeo-btn]');
  const modal = $('[vimeo-modal]');
  const videoElement = modal.find('video').get(0); // get DOM element from jQuery object

  const isMobileDevice = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const initializePlayer = (videoLink) => {
    videoElement.src = videoLink;
    videoElement.load();
    videoElement.play().catch(console.error);

    modal.fadeIn('fast', () => {
      $('body').addClass('no-animation');
      if (isMobileDevice()) {
        videoElement.requestFullscreen().catch(console.error);
      }
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
      console.log(videoLink);
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
