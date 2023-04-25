import { createSwiper } from '$utils/globalFunctions';

$(document).ready(() => {
  // Swipers
  if ($('.company_content').length) {
    createSwiper('.company_content', '.company_slider', 'company-swiper', {
      slidesPerView: 2,
      spaceBetween: 16,
    });
  }

  if ($('.career_component').length) {
    createSwiper('.career_component', '.career_slider', 'career-swiper', {
      slidesPerView: 1.25,
      spaceBetween: 16,
      breakpoints: {
        // when window width is >= 480px
        479: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
      },
    });
  }

  if ($('.stories_component').length) {
    const slideLength = $('.stories_slider .swiper-slide').length;
    if (slideLength === 0) {
      $('.stories_component').closest('.section').hide();
    } else if (slideLength === 1) {
      $('.stories_slider .swiper-slide').css('max-width', '54rem');
      $('.stories_component .arrows-group').hide();
    } else {
      createSwiper('.stories_component', '.stories_slider-cms', 'stories-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 16,
      });
    }
  }

  if ($('.platform-prev_component').length) {
    createSwiper('.platform-prev_component', '.platform-prev_slider', 'platprevs-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 0,
    });
  }

  // Capabilities
  const navItems = document.querySelectorAll('.cap_navigation-item');
  const anchors = $('.cap-anchor_box .cap-anchor')
    .map(function () {
      return '#' + $(this).attr('id');
    })
    .get();

  const findCurrentAnchorIndex = () => {
    for (let i = 0; i < navItems.length; i++) {
      if (navItems[i].classList.contains('w--current')) {
        return i;
      }
    }
    return -1;
  };

  const scrollToAnchor = (id) => {
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavItemClick = (item, index, event) => {
    if (mobile.matches) {
      event.preventDefault();
      event.stopPropagation();
      navItems.forEach((item) => item.classList.remove('w--current'));
      item.classList.add('w--current');
      const slideIndex = index;
      capSwiper.slideTo(slideIndex);
    }
  };

  const mobile = window.matchMedia('(max-width: 991px)');
  const desktop = window.matchMedia('(min-width: 992px)');
  let capSwiper = null;

  const swiperMode = () => {
    const arrowPrev = $('.cap_slider-actions .slider-arrow');
    arrowPrev.addClass('capabilities-arrow');

    if (desktop.matches) {
      if (capSwiper) {
        capSwiper.destroy(true, true);
        capSwiper = null;
        $(navItems).removeClass('w--current');
      }
    } else if (mobile.matches) {
      $(navItems).removeClass('w--current');
      $(navItems).eq(0).addClass('w--current');
      if (!capSwiper) {
        capSwiper = new Swiper('.cap_content', {
          slidesPerView: 1,
          spaceBetween: 24,
          speed: 250,
          observer: true,
          centeredSlides: true,
          navigation: {
            prevEl: '.slider-arrow.prev.capabilities-arrow',
            nextEl: '.slider-arrow.next.capabilities-arrow',
          },
          on: {
            slideChange: () => {
              navItems.forEach((item, index) => {
                if (index === capSwiper.activeIndex) {
                  item.classList.add('w--current');
                } else {
                  item.classList.remove('w--current');
                }
              });
            },
          },
        });
      }
    }
  };

  // Events
  window.addEventListener('load', () => {
    swiperMode();
  });

  window.addEventListener('resize', () => {
    swiperMode();
  });

  navItems.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      handleNavItemClick(item, index, event);
    });
  });

  // Desktop Arrows Click
  $('.cap_slider-actions.desktop .slider-arrow.prev').click(() => {
    const currentAnchorIndex = findCurrentAnchorIndex();
    if (currentAnchorIndex > 0) {
      scrollToAnchor(anchors[currentAnchorIndex - 1]);
    } else {
      scrollToAnchor(anchors[anchors.length - 1]);
    }
  });

  $('.cap_slider-actions.desktop .slider-arrow.next').click(() => {
    const currentAnchorIndex = findCurrentAnchorIndex();
    if (currentAnchorIndex < anchors.length - 1) {
      scrollToAnchor(anchors[currentAnchorIndex + 1]);
    } else {
      scrollToAnchor(anchors[0]);
    }
  });
});

