"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/story.js
  gsap.registerPlugin(ScrollTrigger);
  var heroParallax = gsap.timeline({
    scrollTrigger: {
      trigger: $(".n_section-home-hero"),
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });
  $(".n_hero-visual_wrap").each(function() {
    let distance = gsap.utils.random(-10, -30) + "rem";
    heroParallax.to(
      $(this),
      {
        y: distance
      },
      "<"
    );
  });
  var footerParallax = gsap.timeline({
    scrollTrigger: {
      trigger: $(".n_section-joining"),
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });
  $(".n_joining_img").each(function() {
    let distance = gsap.utils.random(-10, -30) + "rem";
    footerParallax.to(
      $(this),
      {
        y: distance
      },
      "<"
    );
  });
})();
//# sourceMappingURL=story.js.map
