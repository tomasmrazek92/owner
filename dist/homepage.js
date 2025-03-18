"use strict";(()=>{var x=(h,e,s)=>{let l=$(h).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(h).closest(".form-field, [form-field]").toggleClass("error",e),l.toggle(e),s&&l.text(s)};var k=(h,e,s,l)=>{let c=".swiper_arrow",u=".swiper-navigation";$(h).each(function(){let a=$(this).index(),n=`${s}_${a}`;$(this).find(e).addClass(n),$(this).find(c).addClass(n),$(this).find(u).addClass(n);let d=Object.assign({},l,{speed:750,threshold:20,navigation:{prevEl:`${c}.prev.${n}`,nextEl:`${c}.next.${n}`},pagination:{el:`${u}.${n}`,type:"bullets",bulletActiveClass:"w-active",bulletClass:"w-slider-dot",clickable:!0}});for(let y in l)y in d&&(d[y]=l[y]);let g=new Swiper(`${e}.${n}`,d);swipers[s]=swipers[s]||{},swipers[s][a]=g})};k(".section_hp-slider",".hp-slider_wrap","hp-hero",{slidesPerView:1,spaceBetween:12,threshold:40,autoplay:{delay:2e4},on:{autoplayStart:function(){$(".hp-slider_wrap .w-slider-dot").removeClass("stopped")},autoplayStop:function(){$(".hp-slider_wrap .w-slider-dot").addClass("stopped")},slideChange:function(h){let s=$(h.slides).eq(h.realIndex).find(".w-background-video video");s.length&&!s.hasClass("playing")&&(s.addClass("playing"),s[0].play())}}});$(document).ready(function(){T("#grader-name",".predictions-container")});function T(h,e){let s,l,c,u=$(h),a=$(e),n=u.data("place-types").split(",").map(o=>o.trim().replace(/['"]/g,"")),d=u.data("country-restrict");function g(o){if(o){let i=new URLSearchParams(window.location.search),p=["utm_source=homepage"];i.forEach((v,m)=>{m.toLowerCase().startsWith("utm_")&&m.toLowerCase()!=="utm_source"&&p.push(`${m}=${v}`)});let f=`https://grader.owner.com/?placeid=${o}&${p.join("&")}`;window.open(f,"_blank")}}function y(){window.google&&window.google.maps?(s=new google.maps.places.AutocompleteService,l=new google.maps.places.PlacesService(document.createElement("div"))):console.error("Google Maps API not loaded")}function A(o){if(c=null,o.length>0&&s){let i={input:o,types:n};d&&(i.componentRestrictions={country:d}),s.getPlacePredictions(i,(p,f)=>{C(p,f)})}else a.html("").addClass("hidden")}function C(o,i){if(a.html(""),i===google.maps.places.PlacesServiceStatus.OK&&o&&o.length>0){o.forEach((f,v)=>{let m=$(`
          <div class="prediction-item" data-place-id="${f.place_id}">
            <span class="main-text p13">${f.structured_formatting.main_text}</span>
            <span class="secondarytext p13 text-color-content-tertiary">${f.structured_formatting.secondary_text}</span>
          </div>
        `);a.append(m)}),a.removeClass("hidden");let p=a.find(".prediction-item")[0];p&&window.innerWidth<=768&&setTimeout(()=>{let f=$(".nav").outerHeight()||0,v=p.getBoundingClientRect().top+window.pageYOffset-f-16;window.scrollTo({top:v,behavior:"smooth"})},100)}else a.addClass("hidden")}function S(o){o&&l&&l.getDetails({placeId:o},(i,p)=>{p===google.maps.places.PlacesServiceStatus.OK&&(u.trigger("placeSelected",[i]),u.val(i.name),console.log(o),a.addClass("hidden"))})}let w;u.on("input",function(){clearTimeout(w),w=setTimeout(()=>{A($(this).val())},300)}),a.on("click",".prediction-item",function(){c=$(this).data("place-id"),x(u,!1),S(c),g(c)}),$(document).on("click",function(o){!$(o.target).closest(e).length&&!$(o.target).is(u)&&a.addClass("hidden")}),$(".hp-grader_btn-submit").on("click",function(o){c?g(c):x(u,!0)}),y()}$(".hp-grader_input").on("focus",function(){swipers["hp-hero"][0].autoplay.stop()});$(".hp-grader_input").on("blur",function(){swipers["hp-hero"][0].autoplay.start()});function q(){document.querySelectorAll("[data-vimeo-player-init]").forEach(function(e,s){let l=e.getAttribute("data-vimeo-video-id");if(!l)return;let c=`https://player.vimeo.com/video/${l}?api=1&background=1&autoplay=0&loop=0&muted=1`;e.querySelector("iframe").setAttribute("src",c);let u="vimeo-player-index-"+s;e.setAttribute("id",u);let a=e.id,n=new Vimeo.Player(a),d;e.getAttribute("data-vimeo-update-size")==="true"&&n.getVideoWidth().then(function(t){n.getVideoHeight().then(function(r){d=r/t;let b=e.querySelector(".vimeo-player__before");b&&(b.style.paddingTop=d*100+"%")})});function g(){let t=e.offsetHeight/e.offsetWidth*100,r=e.querySelector(".vimeo-bg__iframe-wrapper");r&&d&&(t>d*100?r.style.width=`${t/(d*100)*100}%`:r.style.width="")}if(e.getAttribute("data-vimeo-update-size")==="true"?(g(),n.getVideoWidth().then(function(){n.getVideoHeight().then(function(){g()})})):g(),window.addEventListener("resize",g),n.on("play",function(){e.setAttribute("data-vimeo-loaded","true")}),e.getAttribute("data-vimeo-autoplay")==="false")n.setVolume(1),n.pause();else if(n.setVolume(0),e.setAttribute("data-vimeo-muted","true"),e.getAttribute("data-vimeo-paused-by-user")==="false"){let t=function(){let r=e.getBoundingClientRect();r.top<window.innerHeight&&r.bottom>0?y():A()};var L=t;t(),window.addEventListener("scroll",t)}function y(){e.setAttribute("data-vimeo-activated","true"),e.setAttribute("data-vimeo-playing","true"),n.play()}function A(){e.setAttribute("data-vimeo-playing","false"),n.pause()}e.querySelectorAll('[data-vimeo-control="play"]').forEach(t=>{t.addEventListener("click",function(){n.setVolume(0),y();let r=e.getAttribute("data-vimeo-muted")==="true"?0:1;n.setVolume(r)})});let S=e.querySelector('[data-vimeo-control="pause"]');S&&S.addEventListener("click",function(){A(),e.getAttribute("data-vimeo-autoplay")==="true"&&(e.setAttribute("data-vimeo-paused-by-user","true"),window.removeEventListener("scroll",L))});let w=e.querySelector('[data-vimeo-control="mute"]');w&&w.addEventListener("click",function(){e.getAttribute("data-vimeo-muted")==="false"?(n.setVolume(0),e.setAttribute("data-vimeo-muted","true")):(n.setVolume(1),e.setAttribute("data-vimeo-muted","false"))});let o=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled||document.mozFullScreenEnabled||document.msFullscreenEnabled),i=e.querySelector('[data-vimeo-control="fullscreen"]');!o&&i&&(i.style.display="none"),i&&i.addEventListener("click",()=>{let t=document.getElementById(a);if(!t)return;document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement?(e.setAttribute("data-vimeo-fullscreen","false"),(document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen).call(document)):(e.setAttribute("data-vimeo-fullscreen","true"),(t.requestFullscreen||t.webkitRequestFullscreen||t.mozRequestFullScreen||t.msRequestFullscreen).call(t))});let p=()=>{let t=document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement;e.setAttribute("data-vimeo-fullscreen",t?"true":"false")};["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","msfullscreenchange"].forEach(t=>{document.addEventListener(t,p)});function f(t){let r=Math.floor(t/3600);t-=r*3600;let b=Math.floor(t/60);return t-=b*60,b+":"+(t<10?"0"+t:t)}let v=e.querySelector("[data-vimeo-duration]");n.getDuration().then(function(t){v&&(v.textContent=f(t)),e.querySelectorAll('[data-vimeo-control="timeline"], progress').forEach(b=>{b.setAttribute("max",t)})});let m=e.querySelector('[data-vimeo-control="timeline"]'),_=e.querySelector("progress");function P(){n.getDuration().then(function(){let t=m.value;n.setCurrentTime(t),_&&(_.value=t)})}m&&["input","change"].forEach(t=>{m.addEventListener(t,P)}),n.on("timeupdate",function(t){m&&(m.value=t.seconds),_&&(_.value=t.seconds),v&&(v.textContent=f(Math.trunc(t.seconds)))});let V;e.addEventListener("mousemove",function(){e.getAttribute("data-vimeo-hover")==="false"&&e.setAttribute("data-vimeo-hover","true"),clearTimeout(V),V=setTimeout(I,3e3)});function I(){e.setAttribute("data-vimeo-hover","false")}function F(){e.setAttribute("data-vimeo-activated","false"),e.setAttribute("data-vimeo-playing","false"),n.unload()}n.on("ended",F)})}q();})();
