"use strict";(()=>{var _,Y=new Uint8Array(16);function E(){if(!_&&(_=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!_))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return _(Y)}var i=[];for(let e=0;e<256;++e)i.push((e+256).toString(16).slice(1));function T(e,t=0){return(i[e[t+0]]+i[e[t+1]]+i[e[t+2]]+i[e[t+3]]+"-"+i[e[t+4]]+i[e[t+5]]+"-"+i[e[t+6]]+i[e[t+7]]+"-"+i[e[t+8]]+i[e[t+9]]+"-"+i[e[t+10]]+i[e[t+11]]+i[e[t+12]]+i[e[t+13]]+i[e[t+14]]+i[e[t+15]]).toLowerCase()}var Z=typeof crypto!="undefined"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),V={randomUUID:Z};function ee(e,t,n){if(V.randomUUID&&!t&&!e)return V.randomUUID();e=e||{};let a=e.random||(e.rng||E)();if(a[6]=a[6]&15|64,a[8]=a[8]&63|128,t){n=n||0;for(let s=0;s<16;++s)t[n+s]=a[s];return t}return T(a)}var F=ee;var k=(e,t)=>{$(`input[name=${e}]`).val(t)};var x=e=>{let t=localStorage.getItem(e);try{return JSON.parse(t)}catch{return t}},O=(e,t)=>{let n=typeof t=="object"?JSON.stringify(t):t;localStorage.setItem(e,n)};var w="restaurant";var j=()=>{let e=JSON.parse(localStorage.getItem(w)),t=["bar","cafe","bakery","food","restaurant"];for(let n=0;n<t.length;n++)if(e.types.includes(t[n]))return!0;return!1};function te(e){let n=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(e).val());return f($(e),!n,"Please fill correct email address."),n}function ne(e){let t=!0;return t=re(e),t}var P=!1;function re(e){if(P)return P=!1,!0;let t=j();return t?f($(e),!1):f($(e),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),P=!0,t}function oe(e){let t,n=$(e).siblings(".select2"),a=$(e).siblings(".nice-select");n?t=n.find(".select2-selection--single"):a?t=$(a):t=$(e);let s=!0;return $(e).val()===""?(validArr.push(selectVal),$(t).addClass("is-invalid"),s=!1):$(t).removeClass("is-invalid"),s}function ae(e){return f($(e),!1),!0}function se(e){return $(e).attr("name")==="restaurant-name"&&f($(e),!0,"Please select a business location from the search results."),f($(e),!0),!1}var R=e=>{let t=e,n=!0;return $(t).prop("required")&&($(t).val()?$(t).is('[type="email"]')?n=te(t):$(t).attr("name")==="restaurant-name"?n=ne(t):$(t).is("select")?n=oe(t):n=ae(t):n=se(t)),n?f($(t),!1):$(t).addClass("error"),n},f=(e,t,n)=>{let a=$(e).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(e).closest(".form-field, [form-field]").toggleClass("error",t),a.toggle(t),n&&a.text(n)};var L=(e,s,n)=>{var a=$(e),s=$(s);Object.keys(n).forEach(function(c){var p=n[c],g=a.find('input[name="'+c.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');g.length===0&&(g=a.find('select[name="'+c.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var m=g.val();Array.isArray(p)||(p=[p]),p.forEach(function(h){var d=s.find("input[name="+h.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");d.attr("type")==="checkbox"?String(m).toLowerCase()==="true"?d.prop("checked",!0):d.prop("checked",!1):le(d,".hs-datepicker")?d.siblings("input[readonly]").val(m).change():d.val(m),["phone","mobilephone","email","pred_gmv"].includes(h)&&(d.get(0).focus({preventScrol:!0}),d.get(0).blur())})})},ie=e=>{let t=!1;var n=e.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),a=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");n?(t=!0,a.text(n),a.show()):a.hide();var s=e.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),c=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return s?(c.text(s),c.show(),t=!0):c.hide(),t};function D(e){q(e)}function N(){return new Promise(function(e){q=e})}var W=e=>{let t=$('[data-form="submit-btn"]'),n,a=()=>{t.addClass("disabled")},s=()=>{t.removeClass("disabled")};G(!0),a(),setTimeout(()=>{n=ie(e),s(),n?G(!1):e.find("input[type=submit]").trigger("click")},3e3)};function G(e){let t=$(".n_demo-form_loading");e?(t.find('[data-animation-type="lottie"]').trigger("click"),t.fadeIn()):t.hide()}var q;function le(e,t){let n=e[0]||e.get(0);if(!n)return!1;let{parentNode:a}=n;return a?Array.from(a.children).some(s=>s!==n&&s.matches(t)):!1}$(document).ready(()=>{let e=typeof devEnv!="undefined"&&devEnv?"https://dev-api.owner.com":"https://api.owner.com",t=!!(typeof devEnv!="undefined"&&devEnv),n=x("userId");n||(n=F(),O("userId",n));let a=$(".main-wrapper"),s=$(".growth-form"),c=$(".growth-loading"),p=$(".growth-error");function g(){$(a).add(p).add(s).stop().fadeOut(500,function(){$(c).fadeIn(400)});let o=$(".growth-loading_step"),r=0;function l(){r<o.length-1&&o.eq(r).fadeOut(1e3,function(){r+=1,o.eq(r).fadeIn(1e3),setTimeout(l,4e3)})}o.hide().eq(r).show(),setTimeout(l,4e3)}function m(){$(a).add(c).add(s).stop().hide(),$(p).stop().fadeIn()}function h(o){return x(o).place_id}let d=async o=>{let r=await fetch(`${e}/generator/v1/generations`,{method:"POST",headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:JSON.stringify({googleId:o})});return r.ok||console.error("POST request error:",r.status,await r.text()),await r.json()},H=async o=>await(await fetch(`${e}/generator/v1/generations/${o}`)).json(),C=new Set,z=o=>{let{status:r}=o;return C.has(r)||(console.log("Checking Generation Status:",o),C.add(r)),r},J=async o=>{try{let{id:r}=await d(o);if(!r)throw new Error("Invalid ID received from POST request");return new Promise((l,y)=>{let b=setInterval(async()=>{let A=await H(r),S=z(A);if(S!=="processing"){if(clearInterval(b),S!=="success")return y(new Error(S));l(A)}},1e3)})}catch(r){let l=r.message.includes("error")||r.message.includes("cancelled")?r.message:"";return{message:r.message,status:l}}};function v(o,r,l,y){let b=r;console.log(b),y&&(b.location.errorMessage=y),typeof FS!="undefined"&&FS&&FS.event(l,FS.identify(o,b))}function M(o,r){console.log("Success:",o);let l=o.redirectUri+(t?"":"&fsUserId="+n);v(n,{location:{requestBody:r},generatedUrl:l},"Website Generation Successful"),setTimeout(()=>{window.location.href=l},250)}function B(o,r){console.log("Error:",o),m(),v(n,{location:{requestBody:r}},"Website Generation Failed",respoonse)}function K(o,r){console.log("Error:",o.message),m(),v(n,{location:{requestBody:r}},"Website Generation Failed",o.message)}async function U(o){g();try{let r=await J(o);r&&r.status==="success"?M(r,o):B(r,o)}catch(r){K(r,o)}}let u=$("#growth-form"),I,Q=()=>{v(n,{displayName:u.find($("input[name=first-name]")).val()+" "+u.find($("input[name=last-name]")).val(),email:u.find($("input[name=email]")).val(),firstName:u.find($("input[name=first-name]")).val(),lastName:u.find($("input[name=last-name]")).val(),phone:u.find($("input[name=cellphone]")).val()},"Enter Contact Information Successful");let o=h(w);U(o)};$("[data-form=generateBtn]").on("click",async function(){if(!R($("input[name=restaurant-name]")))return console.log("Validation Invalid");if(t){let l=h(w);U(l);return}let r=h(w);v(n,{location:{requestBody:r}},"Website Generation Started"),$(a).fadeOut(500,function(){$(s).fadeIn(400)})}),hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:D,onFormSubmitted:Q}),N().then(function(o){I=$(o)});let X={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download"};$("[data-form=submit-btn]").on("click",function(o){o.preventDefault();let r=!0;u.find(":input:visible, select").each(function(){let l=R($(this));r=r&&l}),r&&(k("page_url",window.location.pathname),L(u,I,X),W(I))})});})();
