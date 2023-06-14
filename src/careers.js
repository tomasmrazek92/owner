import { heroVideo } from '$utils/globals';
import { createSwiper } from '$utils/swipers';

// --- Hero Video
heroVideo();

let careerSlider = $('.n_section-career-team');

if (careerSlider) {
  createSwiper(careerSlider, '.swiper.n_team-swiper', 'career-slider', {
    slidesPerView: 'auto',
    spaceBetween: 32,
  });
}
