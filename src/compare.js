import { createSwiper } from '$utils/swipers';

$(document).ready(function () {
  // Top rating
  $('[data-rating]').each(function () {
    let rating = $(this).attr('data-rating');
    let heightPercentage = rating === '?' ? '100%' : (rating / 5) * 100 + '%';

    let tl = gsap.timeline({ delay: 0.5 });

    tl.to($(this), {
      height: heightPercentage,
      duration: 0.5,
      ease: 'power2.out',
    });
    tl.to($(this).find('[data-nest]'), {
      opacity: 1,
    });
  });

  // Reviews
  $('[data-review]').each(function () {
    let element = $(this);
    let counterElement = element.closest('[data-review-row]').find('[data-review-counter]');
    let scoreText = counterElement.text();

    // Check if score is "?"
    if (scoreText === '?') {
      // Just reveal the "?" without animation
      gsap.to(counterElement, {
        opacity: 1,
        duration: 0.5,
      });
      return; // Skip the rest of the animation
    }

    // Continue with normal animation for numeric scores
    let score = parseFloat(scoreText);
    let percentageScore = score * 20;
    let counter = { val: 0 };

    // Set initial width to 0
    element.css('width', '0%');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this).closest('[data-review-comp]'),
        start: 'center bottom',
      },
    });

    // Animate both width and counter
    tl.to(counter, {
      val: score,
      duration: 1,
      onStart: () => {
        gsap.to(counterElement, { opacity: 1 });
      },
      onUpdate: function () {
        counterElement.text(counter.val.toFixed(1));
      },
      ease: 'power2.out',
    });

    tl.to(
      element,
      {
        width: percentageScore + '%',
        duration: 1,
        ease: 'power2.out',
      },
      '<'
    );
  });

  createSwiper('.section_comp-reviews', '.comp-reviews_wrap', 'testimonials-2', {
    slidesPerView: 1,
    speed: 1200,
    spaceBetween: 8,
    loop: true,
    pagination: {
      el: '.swiper-navigation.cc-testimonials2',
      type: 'bullets',
      bulletActiveClass: 'cc-active',
      bulletClass: 'swiper-bullet',
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '"><span></span></span>';
      },
    },
  });
});
