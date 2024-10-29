"use strict";(()=>{var I,W=new Uint8Array(16);function A(){if(!I&&(I=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!I))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return I(W)}var l=[];for(let e=0;e<256;++e)l.push((e+256).toString(16).slice(1));function O(e,t=0){return l[e[t+0]]+l[e[t+1]]+l[e[t+2]]+l[e[t+3]]+"-"+l[e[t+4]]+l[e[t+5]]+"-"+l[e[t+6]]+l[e[t+7]]+"-"+l[e[t+8]]+l[e[t+9]]+"-"+l[e[t+10]]+l[e[t+11]]+l[e[t+12]]+l[e[t+13]]+l[e[t+14]]+l[e[t+15]]}var X=typeof crypto!="undefined"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),E={randomUUID:X};function K(e,t,n){if(E.randomUUID&&!t&&!e)return E.randomUUID();e=e||{};let a=e.random||(e.rng||A)();if(a[6]=a[6]&15|64,a[8]=a[8]&63|128,t){n=n||0;for(let s=0;s<16;++s)t[n+s]=a[s];return t}return O(a)}var N=K;var i=(e,t)=>{let n=$(`input[name="${e}"]`);n.attr("type")==="checkbox"?n.prop("checked",t):n.val(t)};var F=e=>{let t=localStorage.getItem(e);try{return JSON.parse(t)}catch{return t}},P=(e,t)=>{let n=typeof t=="object"?JSON.stringify(t):t;localStorage.setItem(e,n)};var q=()=>{let e=JSON.parse(localStorage.getItem("restaurantObject"));return e&&Array.isArray(e.types)?["bar","cafe","bakery","food","restaurant"].some(n=>e.types.includes(n)):!1};function Y(e){let n=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test($(e).val());return h($(e),!n,"Please fill correct email address."),n}function Z(e){let t=!0;return t=ee(e),t}var R=!1;function ee(e){if(R)return R=!1,!0;let t=q();return t?h($(e),!1):h($(e),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),R=!0,t}function te(e){let t,n=$(e).siblings(".select2"),a=$(e).siblings(".nice-select");n?t=n.find(".select2-selection--single"):a?t=$(a):t=$(e);let s=!0;return $(e).val()===""?(validArr.push(selectVal),$(t).addClass("is-invalid"),s=!1):$(t).removeClass("is-invalid"),s}function ne(e){return h($(e),!1),!0}function oe(e){return $(e).attr("name")==="restaurant-name"&&h($(e),!0,"Please select a business location from the search results."),h($(e),!0),!1}var U=e=>{let t=e,n=!0;return $(t).prop("required")&&($(t).val()?$(t).is('[type="email"]')?n=Y(t):$(t).attr("name")==="restaurant-name"?n=Z(t):$(t).is("select")?n=te(t):n=ne(t):n=oe(t)),n?h($(t),!1):$(t).addClass("error"),n},h=(e,t,n)=>{let a=$(e).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(e).closest(".form-field, [form-field]").toggleClass("error",t),a.toggle(t),n&&a.text(n)};var j=(e,s,n)=>{var a=$(e),s=$(s);Object.keys(n).forEach(function(f){var g=n[f],y=a.find('input[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');y.length===0&&(y=a.find('select[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var v=y.val();Array.isArray(g)||(g=[g]),g.forEach(function(w){var m=s.find("input[name="+w.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");m.attr("type")==="checkbox"?String(v).toLowerCase()==="true"?m.prop("checked",!0):m.prop("checked",!1):re(m,".hs-datepicker")?m.siblings("input[readonly]").val(v).change():m.val(v),["phone","mobilephone","email","pred_gmv"].includes(w)&&(m.get(0).focus({preventScrol:!0}),m.get(0).blur())})})},ae=e=>{let t=!1;var n=e.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),a=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");n?(t=!0,a.text(n),a.show()):a.hide();var s=e.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),f=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return s?(f.text(s),f.show(),t=!0):f.hide(),t};function T(e){D(e)}function z(){return new Promise(function(e){D=e})}var L=e=>{let t=$('[data-form="submit-btn"]'),n,a=()=>{t.addClass("disabled")},s=()=>{t.removeClass("disabled")};b(!0),a(),setTimeout(()=>{n=ae(e),s(),n?b(!1):e[0].submit()},3e3)};function b(e){let t=$("[form-loader]");e?(t.find('[data-animation-type="lottie"]').trigger("click"),t.fadeIn()):t.hide()}var D;function re(e,t){let n=e[0]||e.get(0);if(!n)return!1;let{parentNode:a}=n;return a?Array.from(a.children).some(s=>s!==n&&s.matches(t)):!1}$(document).ready(()=>{let e,t=F("userId");t||(t=N(),P("userId",t));function n(o){function r(){let{userAgent:S}=navigator,B=navigator.appName,{platform:J}=navigator,{language:Q}=navigator;return{userAgent:S,browser:B,platform:J,language:Q}}let c=r(),_=p.find($("input[name=first-name]")).val(),u=p.find($("input[name=last-name]")).val(),d=p.find($("input[name=name]")).val(),C=p.find($("input[name=cellphone]")).val(),x=p.find($("input[name=email]")).val(),V={displayName:_+" "+u,restaurantName:d,phone:C,email:x,firstName:_,lastName:u,...c};typeof FS!="undefined"&&FS&&FS.event(o,FS.identify(t,V))}let a=()=>F("restaurant");function s(){return new Promise((o,r)=>{try{if(typeof scheduleFlow!="undefined"&&scheduleFlow){let c=a();e=void 0;let _=$('select[name="person-type"]').val()==="I'm a restaurant owner or manager",u=c.address_components.some(d=>d.short_name==="US");(!_||!u)&&(n("Submission Disqualified"),e=!1)}else e=!1;o()}catch(c){r(c)}})}function f(){let o=a(),r={name:o.name,address:o.formatted_address,website:o.website,email:"jonathan@owner.com",token:"AJXuyxPXgGF68NMv",sfdc_id:"None"},c;function _(u){return new Promise((d,C)=>{$.ajax({url:"https://owner-ops.net/business-info/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(u),timeout:15e3,success:function(x){d(x)},error:function(x,V,S){V==="timeout"?(console.log("Error occurred:",S),i("execution_time_seconds",15),i("gmv_pred",0),d("")):(console.log("Error occurred:",S),d(""))}})})}return _(r).then(u=>(console.log(u),u[0])).catch(u=>(console.error("Error:",u),!1))}function g(o,r){console.log(o),console.log(r);let c=$("[demo-form] input"),_=["brizo_id","base_enrich_date","inbound_add_to_cadence","execution_time_seconds","auto_dq_flag","auto_dq_reason","gmv_pred"];r?c.each(function(){let u=$(this).attr("name");if(_.includes(u)&&o.hasOwnProperty(u)){var d=o[u];typeof d=="number"||!isNaN(d)&&!isNaN(parseFloat(d))?$(this).val(Number(d).toFixed(2)):$(this).val(d)}}):v(!1)}function y(){let o=!0;return p.find(":input:visible, select").each(function(){let r=U($(this));o=o&&r}),o}function v(o){console.log(o),i("base_enrich_date",new Date().toISOString().slice(0,10)),i("inbound_add_to_cadence","true"),o===!1&&(i("execution_time_seconds",0),i("auto_dq_flags","true")),o===!0&&(i("execution_time_seconds",0),i("auto_dq_reason","none"),i("auto_dq_flags","false"),i("self_service_scheduling_shown",!0))}function w(){i("page_url",window.location.pathname),i("page_lang",$("html").attr("lang")),i("url",(()=>{var r=a();if(r&&r.url){var c=r.url;return c.split("cid=")[1]}return"none"})());function o(r){let c=new URLSearchParams(window.location.search).get(r);return c||null}i("0-2/ps_partner_key",o("ps_partner_key")),i("0-2/ps_xid",o("ps_xid")),i("ps_partner_key",o("ps_partner_key")),i("ps_xid",o("ps_xid"))}async function m(){let o=y();if(console.log(o),o){b(!0);try{if(await s(),typeof e!="boolean"){let r=await f(),c=r.auto_dq_flag;i("self_service_enrichment_api_used",!0),typeof c=="string"?(e=r.auto_dq_flag!=="True",g(r,!0),e&&i("self_service_scheduling_shown",!0)):(e=!1,g(r,!1))}else v(e)}catch(r){e=!1,console.log("Qualification check or call failed:",r)}w(),j(p,k,M),n("Form Button Clicked"),L(k)}}function G(){m()}let H=()=>{let o=$(".demo-form_success");b(!1),p.hide(),o.show(),!window.location.href.includes("/blog/")&&!window.location.href.includes("/resources/")&&!window.location.href.includes("/downloads/")&&(window.location.href=e?"https://meetings.hubspot.com/jonathan-shenkman/self-scheduling":"https://www.owner.com/funnel-demo-requested")},p=$("[demo-form]"),k;hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:T,onFormSubmit:function(){console.log("Submit"),n("Form Submission Attempt")},onFormSubmitted:()=>{n("Form Submission Sent"),setTimeout(()=>{H()},200)}}),z().then(function(o){k=$(o)});let M={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",url:"place_cid",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total","number-of-locations":"of_locations_number",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download",page_lang:"page_lang",brizo_id:["brizo_id","0-2/brizo_id_account"],base_enrich_date:["auto_enrich_date","0-2/auto_enrich_date_company"],inbound_add_to_cadence:"inbound_add_to_cadence",execution_time_seconds:"auto_enrich_time",auto_dq_flag:"auto_dq_static",auto_dq_reason:["auto_dq_reason","0-2/auto_dq_reason_company"],gmv_pred:["pred_gmv","0-2/pred_gmv_company"]};$("[data-form=submit-btn]").on("click",G),$('select[name="person-type"]').on("change",function(){$(this).val()==="I'm a restaurant owner or manager"?$("#locations-wrap").show():$("#locations-wrap").hide()}),new Cleave('input[name="cellphone"]',{numericOnly:!0,blocks:[0,3,3,4,10],delimiters:["(",") ","-"," x"],delimiterLazyShow:!0})});})();
