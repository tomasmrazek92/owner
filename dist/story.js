"use strict";(()=>{gsap.registerPlugin(ScrollTrigger);var r=gsap.timeline({scrollTrigger:{trigger:$(".n_section-home-hero"),start:"top top",end:"bottom top",scrub:1,markers:!0}});$(".n_hero-visual_wrap").each(function(){let t=gsap.utils.random(-10,-30)+"rem";r.to($(this),{y:t},"<")});var e=gsap.timeline({scrollTrigger:{trigger:$(".n_section-joining"),start:"top bottom",end:"bottom top",scrub:1,markers:!0}});$(".n_joining_img").each(function(){let t=gsap.utils.random(-10,-30)+"rem";e.to($(this),{y:t},"<")});})();