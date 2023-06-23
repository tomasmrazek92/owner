"use strict";(()=>{var m=(e,t)=>{$(`input[name=${e}]`).val(t)},P=()=>{let e=$("#hero-video")[0];$(".n_hero-video_thumb").click(function(t){t.stopPropagation(),e.paused&&e.play(),$(this).hide()})};var T=(e,t,s)=>{let n=$(e).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(e).closest(".form-field").toggleClass("error",t),n.toggle(t),s&&n.text(s)};var b=e=>{let t=localStorage.getItem(e);try{return JSON.parse(t)}catch{return t}},k=(e,t)=>{let s=typeof t=="object"?JSON.stringify(t):t;localStorage.setItem(e,s)};var O="restaurant",q=(e,t)=>{let s="",n="";e.address_components.forEach(r=>{let o=r.types[0],h=t.address_components[o];if(h){let a=r[h];o==="route"?s=a:o==="street_number"?n=a:m(o,a)}}),m("restaurant-address",`${n} ${s}`)},B=e=>{if(!e.types)return;let t=e.types.join(", ");m("place_types",t)},H=(e,t)=>{Object.keys(t).forEach(s=>{if(s==="address_components")return;let n=e[s];n&&m(s,n)})},E=e=>{if(!e)return;let t={name:"",international_phone_number:"",website:"",place_id:"",rating:"",user_ratings_total:"",address_components:{street_number:"short_name",route:"long_name",locality:"long_name",administrative_area_level_1:"short_name",country:"short_name",postal_code:"short_name"}};q(e,t),B(e),H(e,t)},A=()=>{let e=b(O);e&&(E(e),m("restaurant-name",b("restaurant-value")));let t={};$('input[name="restaurant-name"]').each(function(){let s=new google.maps.places.Autocomplete(this,t),n=$(this);s.addListener("place_changed",function(){console.log("place-changed");let r=s.getPlace(),o=n.val();T(n,!1,$(n).attr("base-text")),E(r),k("restaurant-value",o),k(O,r),m("restaurant-name",b("restaurant-value"))})})};var x=[],I=(e,t,s,n)=>{let r=".swiper_arrow",o=".swiper-navigation";$(e).each(function(){let h=$(this).index(),a=`${s}_${h}`;$(this).find(t).addClass(a),$(this).find(r).addClass(a),$(this).find(o).addClass(a);let l=Object.assign({},n,{speed:250,navigation:{prevEl:`${r}.prev.${a}`,nextEl:`${r}.next.${a}`},pagination:{el:`${o}.${a}`,type:"bullets",bulletActiveClass:"w-active",bulletClass:"w-slider-dot"}});for(let g in n)g in l&&(l[g]=n[g]);let w=new Swiper(`${t}.${a}`,l);x[s]=x[s]||{},x[s][h]=w})};$(document).ready(()=>{A(),P(),window.onscroll=()=>{let i=$(".n_nav-wrapper"),d=$(i).height();$(i)&&(window.scrollY>d/2?$(i).addClass("pinned"):$(i).removeClass("pinned"))};let e,t=!1,s=()=>{t?$("html, body").scrollTop(e).removeClass("overflow-hidden"):(e=$(window).scrollTop(),$("html, body").scrollTop(0).addClass("overflow-hidden")),t=!t};$(".n_navbar-hamburger").on("click",s);let n=$(".n_navbar-back"),r=$(".n_nav_brand"),o=(i,d)=>{n.toggle(i),r.toggle(d)};$(".n_navbar-dropdown").on("click",function(){$(window).width()<992&&o(!0,!1)}),$(document).on("click",function(){$(window).width()<992&&setTimeout(function(){let i=$(".w-dropdown-toggle.w--open");i.length||i.trigger("click")},20)}),$("form[data-submit=prevent]").submit(function(i){i.preventDefault()}),$("form[data-submit=prevent]").on("keydown",function(i){i.key==="Enter"&&$(this).find("[data-submit]").click()});let h=$(".n_feature-tab"),a="current",l=!0,w;h.each(function(){let i=$(this).find(".n_feature-tab_list-item"),d=$(this).find(".n_feature-tab_visual").find(".n_feature-tab_visual-inner"),_=$(this).find(".n_feature-tab_list-item_actions"),u=$(this).find(".n_feature-tab_visual_r");i.on("click",function(){let c=$(this),v=c.index();if(console.log(d),!c.hasClass(a)){c.addClass(a),R(c),i.filter("."+a).not(c).each(function(){$(this).removeClass(a)});let C=0;d.fadeOut(l?0:250,function(){++C===d.length&&d.eq(v).fadeIn(l?0:2%0)}),l=!1}});let f,p=()=>i.eq(0).trigger("click",!1);p();let S=window.innerWidth;window.addEventListener("resize",()=>{clearTimeout(f),f=setTimeout(()=>{let c=window.innerWidth;c!==S&&(w=$(u).css("height","auto").height(),i.removeClass(a),p(),S=c)},250)});function R(c){let v=$(c).find(_),y=$(c).find(u),C=$(_).add(u);window.innerWidth<991?($(u).show(),l&&(w=y.height())):$(u).hide(),C.animate({height:0},{duration:l?0:400,queue:!1}),v.stop().animate({height:v.get(0).scrollHeight},{duration:l?0:400,queue:!1},function(){console.log("fire"),$(v).height("auto")}),y.stop().animate({height:w},{duration:l?0:400,queue:!1},function(){$(this).height("auto")})}});let g=".n_section-hp-slider";if($(g)){let u=function(f,p){f.filter(":visible").css("position","absolute").stop().animate({opacity:0},"fast",function(){$(this).hide()}),f.eq(p).css("position","relative").css("opacity",0).show().stop().animate({opacity:1},"fast")};var Z=u;let i=$(".hp-slider_visuals-item"),d=$(".hp-slider_list-item"),_=$(".swiper-slide.n_hp-slider");I(g,".hp-slider_slider","hp-slider",{slidesPerView:1,autoHeight:!0,slideToClickedSlide:!0,observer:!0,observeParents:!0,on:{beforeTransitionStart:f=>{let p=f.realIndex;u(i,p),u(d,p)},slideChange:f=>{console.log("cool");let p=f.realIndex;_.each(function(){$(this).index()<p?$(this).find(".hp-slider_slide").addClass("offset"):$(this).find(".hp-slider_slide").removeClass("offset")})}},breakpoints:{0:{autoHeight:!0},480:{autoHeight:!0},768:{autoHeight:!0},992:{autoHeight:!0}}})}let V=$(".n_section-cs");V&&(console.log("Init"),I(V,".swiper.n_case-studies","case-study-slider",{slidesPerView:1,spaceBetween:48}));var G=new Swiper(".n_team-swiper",{mousewheel:{invert:!0,forceToAxis:!0},spaceBetween:32,slidesPerView:5,slidesPerGroup:1,loop:!1,speed:1200,centeredSlides:!1,lazy:!0,navigation:{nextEl:".swiper_arrow.next.n_team-arrow",prevEl:".swiper_arrow.prev.n_team-arrow"},keyboard:{enabled:!0},breakpoints:{0:{slidesPerView:1.25,spaceBetween:16},480:{slidesPerView:2.25,spaceBetween:16},768:{slidesPerView:4,spaceBetween:20},992:{slidesPerView:5,spaceBetween:32}}})});})();
