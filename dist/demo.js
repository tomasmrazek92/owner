"use strict";(()=>{var I,W=new Uint8Array(16);function P(){if(!I&&(I=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!I))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return I(W)}var s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function C(e,t=0){return s[e[t+0]]+s[e[t+1]]+s[e[t+2]]+s[e[t+3]]+"-"+s[e[t+4]]+s[e[t+5]]+"-"+s[e[t+6]]+s[e[t+7]]+"-"+s[e[t+8]]+s[e[t+9]]+"-"+s[e[t+10]]+s[e[t+11]]+s[e[t+12]]+s[e[t+13]]+s[e[t+14]]+s[e[t+15]]}var X=typeof crypto!="undefined"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),E={randomUUID:X};function K(e,t,n){if(E.randomUUID&&!t&&!e)return E.randomUUID();e=e||{};let a=e.random||(e.rng||P)();if(a[6]=a[6]&15|64,a[8]=a[8]&63|128,t){n=n||0;for(let r=0;r<16;++r)t[n+r]=a[r];return t}return C(a)}var A=K;var l=(e,t)=>{$(`input[name="${e}"]`).val(t)};var F=e=>{let t=localStorage.getItem(e);try{return JSON.parse(t)}catch{return t}},N=(e,t)=>{let n=typeof t=="object"?JSON.stringify(t):t;localStorage.setItem(e,n)};var Y="restaurant";var O=()=>{let e=JSON.parse(localStorage.getItem(Y)),t=["bar","cafe","bakery","food","restaurant"];for(let n=0;n<t.length;n++)if(e.types.includes(t[n]))return!0;return!1};function Z(e){let n=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test($(e).val());return _($(e),!n,"Please fill correct email address."),n}function ee(e){let t=!0;return t=te(e),t}var R=!1;function te(e){if(R)return R=!1,!0;let t=O();return t?_($(e),!1):_($(e),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),R=!0,t}function ne(e){let t,n=$(e).siblings(".select2"),a=$(e).siblings(".nice-select");n?t=n.find(".select2-selection--single"):a?t=$(a):t=$(e);let r=!0;return $(e).val()===""?(validArr.push(selectVal),$(t).addClass("is-invalid"),r=!1):$(t).removeClass("is-invalid"),r}function oe(e){return _($(e),!1),!0}function ae(e){return $(e).attr("name")==="restaurant-name"&&_($(e),!0,"Please select a business location from the search results."),_($(e),!0),!1}var U=e=>{let t=e,n=!0;return $(t).prop("required")&&($(t).val()?$(t).is('[type="email"]')?n=Z(t):$(t).attr("name")==="restaurant-name"?n=ee(t):$(t).is("select")?n=ne(t):n=oe(t):n=ae(t)),n?_($(t),!1):$(t).addClass("error"),n},_=(e,t,n)=>{let a=$(e).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(e).closest(".form-field, [form-field]").toggleClass("error",t),a.toggle(t),n&&a.text(n)};var T=(e,r,n)=>{var a=$(e),r=$(r);Object.keys(n).forEach(function(f){var h=n[f],v=a.find('input[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');v.length===0&&(v=a.find('select[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var y=v.val();Array.isArray(h)||(h=[h]),h.forEach(function(w){var m=r.find("input[name="+w.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");m.attr("type")==="checkbox"?String(y).toLowerCase()==="true"?m.prop("checked",!0):m.prop("checked",!1):ie(m,".hs-datepicker")?m.siblings("input[readonly]").val(y).change():m.val(y),["phone","mobilephone","email","pred_gmv"].includes(w)&&(m.get(0).focus({preventScrol:!0}),m.get(0).blur())})})},re=e=>{let t=!1;var n=e.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),a=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");n?(t=!0,a.text(n),a.show()):a.hide();var r=e.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),f=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return r?(f.text(r),f.show(),t=!0):f.hide(),t};function j(e){z(e)}function D(){return new Promise(function(e){z=e})}var L=e=>{let t=$('[data-form="submit-btn"]'),n,a=()=>{t.addClass("disabled")},r=()=>{t.removeClass("disabled")};b(!0),a(),setTimeout(()=>{n=re(e),r(),n?b(!1):e[0].submit()},3e3)};function b(e){let t=$("[form-loader]");e?(t.find('[data-animation-type="lottie"]').trigger("click"),t.fadeIn()):t.hide()}var z;function ie(e,t){let n=e[0]||e.get(0);if(!n)return!1;let{parentNode:a}=n;return a?Array.from(a.children).some(r=>r!==n&&r.matches(t)):!1}$(document).ready(()=>{let e,t=F("userId");t||(t=A(),N("userId",t));function n(o){function i(){let{userAgent:S}=navigator,B=navigator.appName,{platform:J}=navigator,{language:Q}=navigator;return{userAgent:S,browser:B,platform:J,language:Q}}let u=i(),g=p.find($("input[name=first-name]")).val(),c=p.find($("input[name=last-name]")).val(),d=p.find($("input[name=name]")).val(),q=p.find($("input[name=cellphone]")).val(),x=p.find($("input[name=email]")).val(),V={displayName:g+" "+c,restaurantName:d,phone:q,email:x,firstName:g,lastName:c,...u};typeof FS!="undefined"&&FS&&FS.event(o,FS.identify(t,V))}let a=()=>F("restaurant");function r(){return new Promise((o,i)=>{try{e=!1,o()}catch(u){i(u)}})}function f(){let o=a(),i={name:o.name,address:o.formatted_address,website:o.website,email:"jonathan@owner.com",token:"AJXuyxPXgGF68NMv",sfdc_id:"None"},u;function g(c){return new Promise((d,q)=>{$.ajax({url:"https://owner-ops.net/business-info/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(c),timeout:15e3,success:function(x){d(x)},error:function(x,V,S){V==="timeout"?(console.log("Error occurred:",S),l("execution_time_seconds",15),l("gmv_pred",0),d("")):(console.log("Error occurred:",S),d(""))}})})}return g(i).then(c=>(console.log(c),c[0])).catch(c=>(console.error("Error:",c),!1))}function h(o,i){let u=$("#demo-form input"),g=["brizo_id","base_enrich_date","inbound_add_to_cadence","execution_time_seconds","auto_dq_flag","auto_dq_reason","gmv_pred","inbound_add_to_cadence"];i?u.each(function(){let c=$(this).attr("name");if(g.includes(c)&&o.hasOwnProperty(c)){var d=o[c];typeof d=="number"||!isNaN(d)&&!isNaN(parseFloat(d))?$(this).val(Number(d).toFixed(2)):$(this).val(d)}}):y(!1)}function v(){let o=!0;return p.find(":input:visible, select").each(function(){let i=U($(this));o=o&&i}),o}function y(o){l("base_enrich_date",new Date().toISOString().slice(0,10)),l("inbound_add_to_cadence","true"),o&&(l("execution_time_seconds",0),l("auto_dq_flags","true")),o===!0&&(l("auto_dq_reason","none"),l("auto_dq_flags","false"))}function w(){l("page_url",window.location.pathname),l("page_lang",$("html").attr("lang")),l("url",(()=>{var i=a(),u=i.url;return u.split("cid=")[1]})());function o(i){let u=new URLSearchParams(window.location.search).get(i);return u||null}l("0-2/ps_partner_key",o("ps_partner_key")),l("0-2/ps_xid",o("ps_xid")),l("ps_partner_key",o("ps_partner_key")),l("ps_xid",o("ps_xid"))}async function m(){let o=v();if(console.log(o),o){b(!0);try{if(await r(),typeof e!="boolean"){let i=await f();typeof i.auto_dq_flag=="string"?(e=i.auto_dq_flag!=="True",h(i,!0)):(e=!1,h(i,!1))}}catch(i){e=!1,console.log("Qualification check or call failed:",i)}w(),T(p,k,H),n("Form Button Clicked"),L(k)}}function M(){m()}let G=()=>{let o=$(".demo-form_success");b(!1),p.hide(),o.show(),!window.location.href.includes("/blog/")&&!window.location.href.includes("/resources/")&&!window.location.href.includes("/downloads/")&&(window.location.href=e?"https://meetings.hubspot.com/brandon767/sales-inbound-round-robin":"https://www.owner.com/funnel-demo-requested")},p=$("[demo-form]"),k;hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:j,onFormSubmit:function(){console.log("Submit"),n("Form Submission Sent")},onFormSubmitted:()=>{n("Form Submission Sent"),setTimeout(()=>{G()},200)}}),D().then(function(o){k=$(o)});let H={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",url:"place_cid",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total","number-of-locations":"of_locations_number",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download",page_lang:"page_lang",brizo_id:["brizo_id","0-2/brizo_id_account"],base_enrich_date:["auto_enrich_date","0-2/auto_enrich_date_company"],inbound_add_to_cadence:"inbound_add_to_cadence",execution_time_seconds:"auto_enrich_time",auto_dq_flag:"auto_dq_static",auto_dq_reason:["auto_dq_reason","0-2/auto_dq_reason_company"],gmv_pred:["pred_gmv","0-2/pred_gmv_company"]};$("[data-form=submit-btn]").on("click",M),$(".nice-select li").on("click",function(){$(".nice-select .current").css("color","white")}),$('select[name="person-type"]').on("change",function(){$(this).val()==="I'm a restaurant owner or manager"?$("#locations-wrap").show():$("#locations-wrap").hide()})});})();
