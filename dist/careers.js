"use strict";(()=>{var h=()=>{let t=$("#hero-video")[0];$(".n_hero-video_thumb").click(function(i){i.stopPropagation(),t.paused&&t.play(),$(this).hide()})};var d=[],w=(t,i,r,s)=>{let o=".swiper_arrow",p=".swiper-navigation";$(t).each(function(){let c=$(this).index(),e=`${r}_${c}`;$(this).find(i).addClass(e),$(this).find(o).addClass(e),$(this).find(p).addClass(e);let a=Object.assign({},s,{speed:250,navigation:{prevEl:`${o}.prev.${e}`,nextEl:`${o}.next.${e}`},pagination:{el:`${p}.${e}`,type:"bullets",bulletActiveClass:"w-active",bulletClass:"w-slider-dot"}});for(let l in s)l in a&&(a[l]=s[l]);let b=new Swiper(`${i}.${e}`,a);d[r]=d[r]||{},d[r][c]=b})};gsap.registerPlugin(ScrollTrigger);h();var g=$(".n_section-career-team");g&&w(g,".swiper.n_team-swiper","career-slider",{slidesPerView:"auto",spaceBetween:32});var n,m=gsap.timeline({scrollTrigger:{trigger:$(".n_section-career-center"),start:"top top",end:"bottom top",scrub:1,markers:!0}});$(".n_career-hero_visual-wrap").each(function(){$(this).hasClass("small")?n="-18rem":$(this).hasClass("middle")?n="-15rem":$(this).hasClass("big")&&(n="-10rem"),m.to($(this),{y:n,stagger:{each:.5}},"<")});console.log(m);var f;function v(){f=new SplitType("[scroll-text]",{types:"words"}),x()}v();var u=$(window).innerWidth();window.addEventListener("resize",function(){u!==$(window).innerWidth()&&(u=$(window).innerWidth(),f.revert(),v())});function x(){$(".word").each(function(){gsap.timeline({scrollTrigger:{trigger:$(this),start:"top 50%",end:"bottom bottom",scrub:.1}}).to($(this),{color:"#000",stagger:{each:.5}})})}})();
