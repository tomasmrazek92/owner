"use strict";(()=>{var b=(t,i)=>{$(`input[name=${t}]`).val(i)},J=()=>{let t=$("[vimeo-btn]"),i=$(".n_vimeo-lightbox"),r=i.find("iframe").get(0),s=null,l=u=>{s&&s.unload().catch(console.error),r.src=u,r.addEventListener("load",function(){s=new Vimeo.Player(r),s.play().catch(console.error)})},d=()=>{s&&(s.pause().then(()=>s.unload()).catch(console.error),r.src="")};t.length>0&&(t.on("click",function(){let u=$(this).attr("vimeo-url");u&&l(u)}),i.children().not(".w-embed").on("click",d))},X=()=>{$("[hero-video-thumb]").click(function(t){let i=$(this).closest("[hero-video-box]").find("[hero-video]")[0];t.stopPropagation(),i.paused&&i.play(),$("[hero-video-thumb]").hide()})};var Y=(t,i,r)=>{let s=$(t).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(t).closest(".form-field, [form-field]").toggleClass("error",i),s.toggle(i),r&&s.text(r)};var k=t=>{let i=localStorage.getItem(t);try{return JSON.parse(i)}catch{return i}},L=(t,i)=>{let r=typeof i=="object"?JSON.stringify(i):i;localStorage.setItem(t,r)};var K="restaurant",ne=(t,i)=>{let r="",s="";t.address_components.forEach(l=>{let d=l.types[0],u=i.address_components[d];if(u){let a=l[u];d==="route"?r=a:d==="street_number"?s=a:b(d,a)}}),b("restaurant-address",`${s} ${r}`)},re=t=>{if(!t.types)return;let i=t.types.join(", ");b("place_types",i)},se=(t,i)=>{Object.keys(i).forEach(r=>{if(r==="address_components")return;let s=t[r];s&&b(r,s)})},Q=t=>{if(!t)return;let i={name:"",international_phone_number:"",website:"",place_id:"",rating:"",user_ratings_total:"",address_components:{street_number:"short_name",route:"long_name",locality:"long_name",administrative_area_level_1:"short_name",country:"short_name",postal_code:"short_name"}};ne(t,i),re(t),se(t,i)},U=()=>{let t=k(K);t&&(Q(t),b("restaurant-name",k("restaurant-value")));let i={};$('input[name="restaurant-name"]').each(function(){let r=new google.maps.places.Autocomplete(this,i),s=$(this);r.addListener("place_changed",function(){console.log("place-changed");let l=r.getPlace(),d=s.val();Y(s,!1,$(s).attr("base-text")),Q(l),L("restaurant-value",d),L(K,l),b("restaurant-name",k("restaurant-value"))})})};var R=[],Z=(t,i,r,s)=>{let l=".swiper_arrow",d=".swiper-navigation";$(t).each(function(){let u=$(this).index(),a=`${r}_${u}`;$(this).find(i).addClass(a),$(this).find(l).addClass(a),$(this).find(d).addClass(a);let v=Object.assign({},s,{speed:250,navigation:{prevEl:`${l}.prev.${a}`,nextEl:`${l}.next.${a}`},pagination:{el:`${d}.${a}`,type:"bullets",bulletActiveClass:"w-active",bulletClass:"w-slider-dot"}});for(let g in s)g in v&&(v[g]=s[g]);let P=new Swiper(`${i}.${a}`,v);R[r]=R[r]||{},R[r][u]=P})};$(document).ready(()=>{gsap.registerPlugin(ScrollTrigger),U(),J(),X(),window.onscroll=()=>{let e=$(".n_nav-wrapper"),n=$(e).height();$(e)&&(window.scrollY>n/2?$(e).addClass("pinned"):$(e).removeClass("pinned"))};function t(){if(window.innerWidth<=991){let e=$('.main-wrapper .n_button[href="/demo"]').first(),n=$(".n_navbar_actions .n_button");e.length&&(i(e)?n.fadeOut():n.fadeIn())}}window.onscroll=t,$(window).on("load",t);function i(e){var n=e.get(0).getBoundingClientRect();return n.top>=0&&n.left>=0&&n.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&n.right<=(window.innerWidth||document.documentElement.clientWidth)}let r,s=!1,l=()=>{s?$("html, body").scrollTop(r).removeClass("overflow-hidden"):(r=$(window).scrollTop(),$("html, body").scrollTop(0).addClass("overflow-hidden")),s=!s};$(".n_navbar-hamburger").on("click",l);let d=$(".n_navbar-back"),u=$(".n_nav_brand"),a=(e,n)=>{d.toggle(e),u.toggle(n)},v=document.querySelector(".n_navbar-dropdown-bg"),P=document.querySelectorAll(".n_navbar-dropdown"),g=document.querySelector(".n_navbar-arrow"),S=!1,T,E=.3,V,z=e=>{T&&clearTimeout(T);let n=e.querySelector(".n_navbar-dropdown_wrap"),f=e.querySelectorAll(".n_navbar-dropdown_wrap-inner"),o=n.getBoundingClientRect(),c=gsap.timeline({defaults:{ease:Circ.easeOut}}),h=e.getBoundingClientRect().width/2;S?(c.to(v,{top:`${o.top}px`,left:`${o.left}px`,width:`${o.width}px`,height:`${o.height}px`,duration:E}),c.to(g,{duration:.25,x:`${h}px`},"<"),V<e.index?c.fromTo(f,{xPercent:5},{xPercent:0,duration:.2},"<"):V>e.index&&c.fromTo(f,{xPercent:-5},{xPercent:0,duration:.2},"<")):(c.set(v,{top:`${o.top}px`,left:`${o.left}px`,width:`${o.width}px`,height:`${o.height}px`}),c.set(g,{x:`${h}px`,yPercent:100}),c.to(v,{autoAlpha:1,duration:E}),c.to(g,{yPercent:0,duration:.15},"<0.1"),S=!0),V=e.index},ee=()=>{T=setTimeout(B,10)},B=()=>{gsap.to(v,{duration:E,autoAlpha:0}),S=!1};window.addEventListener("resize",B),ScrollTrigger.matchMedia({"(min-width: 992px)":function(){P.forEach((e,n)=>{e.index=n,e.addEventListener("mouseenter",()=>z(e)),e.addEventListener("mouseleave",ee),window.addEventListener("resize",()=>{e.matches(":hover")&&z(e)})})}}),$(".n_navbar-dropdown").on("click",function(){$(window).width()<992&&a(!0,!1)}),$(document).on("click",function(){$(window).width()<992&&setTimeout(function(){$(".w-dropdown-toggle.w--open").length?console.log("False"):a(!1,!0)},170)}),$(window).on("resize",function(){$(window).width()>991&&a(!1,!0)}),$("form[data-submit=prevent]").submit(function(e){e.preventDefault()}),$("form[data-submit=prevent]").on("keydown",function(e){e.key==="Enter"&&$(this).find("[data-submit]").click()});let te=$(".n_feature-tab"),x="current",y=!0,D;te.each(function(){let e=$(this).find(".n_feature-tab_list-item"),n=$(this).find(".n_feature-tab_visual").find(".n_feature-tab_visual-inner"),f=$(this).find(".n_feature-tab_list-item_actions"),o=$(this).find(".n_feature-tab_visual_r");D=o.height(),e.on("click",function(){let m=$(this),_=m.index();if(!m.hasClass(x)){m.addClass(x),I(m),e.filter("."+x).not(m).each(function(){$(this).removeClass(x)});let A=0;n.fadeOut(y?0:250,function(){if(++A===n.length){n.eq(_).fadeIn(y?0:2%0);let W=n.eq(_).find('[data-animation-type="lottie"]');W.length&&W.trigger("click")}}),y=!1}});let c,p=()=>e.eq(0).trigger("click",!1);p();let h=window.innerWidth;window.addEventListener("resize",()=>{clearTimeout(c),c=setTimeout(()=>{let m=window.innerWidth;m!==h&&(D=$(o).css("height","auto").height(),e.removeClass(x),p(),h=m)},250)});function I(m){let _=$(m).find(f),O=$(m).find(o),A=$(f).add(o);window.innerWidth<991?$(o).show():$(o).hide(),A.animate({height:0},{duration:y?0:400,queue:!1}),_.length&&_.stop().animate({height:_.get(0).scrollHeight},{duration:y?0:400,queue:!1},function(){console.log("fire"),$(_).height("auto")}),O.length&&O.stop().css("height","auto")}});let w,C,q=!1;function M(){let e=window.matchMedia("(min-width: 0px) and (max-width: 991px)"),n=window.matchMedia("(min-width: 992px)"),f=$(".hp-slider_visuals._1").find(".hp-slider_visuals-item"),o=$(".hp-slider_content-inner._1").find(".hp-slider_list-item"),c=$(".hp-slider_slider._1").find(".swiper-slide.n_hp-slider");f.find("video").each(function(){let p=$(this)[0];p.pause(),p.currentTime=0}),n.matches?(q&&(w.destroy(!0,!0),C.destroy(!0,!0)),w=new Swiper(".hp-slider_slider._1",{slidesPerView:1,speed:250,navigation:{prevEl:".swiper_arrow.prev.n_hp-slider",nextEl:".swiper_arrow.next.n_hp-slider"},autoHeight:!0,slideToClickedSlide:!0,observer:!0,observeParents:!0,on:{beforeTransitionStart:p=>{let h=p.realIndex;j(f,h),j(o,h)},slideChange:p=>{let h=p.realIndex;c.each(function(){$(this).index()<h?$(this).find(".hp-slider_slide").addClass("offset"):$(this).find(".hp-slider_slide").removeClass("offset")})}},breakpoints:{0:{autoHeight:!0},480:{autoHeight:!0},768:{autoHeight:!0},992:{autoHeight:!0}}})):e.matches&&(q&&w.destroy(!0,!0),w=new Swiper(".hp-slider_slider._2",{slidesPerView:1,speed:250,navigation:{prevEl:".swiper_arrow.prev.n_hp-slider",nextEl:".swiper_arrow.next.n_hp-slider"},autoHeight:!0,slideToClickedSlide:!0,observer:!0,observeParents:!0,on:{slideChange:p=>{let h=p.realIndex,I=$(".hp-slider_visuals-box._2").find(".swiper-slide").eq(h).find("video");console.log(I),H(I)}},breakpoints:{0:{autoHeight:!0},480:{autoHeight:!0},768:{autoHeight:!0},992:{autoHeight:!0}}}),C=new Swiper(".hp-slider_visuals-box._2",{slidesPerView:1,speed:250,autoHeight:!0,slideToClickedSlide:!0,observer:!0,observeParents:!0}),w.controller.control=C,C.controller.control=w,q=!0)}function j(e,n){e.filter(":visible").css("position","absolute").stop().animate({opacity:0},"fast",function(){$(this).hide()}),e.eq(n).css("position","relative").css("opacity",0).show().stop().animate({opacity:1},"fast");let f=e.eq(n).find("video");H(f)}let F=null;function H(e){$(".hp-slider_inner").find("video").each(function(){this.pause(),this.currentTime=0}),e.length>0&&(F=e[0],e[0].addEventListener("ended",function(n){n.target===F&&ie()}),e[0].currentTime=0,e[0].play())}function ie(){let n=(w.realIndex+1)%w.slides.length;w.slideTo(n)}new IntersectionObserver((e,n)=>{e.forEach(f=>{if(f.isIntersecting){let o;$(window).width()>=992?o=$(".hp-slider_visuals").find("video").eq(0):o=$(".hp-slider_visuals-box._2").find("video").eq(0),console.log(o),H(o)}})},{threshold:.5}).observe(document.querySelector(".hp-slider_inner")),window.addEventListener("load",function(){M()});var G=window.innerWidth;window.addEventListener("resize",function(){window.innerWidth!==G&&(G=window.innerWidth,M())});let N=$(".n_section-cs");N&&Z(N,".swiper.n_case-studies","case-study-slider",{slidesPerView:1,spaceBetween:48})});})();
