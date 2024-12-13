"use strict";(()=>{var F,Y=new Uint8Array(16);function C(){if(!F&&(F=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!F))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return F(Y)}var c=[];for(let e=0;e<256;++e)c.push((e+256).toString(16).slice(1));function q(e,t=0){return c[e[t+0]]+c[e[t+1]]+c[e[t+2]]+c[e[t+3]]+"-"+c[e[t+4]]+c[e[t+5]]+"-"+c[e[t+6]]+c[e[t+7]]+"-"+c[e[t+8]]+c[e[t+9]]+"-"+c[e[t+10]]+c[e[t+11]]+c[e[t+12]]+c[e[t+13]]+c[e[t+14]]+c[e[t+15]]}var Z=typeof crypto!="undefined"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),A={randomUUID:Z};function ee(e,t,n){if(A.randomUUID&&!t&&!e)return A.randomUUID();e=e||{};let o=e.random||(e.rng||C)();if(o[6]=o[6]&15|64,o[8]=o[8]&63|128,t){n=n||0;for(let s=0;s<16;++s)t[n+s]=o[s];return t}return q(o)}var R=ee;var i=(e,t)=>{let n=$(`input[name="${e}"]`);n.attr("type")==="checkbox"?n.prop("checked",t):n.val(t)},w=e=>$(`input[name="${e}"]`).val();var V=e=>{let t=localStorage.getItem(e);try{return JSON.parse(t)}catch{return t}},O=(e,t)=>{let n=typeof t=="object"?JSON.stringify(t):t;localStorage.setItem(e,n)};var P=!1,U=e=>{let t=JSON.parse(localStorage.getItem("restaurant"));if(t&&Array.isArray(t.types)){let n=["bar","cafe","bakery","food","restaurant"];return!t.types.some(s=>n.includes(s))&&!P?(_(e),P=!0,!1):!0}return!1};function te(e){let n=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test($(e).val());return _($(e),!n,"Please fill correct email address."),n}function ne(e){let t=!0;return t=ae(e),t}function ae(e){let t=U(e);return t?_($(e),!1):_($(e),!0),t}function oe(e){let t,n=$(e).siblings(".select2"),o=$(e).siblings(".nice-select");n?t=n.find(".select2-selection--single"):o?t=$(o):t=$(e);let s=!0;return $(e).val()===""?(validArr.push(selectVal),$(t).addClass("is-invalid"),s=!1):$(t).removeClass("is-invalid"),s}function re(e){return _($(e),!1),!0}function se(e){return $(e).attr("name")==="restaurant-name"&&_($(e),!0,"Please select a business location from the search results."),_($(e),!0),!1}var j=e=>{let t=e,n=!0;return $(t).prop("required")&&($(t).val()?$(t).is('[type="email"]')?n=te(t):$(t).attr("name")==="restaurant-name"?n=ne(t):$(t).is("select")?n=oe(t):n=re(t):n=se(t)),n?_($(t),!1):$(t).addClass("error"),n},_=(e,t,n)=>{let o=$(e).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(e).closest(".form-field, [form-field]").toggleClass("error",t),o.toggle(t),n&&o.text(n)};var T=(e,s,n)=>{var o=$(e),s=$(s);Object.keys(n).forEach(function(f){var v=n[f],b=o.find('input[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');b.length===0&&(b=o.find('select[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var y=b.val();Array.isArray(v)||(v=[v]),v.forEach(function(S){var p=s.find("input[name="+S.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");p.attr("type")==="checkbox"?String(y).toLowerCase()==="true"?p.prop("checked",!0):p.prop("checked",!1):le(p,".hs-datepicker")?p.siblings("input[readonly]").val(y).change():p.val(y),["phone","mobilephone","email","pred_gmv"].includes(S)&&(p.get(0).focus({preventScrol:!0}),p.get(0).blur())})})},ie=e=>{let t=!1;var n=e.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),o=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");n?(t=!0,o.text(n),o.show()):o.hide();var s=e.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),f=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return s?(f.text(s),f.show(),t=!0):f.hide(),t};function L(e){M(e)}function z(){return new Promise(function(e){M=e})}var D=e=>{let t=$('[data-form="submit-btn"]'),n,o=()=>{t.addClass("disabled")},s=()=>{t.removeClass("disabled")};x(!0),o(),setTimeout(()=>{n=ie(e),s(),n?x(!1):e[0].submit()},3e3)};function x(e){let t=$("[form-loader]");e?(t.find('[data-animation-type="lottie"]').trigger("click"),t.fadeIn()):t.hide()}var M;function le(e,t){let n=e[0]||e.get(0);if(!n)return!1;let{parentNode:o}=n;return o?Array.from(o.children).some(s=>s!==n&&s.matches(t)):!1}$(document).ready(()=>{let e,t=typeof scheduleFlow!="undefined"&&scheduleFlow,n=V("userId");n||(n=R(),O("userId",n));function o(a){function r(){let{userAgent:k}=navigator,W=navigator.appName,{platform:X}=navigator,{language:K}=navigator;return{userAgent:k,browser:W,platform:X,language:K}}let l=r(),h=g.find($("input[name=first-name]")).val(),u=g.find($("input[name=last-name]")).val(),d=g.find($("input[name=name]")).val(),I=g.find($("input[name=cellphone]")).val(),m=g.find($("input[name=email]")).val(),E={displayName:h+" "+u,restaurantName:d,phone:I,email:m,firstName:h,lastName:u,...l};typeof FS!="undefined"&&FS&&FS.event(a,FS.identify(n,E))}function s(){var a="db833abde57f505b06b0e4b2bfe5e24f",r="2226621",l=document.createElement("img");l.src="https://ct.capterra.com/capterra_tracker.gif?vid="+r+"&vkey="+a,document.body.appendChild(l)}let f=()=>V("restaurant");function v(){return new Promise((a,r)=>{try{if(t){let l=f();e=void 0;let h=$('select[name="person-type"]').val()==="I'm a restaurant owner or manager",u=l.address_components.some(d=>d.short_name==="US");(!h||!u)&&(o("Submission Disqualified"),e=!1)}else e=!1;a()}catch(l){r(l)}})}function b(){let a=f(),r={name:a.name,address:a.formatted_address,website:a.website,email:"jonathan@owner.com",token:"AJXuyxPXgGF68NMv",sfdc_id:"None"},l;function h(u){return new Promise((d,I)=>{$.ajax({url:"https://owner-ops.net/business-info/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(u),timeout:15e3,success:function(m){d(m)},error:function(m,E,k){E==="timeout"?(console.log("Error occurred:",k),i("execution_time_seconds",15),i("gmv_pred",0),d("")):(console.log("Error occurred:",k),d(""))}})})}return h(r).then(u=>(console.log(u),u[0])).catch(u=>(console.error("Error:",u),!1))}function y(a,r){console.log(a),console.log(r);let l=$("[demo-form] input"),h=["brizo_id","base_enrich_date","inbound_add_to_cadence","execution_time_seconds","auto_dq_flag","auto_dq_reason","gmv_pred"];r?l.each(function(){let u=$(this).attr("name");if(h.includes(u)&&a.hasOwnProperty(u)){var d=a[u];typeof d=="number"||!isNaN(d)&&!isNaN(parseFloat(d))?$(this).val(Number(d).toFixed(2)):$(this).val(d)}}):p(!1)}function S(){let a=!0;return g.find(":input:visible, select").each(function(){let r=j($(this));a=a&&r}),a}function p(a){console.log(a),i("base_enrich_date",new Date().toISOString().slice(0,10)),i("inbound_add_to_cadence","true"),a===!1&&(i("execution_time_seconds",0),i("auto_dq_flags","true")),a===!0&&(i("execution_time_seconds",0),i("auto_dq_reason","none"),i("auto_dq_flags","false"),i("self_service_scheduling_shown",!0))}function G(){i("page_url",window.location.pathname),i("page_lang",$("html").attr("lang")),i("url",(()=>{var r=f();if(r&&r.url){var l=r.url;return l.split("cid=")[1]}return"none"})());function a(r){let l=new URLSearchParams(window.location.search).get(r);return l||null}i("0-2/ps_partner_key",a("ps_partner_key")),i("0-2/ps_xid",a("ps_xid")),i("ps_partner_key",a("ps_partner_key")),i("ps_xid",a("ps_xid"))}async function H(){let a=S();if(console.log(a),a){x(!0);try{if(await v(),typeof e!="boolean"){let r=await b(),l=r.auto_dq_flag;i("self_service_enrichment_api_used",!0),typeof l=="string"?(e=r.auto_dq_flag!=="True",y(r,!0),e&&i("self_service_scheduling_shown",!0)):(e=!1,y(r,!1))}else p(e)}catch(r){e=!1,console.log("Qualification check or call failed:",r)}G(),T(g,N,Q),o("Form Button Clicked"),D(N)}}function B(){H()}let J=()=>{let a=$(".demo-form_success"),r=t&&e,l=!window.location.href.includes("/blog/")&&!window.location.href.includes("/resources/")&&!window.location.href.includes("/downloads/");if(x(!1),g.hide(),r){let d=function(I){var m=$.extend({},h,I);console.log(m.email),console.log(m.fName),console.log(m.lName),console.log(m.company),$(m.selector).html('<div class="meetings-iframe-container" data-src="'+m.link+`?embed=true&firstName=${m.fName}&lastName=${m.lName}&email=${m.email}&company=${m.company}"></div>`),$.getScript("https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js").done(function(){a.show()})};var u=d,h={link:"https://meetings.hubspot.com/jonathan-shenkman/self-scheduling",selector:".demo-form_success",email:w("email"),fName:w("first-name"),lName:w("last-name"),company:w("name")};d()}else l?(a.show(),window.location.href="https://www.owner.com/funnel-demo-requested"):a.show()},g=$("[demo-form]"),N;hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:L,onFormSubmit:function(){console.log("Submit"),o("Form Submission Attempt")},onFormSubmitted:()=>{o("Form Submission Sent"),s(),setTimeout(()=>{J()},200)}}),z().then(function(a){N=$(a)});let Q={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",url:"place_cid",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total","number-of-locations":"of_locations_number",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download",page_lang:"page_lang",brizo_id:["brizo_id","0-2/brizo_id_account"],base_enrich_date:["auto_enrich_date","0-2/auto_enrich_date_company"],inbound_add_to_cadence:"inbound_add_to_cadence",execution_time_seconds:"auto_enrich_time",auto_dq_flag:"auto_dq_static",auto_dq_reason:["auto_dq_reason","0-2/auto_dq_reason_company"],gmv_pred:["pred_gmv","0-2/pred_gmv_company"]};$("[data-form=submit-btn]").on("click",B),$('select[name="person-type"]').on("change",function(){$(this).val()==="I'm a restaurant owner or manager"?$("#locations-wrap").show():$("#locations-wrap").hide()}),new Cleave('input[name="cellphone"]',{numericOnly:!0,blocks:[0,3,3,4,10],delimiters:["(",") ","-"],delimiterLazyShow:!0})});})();