let arrowLeft = $('.w-icon-slider-left');
let arrowRight = $('.w-icon-slider-right');
let customArrows = $('.about__investor-arrow');

customArrows.on('click', function (element) {
  getDirection(element);
});

function getDirection(element) {
  customArrows.each(function () {
    let directionID = $(this).attr('id');

    if (directionID === 'link-left') {
      if (arrowLeft.is(':hidden')) {
        $(this).hide();
      } else {
        $(this).show();
      }
    }

    if (directionID === 'link-right') {
      if (arrowRight.is(':hidden')) {
        $(this).hide();
      } else {
        $(this).show();
      }
    }
  });

  let clickedDirection = $(element).attr('id');
  if (clickedDirection === 'link-left') {
    arrowLeft.click();
  }
  if (clickedDirection === 'link-right') {
    arrowRight.click();
  }
}

getDirection();

// ------  Menu
var menuOpenAnim = false;
var currentscrollpos;
const menuLinksBox = '.nav_links';
const menuLinks = '.nav_links-inner';
const menuLinksItems = '.nav_link';
const menuButton = '.nav_ham';

let navReveal;

// GSAP's matchMedia
ScrollTrigger.matchMedia({
  '(max-width: 991px)': function () {
    // Apply the animation only on screens with a max-width of 991px
    navReveal = createNavReveal();
  },
});

// Actions
// Open on Click
$(menuButton).on('click', function () {
  openMenu();
  menuToggle.reversed() ? menuToggle.restart() : menuToggle.reverse();
});

// Functions
function openMenu() {
  if (navReveal) {
    playMenuAnimation();
  }
}
function disableScroll() {
  $('html, body').addClass('overflow-hidden');
  currentscrollpos = $(window).scrollTop();
  $('html, body').animate({ scrollTop: 0 }, 0);
}

function enableScroll() {
  $('html, body').removeClass('overflow-hidden');
  $('html, body').animate({ scrollTop: currentscrollpos }, 0);
}
function playMenuAnimation() {
  if (!menuOpenAnim) {
    navReveal.timeScale(1);
    navReveal.play();
  } else {
    navReveal.timeScale(1.5);
    navReveal.reverse();
    enableScroll();
  }
}

// Menu Animation
function createNavReveal() {
  let navReveal = gsap
    .timeline({
      paused: true,
      onComplete: function () {
        if (!navReveal.reversed()) {
          console.log('Disabled');
          disableScroll();
        }
      },
    })
    .addLabel('start')
    .call(function () {
      menuOpenAnim = false;
    })
    .fromTo(menuLinksBox, { display: 'none' }, { display: 'flex' }, '<')
    .fromTo(menuLinks, { yPercent: -100 }, { yPercent: 0 }, '<')
    .addLabel('end')
    .call(function () {
      menuOpenAnim = true;
    });
  return navReveal;
}

var menuToggle = new TimelineMax({ paused: true, reversed: true });
menuToggle
  .fromTo($(menuButton).find('.nav_ham-line').eq(0), 0.2, { y: '0' }, { y: '4' })
  .fromTo($(menuButton).find('.nav_ham-line').eq(2), 0.2, { y: '0' }, { y: '-4' }, '<')
  .fromTo(
    $(menuButton).find('.nav_ham-line').eq(1),
    0.2,
    { xPercent: 0, opacity: 1 },
    { xPercent: 100, opacity: 0 },
    '<'
  )
  .fromTo($(menuButton).find('.nav_ham-line').eq(0), 0.2, { rotationZ: 0 }, { rotationZ: 45 })
  .fromTo(
    $(menuButton).find('.nav_ham-line').eq(2),
    0.2,
    { rotationZ: 0 },
    { rotationZ: -45 },
    '<'
  );
