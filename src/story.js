gsap.registerPlugin(ScrollTrigger);

// --- Hero Parallax
let heroParallax = gsap.timeline({
  scrollTrigger: {
    trigger: $('.n_section-home-hero'),
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    markers: true,
  },
});

$('.n_hero-visual_wrap').each(function () {
  let distance = gsap.utils.random(-10, -30) + 'rem';
  heroParallax.to(
    $(this),
    {
      y: distance,
    },
    '<'
  );
});

// --- Footer Parallax
let footerParallax = gsap.timeline({
  scrollTrigger: {
    trigger: $('.n_section-joining'),
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
    markers: true,
  },
});

$('.n_joining_img').each(function () {
  let distance = gsap.utils.random(-10, -30) + 'rem';
  footerParallax.to(
    $(this),
    {
      y: distance,
    },
    '<'
  );
});
