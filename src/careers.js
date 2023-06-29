gsap.registerPlugin(ScrollTrigger);

// --- Hero Parallax
let distance;
let heroParallax = gsap.timeline({
  scrollTrigger: {
    trigger: $('.n_section-career-center'),
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
});

$('.n_career-hero_visual-wrap').each(function () {
  if ($(this).hasClass('small')) {
    distance = '-18rem';
  } else if ($(this).hasClass('middle')) {
    distance = '-15rem';
  } else if ($(this).hasClass('big')) {
    distance = '-10rem';
  }

  heroParallax.to(
    $(this),
    {
      y: distance,
      stagger: {
        each: 0.5,
      },
    },
    '<'
  );
});

console.log(heroParallax);

// -- Text Scroll Fill
let typeSplit;
// Split the text up
function runSplit() {
  typeSplit = new SplitType('[scroll-text]', {
    types: 'words',
  });

  createAnimation();
}

runSplit();

// Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener('resize', function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    typeSplit.revert();
    runSplit();
  }
});

function createAnimation() {
  $('.word').each(function () {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: 'top 50%',
        end: 'bottom bottom',
        scrub: 0.1,
      },
    });
    tl.to($(this), {
      color: '#000',
      stagger: {
        each: 0.5,
      },
    });
  });
}
