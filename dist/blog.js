"use strict";(()=>{var o=[],p=(n,i,e,t)=>{let a=".swiper_arrow",w=".swiper-navigation";$(n).each(function(){let d=$(this).index(),s=`${e}_${d}`;$(this).find(i).addClass(s),$(this).find(a).addClass(s),$(this).find(w).addClass(s);let l=Object.assign({},t,{speed:250,navigation:{prevEl:`${a}.prev.${s}`,nextEl:`${a}.next.${s}`},pagination:{el:`${w}.${s}`,type:"bullets",bulletActiveClass:"w-active",bulletClass:"w-slider-dot"}});for(let r in t)r in l&&(l[r]=t[r]);let f=new Swiper(`${i}.${s}`,l);o[e]=o[e]||{},o[e][d]=f})};var c=$(".slider.n_blog-post").not("#swiper-related");c&&p($(c),".swiper.n_blog-post","blog-swiper",{spaceBetween:20,slidesPerView:3,centeredSlides:!1,lazy:!0,breakpoints:{0:{slidesPerView:1.25,spaceBetween:16},480:{slidesPerView:1.25,spaceBetween:16},768:{slidesPerView:2,spaceBetween:20},992:{slidesPerView:3,spaceBetween:20}}});var b=$(".n_section-blog_other");if(b){let e=function(){let t=window.matchMedia("(min-width: 0px) and (max-width: 991px)");window.matchMedia("(min-width: 992px)").matches?i&&(n.destroy(!0,!0),i=!1):t.matches&&(i||(i=!0,n=new Swiper(".swiper.n_blog-post",{slidesPerView:1.1,spaceBetween:20,navigation:{prevEl:".swiper_arrow.n_blog-post.prev",nextEl:".swiper_arrow.n_blog-post.next"}})))};m=e;let n,i=!1;window.addEventListener("load",function(){e()}),window.addEventListener("resize",function(){e()})}var m;$(".n_blog-radio-field").on("click",function(){$(this).is('[fs-cmsfilter-element="clear"]')?$(this).addClass("is-active"):$('[fs-cmsfilter-element="clear"]').removeClass("is-active")});})();
