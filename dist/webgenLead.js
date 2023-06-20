"use strict";(()=>{var l=t=>{let e=localStorage.getItem(t);try{return JSON.parse(e)}catch{return e}};var c="restaurant";var f=()=>{let t=JSON.parse(localStorage.getItem(c)),e=["bar","cafe","bakery","food","restaurant"];for(let s=0;s<e.length;s++)if(t.types.includes(e[s]))return!0;return!1};var p=t=>{let e=t,s=!0;return $(e).prop("required")&&($(e).val()?$(e).is('[type="email"]')?s=S(e):$(e).attr("name")==="restaurant-name"?s=I(e):$(e).is("select")?s=_(e):s=O(e):s=V(e)),s?o($(e),!1):($(e).addClass("error"),console.log($(e)),console.log($(e).val())),s};function S(t){let s=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(t).val());return o($(t),!s,"Please fill correct email address."),s}function I(t){let e=!0;return e=b(t),e}var u=!1;function b(t){if(u)return u=!1,!0;let e=f();return e?o($(t),!1):o($(t),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),u=!0,e}function _(t){let e,s=$(t).siblings(".select2"),r=$(t).siblings(".nice-select");s?e=s.find(".select2-selection--single"):r?e=$(r):e=$(t);let n=!0;return $(t).val()===""?(validArr.push(selectVal),$(e).addClass("is-invalid"),n=!1):$(e).removeClass("is-invalid"),n}function O(t){return o($(t),!1),!0}function V(t){return $(t).attr("name")==="restaurant-name"&&o($(t),!0,"Please select a business location from the search results."),o($(t),!0),!1}var o=(t,e,s)=>{let r=$(t).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(t).closest(".form-field").toggleClass("error",e),r.toggle(e),s&&r.text(s)};var g="https://dev-api.owner.com",h=$(".main-wrapper"),v=$(".growth-loading"),w=$(".growth-error");function x(){$(h,w).fadeOut(500,function(){$(v).fadeIn(400)});let t=$(".growth-loading_step"),e=0;function s(){e<t.length-1&&t.eq(e).fadeOut(1e3,function(){e+=1,t.eq(e).fadeIn(1e3),setTimeout(s,4e3)})}t.hide().eq(e).show(),setTimeout(s,4e3)}function y(){$(h).add(v).hide(),$(w).fadeIn()}function E(t){return l(t).place_id}var G=async t=>{let e=await fetch(`${g}/generator/v1/generations`,{method:"POST",headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:JSON.stringify({googleId:t})});return e.ok||console.error("POST request error:",e.status,await e.text()),await e.json()},j=async t=>await(await fetch(`${g}/generator/v1/generations/${t}`)).json(),m=new Set,C=t=>{let{status:e}=t;return m.has(e)||(console.log("Checking Generation Status:",t),m.add(e)),e},P=async t=>{try{let{id:e}=await G(t);if(!e)throw new Error("Invalid ID received from POST request");return console.log("Website Generation Started"),a("Website Generation Started",t),new Promise((s,r)=>{let n=setInterval(async()=>{let d=await j(e),i=C(d);if(i!=="processing"){if(clearInterval(n),i!=="success")return r(new Error(i));s(d)}},1e3)})}catch(e){let s=e.message.includes("error")||e.message.includes("cancelled")?e.message:"";return{message:e.message,status:s}}};function a(t,e,s){let r=t,n={location:{place_id:e}};s&&(n.location.errorMessage=s),FS.event(r,FS.setUserVars(n))}function k(t,e){console.log("Success:",t),a("Website Generation Successful",e),window.location.href=t.redirectUri}function T(t,e){console.log("Error:",t),y(),a("Website Generation Failed",e,respoonse)}function A(t,e){console.log("Error:",t.message),y(),a("Website Generation Failed",e,t.message)}$("[data-form=generateBtn]").on("click",async function(){if(!p($("input[name=restaurant-name]")))return console.log("Validation Invalid");x();let e=E(c);console.log(e);try{let s=await P(e);s&&s.status==="success"?k(s,e):T(s,e)}catch(s){A(s,e)}});})();
