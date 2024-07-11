export const setInputElementValue = (elementName, value) => {
  $(`input[name="${elementName}"]`).val(value);
};

export const getInputElementValue = (elementName) => {
  return $(`input[name="${elementName}"]`).val();
};
// --- VideoPlay

export const videoPlay = () => {
  const vimeoboxes = $('[vimeo-btn]');
  const modal = $('[vimeo-modal]');
  const iframe = modal.find('iframe').get(0); // get DOM element from jQuery object

  let player = null;

  const initializePlayer = (vimeoLink) => {
    if (player) {
      player.unload().catch(console.error);
    }

    iframe.src = vimeoLink;

    const onIframeLoad = () => {
      player = new Vimeo.Player(iframe);
      player.play().catch(console.error);
      iframe.removeEventListener('load', onIframeLoad); // Clean up the event listener
    };

    iframe.addEventListener('load', onIframeLoad);

    modal.fadeIn('fast', function () {
      // Ensure the iframe load event is triggered after modal is shown
      iframe.src = vimeoLink;
    });
  };

  const cleanupPlayer = () => {
    if (player) {
      player
        .pause()
        .then(() => player.unload())
        .catch(console.error);
    }
  };

  if (vimeoboxes.length > 0) {
    vimeoboxes.on('click', function () {
      const vimeoLink = $(this).attr('vimeo-url');
      if (vimeoLink) {
        initializePlayer(vimeoLink);
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
