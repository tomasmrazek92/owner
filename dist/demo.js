"use strict";(()=>{var I,X=new Uint8Array(16);function E(){if(!I&&(I=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!I))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return I(X)}var s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function C(e,t=0){return(s[e[t+0]]+s[e[t+1]]+s[e[t+2]]+s[e[t+3]]+"-"+s[e[t+4]]+s[e[t+5]]+"-"+s[e[t+6]]+s[e[t+7]]+"-"+s[e[t+8]]+s[e[t+9]]+"-"+s[e[t+10]]+s[e[t+11]]+s[e[t+12]]+s[e[t+13]]+s[e[t+14]]+s[e[t+15]]).toLowerCase()}var K=typeof crypto!="undefined"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),N={randomUUID:K};function Y(e,t,n){if(N.randomUUID&&!t&&!e)return N.randomUUID();e=e||{};let a=e.random||(e.rng||E)();if(a[6]=a[6]&15|64,a[8]=a[8]&63|128,t){n=n||0;for(let r=0;r<16;++r)t[n+r]=a[r];return t}return C(a)}var P=Y;var c=(e,t)=>{$(`input[name=${e}]`).val(t)};var F=e=>{let t=localStorage.getItem(e);try{return JSON.parse(t)}catch{return t}},R=(e,t)=>{let n=typeof t=="object"?JSON.stringify(t):t;localStorage.setItem(e,n)};var Z="restaurant";var O=()=>{let e=JSON.parse(localStorage.getItem(Z)),t=["bar","cafe","bakery","food","restaurant"];for(let n=0;n<t.length;n++)if(e.types.includes(t[n]))return!0;return!1};function ee(e){let n=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(e).val());return p($(e),!n,"Please fill correct email address."),n}function te(e){let t=!0;return t=ne(e),t}var q=!1;function ne(e){if(q)return q=!1,!0;let t=O();return t?p($(e),!1):p($(e),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),q=!0,t}function ae(e){let t,n=$(e).siblings(".select2"),a=$(e).siblings(".nice-select");n?t=n.find(".select2-selection--single"):a?t=$(a):t=$(e);let r=!0;return $(e).val()===""?(validArr.push(selectVal),$(t).addClass("is-invalid"),r=!1):$(t).removeClass("is-invalid"),r}function oe(e){return p($(e),!1),!0}function re(e){return $(e).attr("name")==="restaurant-name"&&p($(e),!0,"Please select a business location from the search results."),p($(e),!0),!1}var T=e=>{let t=e,n=!0;return $(t).prop("required")&&($(t).val()?$(t).is('[type="email"]')?n=ee(t):$(t).attr("name")==="restaurant-name"?n=te(t):$(t).is("select")?n=ae(t):n=oe(t):n=re(t)),n?p($(t),!1):$(t).addClass("error"),n},p=(e,t,n)=>{let a=$(e).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(e).closest(".form-field, [form-field]").toggleClass("error",t),a.toggle(t),n&&a.text(n)};var U=(e,r,n)=>{var a=$(e),r=$(r);Object.keys(n).forEach(function(f){var h=n[f],_=a.find('input[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');_.length===0&&(_=a.find('select[name="'+f.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var y=_.val();Array.isArray(h)||(h=[h]),h.forEach(function(w){var m=r.find("input[name="+w.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");m.attr("type")==="checkbox"?String(y).toLowerCase()==="true"?m.prop("checked",!0):m.prop("checked",!1):se(m,".hs-datepicker")?m.siblings("input[readonly]").val(y).change():m.val(y),["phone","mobilephone","email","pred_gmv"].includes(w)&&(m.get(0).focus({preventScrol:!0}),m.get(0).blur())})})},ie=e=>{let t=!1;var n=e.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),a=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");n?(t=!0,a.text(n),a.show()):a.hide();var r=e.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),f=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return r?(f.text(r),f.show(),t=!0):f.hide(),t};function j(e){D(e)}function L(){return new Promise(function(e){D=e})}var z=e=>{let t=$('[data-form="submit-btn"]'),n,a=()=>{t.addClass("disabled")},r=()=>{t.removeClass("disabled")};b(!0),a(),setTimeout(()=>{n=ie(e),r(),n?b(!1):e[0].submit()},3e3)};function b(e){let t=$(".n_demo-form_loading");e?(t.find('[data-animation-type="lottie"]').trigger("click"),t.fadeIn()):t.hide()}var D;function se(e,t){let n=e[0]||e.get(0);if(!n)return!1;let{parentNode:a}=n;return a?Array.from(a.children).some(r=>r!==n&&r.matches(t)):!1}$(document).ready(()=>{let e,t=F("userId");t||(t=P(),R("userId",t));function n(o){function i(){let{userAgent:S}=navigator,B=navigator.appName,{platform:Q}=navigator,{language:W}=navigator;return{userAgent:S,browser:B,platform:Q,language:W}}let g=i(),v=u.find($("input[name=first-name]")).val(),l=u.find($("input[name=last-name]")).val(),d=u.find($("input[name=name]")).val(),A=u.find($("input[name=cellphone]")).val(),x=u.find($("input[name=email]")).val(),k={displayName:v+" "+l,restaurantName:d,phone:A,email:x,firstName:v,lastName:l,...g};typeof FS!="undefined"&&FS&&FS.event(o,FS.identify(t,k))}function a(){typeof growsumo!="undefined"&&growsumo&&(growsumo.data.name=u.find('input[name="name"]').val(),growsumo.data.email=u.find('input[name="email"]').val(),growsumo.data.customer_key=u.find('input[name="email"]').val(),growsumo.createSignup())}let r=()=>F("restaurant");function f(){return new Promise((o,i)=>{try{e=!1,o()}catch(g){i(g)}})}function h(){let o=r(),i={name:o.name,address:o.formatted_address,website:o.website,email:"jonathan@owner.com",token:"AJXuyxPXgGF68NMv",sfdc_id:"None"},g;function v(l){return new Promise((d,A)=>{$.ajax({url:"https://owner-ops.net/business-info/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(l),timeout:15e3,success:function(x){d(x)},error:function(x,k,S){k==="timeout"?(console.log("Error occurred:",S),c("execution_time_seconds",15),c("gmv_pred",0),d("")):(console.log("Error occurred:",S),d(""))}})})}return v(i).then(l=>(console.log(l),l[0])).catch(l=>(console.error("Error:",l),!1))}function _(o,i){let g=$("#demo-form input"),v=["brizo_id","base_enrich_date","inbound_add_to_cadence","execution_time_seconds","auto_dq_flag","auto_dq_reason","gmv_pred","inbound_add_to_cadence"];i?g.each(function(){let l=$(this).attr("name");if(v.includes(l)&&o.hasOwnProperty(l)){var d=o[l];typeof d=="number"||!isNaN(d)&&!isNaN(parseFloat(d))?$(this).val(Number(d).toFixed(2)):$(this).val(d)}}):w(!1)}function y(){let o=!0;return u.find(":input:visible, select").each(function(){let i=T($(this));o=o&&i}),o}function w(o){c("base_enrich_date",new Date().toISOString().slice(0,10)),c("inbound_add_to_cadence","true"),o&&(c("execution_time_seconds",0),c("auto_dq_flags","true")),o===!0&&(c("auto_dq_reason","none"),c("auto_dq_flags","false"))}function m(){c("page_url",window.location.pathname),c("page_lang",$("html").attr("lang")),c("url",(()=>{var o=r(),i=o.url;return i.split("cid=")[1]})())}async function G(){if(y()){b(!0);try{if(await f(),typeof e!="boolean"){let i=await h();typeof i.auto_dq_flag=="string"?(e=i.auto_dq_flag!=="True",_(i,!0)):(e=!1,_(i,!1))}}catch(i){e=!1,console.log("Qualification check or call failed:",i)}m(),U(u,V,J),n("Form Button Clicked"),z(V)}}function H(){G()}let M=()=>{let o=$(".n_demo-form_success");b(!1),u.hide(),o.show(),window.location.href=e?"https://meetings.hubspot.com/brandon767/sales-inbound-round-robin":"https://www.owner.com/funnel-demo-requested"},u=$("#demo-form"),V;hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:j,onFormSubmit:function(){console.log("Submit"),a(),n("Form Submission Sent")},onFormSubmitted:()=>{a(),n("Form Submission Sent"),setTimeout(()=>{M()},200)}}),L().then(function(o){V=$(o)});let J={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",url:"place_cid",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total","number-of-locations":"of_locations_number",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download",page_lang:"page_lang",brizo_id:["brizo_id","0-2/brizo_id_account"],base_enrich_date:["auto_enrich_date","0-2/auto_enrich_date_company"],inbound_add_to_cadence:"inbound_add_to_cadence",execution_time_seconds:"auto_enrich_time",auto_dq_flag:"auto_dq_static",auto_dq_reason:["auto_dq_reason","0-2/auto_dq_reason_company"],gmv_pred:["pred_gmv","0-2/pred_gmv_company"]};$("[data-form=submit-btn]").on("click",H),$(".nice-select li").on("click",function(){$(".nice-select .current").css("color","white")}),$('select[name="person-type"]').on("change",function(){$(this).val()==="I'm a restaurant owner or manager"?$("#locations-wrap").show():$("#locations-wrap").hide()})});})();
