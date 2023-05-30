export const setInputElementValue = (elementName, value) => {
  $(`input[name=${elementName}]`).val(value);
};

// --- Hero Video

export const heroVideo = () => {
  let video = $('#hero-video')[0];

  $('.n_hero-video_thumb').click(function (e) {
    e.stopPropagation(); // Prevent event propagation to avoid conflicts
    if (video.paused) {
      video.play();
    }
    $(this).hide();
  });
};
