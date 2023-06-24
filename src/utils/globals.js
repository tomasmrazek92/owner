export const setInputElementValue = (elementName, value) => {
  $(`input[name=${elementName}]`).val(value);
};

// --- Hero Video

export const videoPlay = () => {
  const vimeoboxes = $('[vimeo-btn]');
  const modal = $('.n_vimeo-lightbox');
  const iframe = modal.find('iframe').get(0); // get DOM element from jQuery object

  let player = null;

  const initializePlayer = (vimeoLink) => {
    if (player) {
      player.unload().catch(console.error);
    }

    // Set iframe src
    iframe.src = vimeoLink;

    // Listen for iframe to load
    iframe.addEventListener('load', function () {
      player = new Vimeo.Player(iframe);
      player.play().catch(console.error);
    });
  };

  const cleanupPlayer = () => {
    if (player) {
      player
        .pause()
        .then(() => player.unload())
        .catch(console.error);
      iframe.src = '';
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
};
