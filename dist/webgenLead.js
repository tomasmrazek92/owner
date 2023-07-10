"use strict";(()=>{var w,Q=new Uint8Array(16);function E(){if(!w&&(w=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!w))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return w(Q)}var i=[];for(let t=0;t<256;++t)i.push((t+256).toString(16).slice(1));function U(t,e=0){return(i[t[e+0]]+i[t[e+1]]+i[t[e+2]]+i[t[e+3]]+"-"+i[t[e+4]]+i[t[e+5]]+"-"+i[t[e+6]]+i[t[e+7]]+"-"+i[t[e+8]]+i[t[e+9]]+"-"+i[t[e+10]]+i[t[e+11]]+i[t[e+12]]+i[t[e+13]]+i[t[e+14]]+i[t[e+15]]).toLowerCase()}var X=typeof crypto!="undefined"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),V={randomUUID:X};function Y(t,e,o){if(V.randomUUID&&!e&&!t)return V.randomUUID();t=t||{};let a=t.random||(t.rng||E)();if(a[6]=a[6]&15|64,a[8]=a[8]&63|128,e){o=o||0;for(let s=0;s<16;++s)e[o+s]=a[s];return e}return U(a)}var F=Y;var O=(t,e)=>{$(`input[name=${t}]`).val(e)};var x=t=>{let e=localStorage.getItem(t);try{return JSON.parse(e)}catch{return e}},P=(t,e)=>{let o=typeof e=="object"?JSON.stringify(e):e;localStorage.setItem(t,o)};var _="restaurant";var j=()=>{let t=JSON.parse(localStorage.getItem(_)),e=["bar","cafe","bakery","food","restaurant"];for(let o=0;o<e.length;o++)if(t.types.includes(e[o]))return!0;return!1};function Z(t){let o=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(t).val());return f($(t),!o,"Please fill correct email address."),o}function ee(t){let e=!0;return e=te(t),e}var R=!1;function te(t){if(R)return R=!1,!0;let e=j();return e?f($(t),!1):f($(t),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),R=!0,e}function ne(t){let e,o=$(t).siblings(".select2"),a=$(t).siblings(".nice-select");o?e=o.find(".select2-selection--single"):a?e=$(a):e=$(t);let s=!0;return $(t).val()===""?(validArr.push(selectVal),$(e).addClass("is-invalid"),s=!1):$(e).removeClass("is-invalid"),s}function oe(t){return f($(t),!1),!0}function re(t){return $(t).attr("name")==="restaurant-name"&&f($(t),!0,"Please select a business location from the search results."),f($(t),!0),!1}var k=t=>{let e=t,o=!0;return $(e).prop("required")&&($(e).val()?$(e).is('[type="email"]')?o=Z(e):$(e).attr("name")==="restaurant-name"?o=ee(e):$(e).is("select")?o=ne(e):o=oe(e):o=re(e)),o?f($(e),!1):$(e).addClass("error"),o},f=(t,e,o)=>{let a=$(t).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(t).closest(".form-field, [form-field]").toggleClass("error",e),a.toggle(e),o&&a.text(o)};var A=(t,s,o)=>{var a=$(t),s=$(s);Object.keys(o).forEach(function(c){var d=o[c],u=a.find('input[name="'+c.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');u.length===0&&(u=a.find('select[name="'+c.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var h=u.val();Array.isArray(d)||(d=[d]),d.forEach(function(g){var p=s.find("input[name="+g.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");p.val(h),["phone","mobilephone","email"].includes(g)&&(p.get(0).focus(),p.get(0).blur())})})},ae=t=>{let e=!1;var o=t.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),a=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");o?(e=!0,a.text(o),a.show()):a.hide();var s=t.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),c=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return s?(c.text(s),c.show(),e=!0):c.hide(),e};function G(t){N(t)}function D(){return new Promise(function(t){N=t})}var L=t=>{let e=$('[data-form="submit-btn"]'),o=e.text(),a,s=0,c=[".","..","..."],d=()=>{let p=`Submitting${c[s]}`;e.text(p),s=(s+1)%c.length},u=()=>{e.addClass("disabled")},h=()=>{e.removeClass("disabled").text(o)};u();let g=setInterval(d,500);setTimeout(()=>{a=ae(t),clearInterval(g),h(),a||t.find("input[type=submit]").trigger("click")},3e3)},N;$(document).ready(()=>{let t=typeof devEnv!="undefined"&&devEnv?"https://dev-api.owner.com":"https://api.owner.com",e=x("userId");e||(e=F(),P("userId",e));let o=$(".main-wrapper"),a=$(".growth-form"),s=$(".growth-loading"),c=$(".growth-error");function d(){$(o,c,a).fadeOut(500,function(){$(s).fadeIn(400)});let r=$(".growth-loading_step"),n=0;function l(){n<r.length-1&&r.eq(n).fadeOut(1e3,function(){n+=1,r.eq(n).fadeIn(1e3),setTimeout(l,4e3)})}r.hide().eq(n).show(),setTimeout(l,4e3)}function u(){$(o).add(s).add(a).hide(),$(c).fadeIn()}function h(r){return x(r).place_id}let g=async r=>{let n=await fetch(`${t}/generator/v1/generations`,{method:"POST",headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:JSON.stringify({googleId:r})});return n.ok||console.error("POST request error:",n.status,await n.text()),await n.json()},p=async r=>await(await fetch(`${t}/generator/v1/generations/${r}`)).json(),C=new Set,W=r=>{let{status:n}=r;return C.has(n)||(console.log("Checking Generation Status:",r),C.add(n)),n},q=async r=>{try{let{id:n}=await g(r);if(!n)throw new Error("Invalid ID received from POST request");return new Promise((l,y)=>{let b=setInterval(async()=>{let T=await p(n),S=W(T);if(S!=="processing"){if(clearInterval(b),S!=="success")return y(new Error(S));l(T)}},1e3)})}catch(n){let l=n.message.includes("error")||n.message.includes("cancelled")?n.message:"";return{message:n.message,status:l}}};function v(r,n,l,y){let b=n;console.log(b),y&&(b.location.errorMessage=y),typeof FS!="undefined"&&FS&&FS.event(l,FS.identify(r,b))}function H(r,n){console.log("Success:",r);let l=r.redirectUri+"&fsUserId="+e;v(e,{location:{requestBody:n},generatedUrl:l},"Website Generation Successful"),setTimeout(()=>{window.location.href=l},250)}function z(r,n){console.log("Error:",r),u(),v(e,{location:{requestBody:n}},"Website Generation Failed",respoonse)}function J(r,n){console.log("Error:",r.message),u(),v(e,{location:{requestBody:n}},"Website Generation Failed",r.message)}async function B(r){d();try{let n=await q(r);n&&n.status==="success"?H(n,r):z(n,r)}catch(n){J(n,r)}}let m=$("#growth-form"),I,M=()=>{v(e,{displayName:m.find($("input[name=first-name]")).val()+" "+m.find($("input[name=last-name]")).val(),email:m.find($("input[name=email]")).val(),firstName:m.find($("input[name=first-name]")).val(),lastName:m.find($("input[name=last-name]")).val(),phone:m.find($("input[name=cellphone]")).val()},"Enter Contact Information Successful");let r=h(_);B(r)};$("[data-form=generateBtn]").on("click",async function(){if(!k($("input[name=restaurant-name]")))return console.log("Validation Invalid");let n=h(_);v(e,{location:{requestBody:n}},"Website Generation Started"),$(o).fadeOut(500,function(){$(a).fadeIn(400)})}),hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:G,onFormSubmitted:M}),D().then(function(r){I=$(r)});let K={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download"};$("[data-form=submit-btn]").on("click",function(r){r.preventDefault();let n=!0;m.find(":input:visible, select").each(function(){let l=k($(this));n=n&&l}),n&&(O("page_url",window.location.pathname),A(m,I,K),L(I))})});})();
