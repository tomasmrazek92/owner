"use strict";(()=>{var a=[],d=(c,p,s,i)=>{let t=".swiper_arrow",l=".swiper-navigation";$(c).each(function(){let w=$(this).index(),e=`${s}_${w}`;$(this).find(p).addClass(e),$(this).find(t).addClass(e),$(this).find(l).addClass(e);let n=Object.assign({},i,{speed:250,navigation:{prevEl:`${t}.prev.${e}`,nextEl:`${t}.next.${e}`},pagination:{el:`${l}.${e}`,type:"bullets",bulletActiveClass:"w-active",bulletClass:"w-slider-dot"}});for(let r in i)r in n&&(n[r]=i[r]);let f=new Swiper(`${p}.${e}`,n);a[s]=a[s]||{},a[s][w]=f})};var o=$(".n_section-press-hero");o&&d(o,".swiper.press","press-slider",{slidesPerView:1.75,spaceBetween:32,centeredSlides:!0,loop:!0,autoloop:{delay:4e3},breakpoints:{0:{slidesPerView:1.25,spaceBetween:16},480:{slidesPerView:1.25,spaceBetween:16},768:{slidesPerView:1.5,spaceBetween:24},992:{slidesPerView:1.75,spaceBetween:32},1440:{slidesPerView:2.5,spaceBetween:32}}});})();