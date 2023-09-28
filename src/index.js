import { heroVideo, videoPlay } from '$utils/globals';
import { initGooglePlaceAutocomplete } from '$utils/googlePlace';
import { createSwiper } from '$utils/swipers';

$(document).ready(() => {
  gsap.registerPlugin(ScrollTrigger);

  // --- Preload Data from Google API ---
  initGooglePlaceAutocomplete();

  // --- Play Video
  videoPlay();
  heroVideo();

  // --- Menu on Scroll
  // Highlight Button
  window.onscroll = () => {
    let navbar = $('.n_nav-wrapper');
    let scrollHeight = $(navbar).height();
    if ($(navbar)) {
      if (window.scrollY > scrollHeight / 2) {
        $(navbar).addClass('pinned');
      } else {
        $(navbar).removeClass('pinned');
      }
    }
  };

  // Show button on responsive
  function checkVisibility() {
    if (window.innerWidth <= 991) {
      let button = $('.main-wrapper .n_button[href="/demo"]').first();
      let navButton = $('.n_navbar_actions .n_button');

      if (button.length) {
        if (!isInViewport(button)) {
          navButton.fadeIn();
        } else {
          navButton.fadeOut();
        }
      }
    }
  }

  window.onscroll = checkVisibility;

  $(window).on('load', checkVisibility);

  function isInViewport(element) {
    var rect = element.get(0).getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // --- Scroll Disabler
  let scrollPosition;
  let menuOpen = false;

  const disableScroll = () => {
    if (!menuOpen) {
      scrollPosition = $(window).scrollTop();
      $('html, body').scrollTop(0).addClass('overflow-hidden');
    } else {
      $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
    }
    menuOpen = !menuOpen;
  };

  $('.n_navbar-hamburger').on('click', disableScroll);

  // -- Menu dropdown
  let backBtn = $('.n_navbar-back');
  let navBrand = $('.n_nav_brand');

  const switchNav = (btn, nav) => {
    backBtn.toggle(btn);
    navBrand.toggle(nav);
  };

  // Stripe Dropdown
  let movingDiv = document.querySelector('.n_navbar-dropdown-bg');
  let dropdowns = document.querySelectorAll('.n_navbar-dropdown');
  let arrow = document.querySelector('.n_navbar-arrow');
  let divIsActive = false;
  let leaveTimeout;
  let duration = 0.3;
  let lastIndex;

  const moveDiv = (element) => {
    if (leaveTimeout) clearTimeout(leaveTimeout); // Clear any previous timeout if a new dropdown is hovered
    let submenu = element.querySelector('.n_navbar-dropdown_wrap');
    let menuBox = element.querySelectorAll('.n_navbar-dropdown_wrap-inner');

    let rect = submenu.getBoundingClientRect();
    let tl = gsap.timeline({ defaults: { ease: Circ.easeOut } });

    // Get positon for the arrow
    let rectX = element.getBoundingClientRect();
    let centerX = rectX.width / 2;

    if (!divIsActive) {
      tl.set(movingDiv, {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      tl.set(arrow, {
        x: `${centerX}px`,
        yPercent: 100,
      });
      tl.to(movingDiv, { autoAlpha: 1, duration: duration });
      tl.to(arrow, { yPercent: 0, duration: 0.15 }, '<0.1');
      divIsActive = true;
    } else {
      tl.to(movingDiv, {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        duration: duration,
      });
      tl.to(
        arrow,
        {
          duration: 0.25,
          x: `${centerX}px`,
        },
        '<'
      );
      if (lastIndex < element.index) {
        tl.fromTo(
          menuBox,
          {
            xPercent: 5,
          },
          {
            xPercent: 0,
            duration: 0.2,
          },
          '<'
        );
      } else if (lastIndex > element.index) {
        tl.fromTo(
          menuBox,
          {
            xPercent: -5,
          },
          {
            xPercent: 0,
            duration: 0.2,
          },
          '<'
        );
      }
    }

    // Update direction
    lastIndex = element.index;
  };

  const delayedHideDiv = () => {
    leaveTimeout = setTimeout(hideDiv, 10); // Start a timeout when a dropdown is left
  };

  const hideDiv = () => {
    gsap.to(movingDiv, { duration: duration, autoAlpha: 0 });
    divIsActive = false;
  };

  window.addEventListener('resize', hideDiv);

  ScrollTrigger.matchMedia({
    // large
    '(min-width: 992px)': function () {
      dropdowns.forEach((dropdown, index) => {
        dropdown.index = index;
        dropdown.addEventListener('mouseenter', () => moveDiv(dropdown));
        dropdown.addEventListener('mouseleave', delayedHideDiv);

        window.addEventListener('resize', () => {
          if (dropdown.matches(':hover')) {
            moveDiv(dropdown);
          }
        });
      });
    },
  });

  // Show Back on Click
  $('.n_navbar-dropdown').on('click', function () {
    if ($(window).width() < 992) {
      switchNav(true, false);
    }
  });

  // Check if we should hide "Back"
  $(document).on('click', function () {
    if ($(window).width() < 992) {
      // Click outside of menu
      setTimeout(function () {
        let openDropdown = $('.w-dropdown-toggle.w--open');
        if (!openDropdown.length) {
          switchNav(false, true);
        } else {
          console.log('False');
        }
      }, 170);
    }
  });

  // Hide the back button on resize
  $(window).on('resize', function () {
    if ($(window).width() > 991) {
      switchNav(false, true);
    }
  });

  // --- Custom Actions ---
  // Prevent Default Submit Action
  $('form[data-submit=prevent]').submit(function (e) {
    e.preventDefault();
  });

  $('form[data-submit=prevent]').on('keydown', function (e) {
    if (e.key === 'Enter') {
      $(this).find('[data-submit]').click();
    }
  });

  // --- Tabs
  let tabs = $('.n_feature-tab');
  let openClass = 'current';
  let firstClick = true;
  let visualsHeight;

  tabs.each(function () {
    let items = $(this).find('.n_feature-tab_list-item');
    let visuals = $(this).find('.n_feature-tab_visual').find('.n_feature-tab_visual-inner');
    let actionsMask = $(this).find('.n_feature-tab_list-item_actions');
    let visualReMask = $(this).find('.n_feature-tab_visual_r');
    visualsHeight = visualReMask.height();

    items.on('click', function () {
      // Define
      let self = $(this);
      let index = self.index();

      // Check if clicked element is already opened
      if (!self.hasClass(openClass)) {
        // Reveal clicked class
        self.addClass(openClass);
        revealTab(self);

        // Get all opened items except the clicked one
        let openItems = items.filter('.' + openClass).not(self);

        // Remove the class
        openItems.each(function () {
          let currentItem = $(this);
          currentItem.removeClass(openClass);
        });

        // Update visual
        let animationCount = 0;

        visuals.fadeOut(firstClick ? 0 : 250, function () {
          if (++animationCount === visuals.length) {
            visuals.eq(index).fadeIn(firstClick ? 0 : 2 % 0);
            visuals.find('video').each(function () {
              let allVideo = $(this)[0];
              allVideo.currentItem = 0;
              allVideo.pause();
            });

            let video = visuals.eq(index).find('video')[0];
            if (video) {
              video.currentTime = 0;
              video.addEventListener('canplaythrough', function () {
                video.play();
              });
            }
          }
        });

        // Remove first click
        firstClick = false;
      }
    });

    // Init handler
    let resizeTimeout;

    const triggerItemClick = () => items.eq(0).trigger('click', false);

    // run on page load
    triggerItemClick();

    // run on resize
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentWindowWidth = window.innerWidth;
        if (currentWindowWidth !== windowWidth) {
          visualsHeight = $(visualReMask).css('height', 'auto').height();
          items.removeClass(openClass);
          triggerItemClick();
          windowWidth = currentWindowWidth;
        }
      }, 250);
    });

    // Functions

    function revealTab(elem) {
      // Animated Items
      let mask = $(elem).find(actionsMask);
      let visualRe = $(elem).find(visualReMask);

      let allItems = $(actionsMask).add(visualReMask);

      // Handle respo
      if (window.innerWidth < 991) {
        $(visualReMask).show();
      } else {
        $(visualReMask).hide();
      }

      // Hide others
      allItems.animate({ height: 0 }, { duration: firstClick ? 0 : 400, queue: false });

      // Show Current
      if (mask.length) {
        mask.stop().animate(
          {
            height: mask.get(0).scrollHeight,
          },
          { duration: firstClick ? 0 : 400, queue: false },
          function () {
            console.log('fire');
            $(mask).height('auto');
          }
        );
      }
      if (visualRe.length) {
        visualRe.stop().css('height', 'auto');
      }

      /*
      visualRe.stop().animate(
        {
          height: visualsHeight,
        },
        { duration: firstClick ? 0 : 400, queue: false },
        function () {
          $(this).height('auto');
        }
      );
      */
    }
  });

  // --- Features Swiper
  let swiper;
  let reVisuals;
  let init = false;
  let pendingVideo = null;

  function swiperMode() {
    const mobile = window.matchMedia('(min-width: 0px) and (max-width: 991px)');
    const desktop = window.matchMedia('(min-width: 992px)');

    // Desktop
    let visuals = $('.hp-slider_visuals._1').find('.hp-slider_visuals-item');
    let listItems = $('.hp-slider_content-inner._1').find('.hp-slider_list-item');
    let slides = $('.hp-slider_slider._1').find('.swiper-slide.n_hp-slider');

    if (desktop.matches) {
      if (init) {
        // Update this part for destroying Swiper
        if (swiper && swiper.destroyed === false) {
          swiper.destroy(true, true);
        }

        if (reVisuals && reVisuals.destroyed === false) {
          reVisuals.destroy(true, true);
        }
        init = false;
      }
      swiper = new Swiper('.hp-slider_slider._1', {
        slidesPerView: 1,
        speed: 250,
        navigation: {
          prevEl: `.swiper_arrow.prev.n_hp-slider`,
          nextEl: `.swiper_arrow.next.n_hp-slider`,
        },
        autoHeight: true,
        slideToClickedSlide: true,
        observer: true,
        observeParents: true,
        on: {
          beforeTransitionStart: (swiper) => {
            let index = swiper.realIndex;

            /* Visuals */
            crossfade(visuals, index, true);

            /* List */
            crossfade(listItems, index);
          },
          slideChange: (swiper) => {
            let index = swiper.realIndex;
            slides.each(function () {
              if ($(this).index() < index) {
                $(this).find('.hp-slider_slide').addClass('offset');
              } else {
                $(this).find('.hp-slider_slide').removeClass('offset');
              }
            });
          },
        },
        breakpoints: {
          0: { autoHeight: true },
          480: { autoHeight: true },
          768: { autoHeight: true },
          992: { autoHeight: true },
        },
      });
      init = true;
    }

    // Enable (for Mobile)
    else if (mobile.matches) {
      if (init) {
        if (swiper) {
          swiper.destroy(true, true);
        }
        init = false;
      }
      swiper = new Swiper('.hp-slider_slider._2', {
        slidesPerView: 1,
        speed: 250,
        navigation: {
          prevEl: `.swiper_arrow.prev.n_hp-slider`,
          nextEl: `.swiper_arrow.next.n_hp-slider`,
        },
        autoHeight: true,
        slideToClickedSlide: true,
        observer: true,
        observeParents: true,
        on: {
          slideChange: (swiper) => {},
        },
        breakpoints: {
          0: { autoHeight: true },
          480: { autoHeight: true },
          768: { autoHeight: true },
          992: { autoHeight: true },
        },
      });
      reVisuals = new Swiper('.hp-slider_visuals-box._2', {
        slidesPerView: 1,
        speed: 250,
        autoHeight: true,
        slideToClickedSlide: true,
        observer: true,
        observeParents: true,
      });

      swiper.controller.control = reVisuals;
      reVisuals.controller.control = swiper;
      init = true;
    }
  }

  function crossfade(elements, index, instant) {
    elements
      .filter(':visible')
      .css('position', 'absolute')
      .stop()
      .animate({ opacity: 0 }, instant ? 0 : 'fast', function () {
        $(this).hide();
      });
    elements
      .eq(index)
      .css('position', 'relative')
      .css('opacity', 0)
      .show()
      .stop()
      .animate({ opacity: 1 }, instant ? 0 : 'fast');
    let video = elements.eq(index).find('video:visible')[0];

    if (video) {
      playSliderVideo(video);
    }
  }

  let currentPlayingVideo = null;

  function playSliderVideo(el) {
    // Load and pause all the videos
    loadAndPauseVideos();

    // Mark this video as the current one
    currentPlayingVideo = el;

    // Play the video
    el.play();

    // Update Swiper when it ends
    el.addEventListener('ended', (e) => {
      if (e.target === currentPlayingVideo) {
        handleVideoEnd();
      }
    });
  }

  function handleVideoEnd() {
    const index = swiper.realIndex;
    const nextIndex = (index + 1) % swiper.slides.length; // Loop back to first slide if it's the last one
    swiper.slideTo(nextIndex);
  }

  function loadAndPauseVideos() {
    // Determine the selector based on screen width
    const mediaQuery = window.matchMedia('(min-width: 922px)');
    let selector;

    if (mediaQuery.matches) {
      selector = '.hp-slider_visuals-item video';
    } else {
      selector = '.hp-slider_visuals-box._2 video';
    }

    // Load, reset, and pause videos based on the selector
    $(selector).each(function () {
      let video = $(this)[0];

      if (!video.hasAttribute('data-loaded')) {
        video.load();
        video.setAttribute('data-loaded', 'true');
      }

      video.currentTime = 0;
      video.pause();
    });
  }

  // Swiper Load
  window.addEventListener('load', function () {
    swiperMode();
  });

  // Swiper Resize
  var windowWidth = window.innerWidth;

  window.addEventListener('resize', function () {
    if (window.innerWidth !== windowWidth) {
      windowWidth = window.innerWidth;
      swiperMode();
    }
  });

  // Swiper Scroll Observer
  let observer;

  function initializeObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const visibleVideo = $(entry.target).find('video:visible')[0];
            if (visibleVideo) {
              playSliderVideo(visibleVideo);
              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe($('.hp-slider_inner')[0]);
  }

  $(document).ready(function () {
    initializeObserver();
  });

  // --- Case Study Swiper
  let csSlider = $('.n_section-cs');
  if (csSlider) {
    createSwiper(csSlider, '.swiper.n_case-studies', 'case-study-slider', {
      slidesPerView: 1,
      spaceBetween: 48,
    });
  }
});
