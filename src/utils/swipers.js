export const createSwiper = (componentSelector, swiperSelector, classSelector, options) => {
  // Globals
  const arrows = '.swiper_arrow';
  const pagination = '.swiper-navigation';

  // For Each
  $(componentSelector).each(function () {
    // Tag Instance
    let index = $(this).index();
    let instanceClass = `${classSelector}_${index}`;
    $(this).find(swiperSelector).addClass(instanceClass);
    $(this).find(arrows).addClass(instanceClass);
    $(this).find(pagination).addClass(instanceClass);

    // Build Options
    let swiperOptions = Object.assign({}, options, {
      speed: 750,
      threshold: 20,
      navigation: {
        prevEl: `${arrows}.prev.${instanceClass}`,
        nextEl: `${arrows}.next.${instanceClass}`,
      },
      pagination: {
        el: `${pagination}.${instanceClass}`,
        type: 'bullets',
        bulletActiveClass: 'w-active',
        bulletClass: 'w-slider-dot',
        clickable: true,
      },
    });

    // Check if autoplay is in options
    const hasAutoplay = options && options.autoplay;

    // If autoplay exists, remove it from initial options
    // We'll add it back when the swiper is in view
    if (hasAutoplay) {
      const autoplaySettings = { ...options.autoplay };
      delete swiperOptions.autoplay;
    }

    // Update Options
    for (let key in options) {
      if (key in swiperOptions && key !== 'autoplay') {
        swiperOptions[key] = options[key];
      }
    }

    // Init Slider
    let swiper = new Swiper(`${swiperSelector}.${instanceClass}`, swiperOptions);

    // Handle autoplay on scroll into view
    if (hasAutoplay) {
      const swiperElement = $(this).find(`${swiperSelector}.${instanceClass}`)[0];

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Swiper is in view, start autoplay
              swiper.params.autoplay = options.autoplay;
              swiper.autoplay.start();
            } else {
              // Swiper is out of view, pause autoplay
              swiper.autoplay.stop();
            }
          });
        },
        { threshold: 0.1 }
      ); // Trigger when at least 10% of the swiper is visible

      // Start observing the swiper
      observer.observe(swiperElement);
    }

    // Push to Global for possible references
    // store swiper instance in object using classSelector as key
    swipers[classSelector] = swipers[classSelector] || {};
    swipers[classSelector][index] = swiper;
  });
};
