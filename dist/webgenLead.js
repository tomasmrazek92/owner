"use strict";(()=>{var l=t=>{let e=localStorage.getItem(t);try{return JSON.parse(e)}catch{return e}};var c="restaurant";var f=()=>{let t=JSON.parse(localStorage.getItem(c)),e=["bar","cafe","bakery","food","restaurant"];for(let o=0;o<e.length;o++)if(t.types.includes(e[o]))return!0;return!1};var m=t=>{let e=t,o=!0;return $(e).prop("required")&&($(e).val()?$(e).is('[type="email"]')?o=b(e):$(e).attr("name")==="restaurant-name"?o=S(e):$(e).is("select")?o=_(e):o=O(e):o=x(e)),o?r($(e),!1):($(e).addClass("error"),console.log($(e)),console.log($(e).val())),o};function b(t){let o=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(t).val());return r($(t),!o,"Please fill correct email address."),o}function S(t){let e=!0;return e=I(t),e}var u=!1;function I(t){if(u)return u=!1,!0;let e=f();return e?r($(t),!1):r($(t),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),u=!0,e}function _(t){let e,o=$(t).siblings(".select2"),s=$(t).siblings(".nice-select");o?e=o.find(".select2-selection--single"):s?e=$(s):e=$(t);let n=!0;return $(t).val()===""?(validArr.push(selectVal),$(e).addClass("is-invalid"),n=!1):$(e).removeClass("is-invalid"),n}function O(t){return r($(t),!1),!0}function x(t){return $(t).attr("name")==="restaurant-name"&&r($(t),!0,"Please select a business location from the search results."),r($(t),!0),!1}var r=(t,e,o)=>{let s=$(t).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(t).closest(".form-field").toggleClass("error",e),s.toggle(e),o&&s.text(o)};var g="https://api.owner.com",h=$(".main-wrapper"),v=$(".growth-loading"),y=$(".growth-error");function V(){$(h,y).fadeOut(500,function(){$(v).fadeIn(400)});let t=$(".growth-loading_step"),e=0;function o(){e<t.length-1&&t.eq(e).fadeOut(1e3,function(){e+=1,t.eq(e).fadeIn(1e3),setTimeout(o,4e3)})}t.hide().eq(e).show(),setTimeout(o,4e3)}function w(){$(h).add(v).hide(),$(y).fadeIn()}function E(t){return l(t).place_id}var P=async t=>{let e=await fetch(`${g}/generator/v1/generations`,{method:"POST",headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:JSON.stringify({googleId:t})});return e.ok||console.error("POST request error:",e.status,await e.text()),await e.json()},k=async t=>await(await fetch(`${g}/generator/v1/generations/${t}`)).json(),p=new Set,G=t=>{let{status:e}=t;return p.has(e)||(console.log("Checking Generation Status:",t),p.add(e)),e},j=async t=>{try{let{id:e}=await P(t);if(!e)throw new Error("Invalid ID received from POST request");return console.log("Website Generation Started"),a("Website Generation Started",t),new Promise((o,s)=>{let n=setInterval(async()=>{let d=await k(e),i=G(d);if(i!=="processing"){if(clearInterval(n),i!=="success")return s(new Error(i));o(d)}},1e3)})}catch(e){let o=e.message.includes("error")||e.message.includes("cancelled")?e.message:"";return{message:e.message,status:o}}};function a(t,e,o){let s=t,n={location:{place_id:e}};o&&(n.location.errorMessage=o),FS.event(s,FS.setUserVars(n))}function C(t,e){console.log("Success:",t),a("Website Generation Successful",e),window.location.href=t.redirectUri}function T(t,e){console.log("Error:",t),w(),a("Website Generation Failed",e,respoonse)}function A(t,e){console.log("Error:",t.message),w(),a("Website Generation Failed",e,t.message)}$("[data-form=generateBtn]").on("click",async function(){if(!m($("input[name=restaurant-name]")))return console.log("Validation Invalid");V();let e=E(c);console.log(e);try{let o=await j(e);o&&o.status==="success"?C(o,e):T(o,e)}catch(o){A(o,e)}});})();
