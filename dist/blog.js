"use strict";(()=>{var d=(n,i,e,t)=>{let l=".swiper_arrow",o=".swiper-navigation";$(n).each(function(){let w=$(this).index(),s=`${e}_${w}`;$(this).find(i).addClass(s),$(this).find(l).addClass(s),$(this).find(o).addClass(s);let a=Object.assign({},t,{speed:750,threshold:20,navigation:{prevEl:`${l}.prev.${s}`,nextEl:`${l}.next.${s}`},pagination:{el:`${o}.${s}`,type:"bullets",bulletActiveClass:"w-active",bulletClass:"w-slider-dot"}});for(let r in t)r in a&&(a[r]=t[r]);let c=new Swiper(`${i}.${s}`,a);swipers[e]=swipers[e]||{},swipers[e][w]=c})};var p=$(".slider.n_blog-post").not("#swiper-related");p&&d($(p),".swiper.n_blog-post","blog-swiper",{spaceBetween:20,slidesPerView:3,centeredSlides:!1,lazy:!0,breakpoints:{0:{slidesPerView:1.25,spaceBetween:16},480:{slidesPerView:1.25,spaceBetween:16},768:{slidesPerView:2,spaceBetween:20},992:{slidesPerView:3,spaceBetween:20}}});var f=$(".n_section-blog_other");if(f){let e=function(){let t=window.matchMedia("(min-width: 0px) and (max-width: 991px)");window.matchMedia("(min-width: 992px)").matches?i&&(n.destroy(!0,!0),i=!1):t.matches&&(i||(i=!0,n=new Swiper(".swiper.n_blog-post",{slidesPerView:1.1,spaceBetween:20,navigation:{prevEl:".swiper_arrow.n_blog-post.prev",nextEl:".swiper_arrow.n_blog-post.next"}})))};g=e;let n,i=!1;window.addEventListener("load",function(){e()}),window.addEventListener("resize",function(){e()})}var g;$(".n_blog-radio-field").on("click",function(){$(this).is('[fs-cmsfilter-element="clear"]')?$(this).addClass("is-active"):$('[fs-cmsfilter-element="clear"]').removeClass("is-active")});})();
