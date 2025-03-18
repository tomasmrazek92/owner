"use strict";(()=>{var U,te=new Uint8Array(16);function j(){if(!U&&(U=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!U))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return U(te)}var m=[];for(let e=0;e<256;++e)m.push((e+256).toString(16).slice(1));function L(e,t=0){return m[e[t+0]]+m[e[t+1]]+m[e[t+2]]+m[e[t+3]]+"-"+m[e[t+4]]+m[e[t+5]]+"-"+m[e[t+6]]+m[e[t+7]]+"-"+m[e[t+8]]+m[e[t+9]]+"-"+m[e[t+10]]+m[e[t+11]]+m[e[t+12]]+m[e[t+13]]+m[e[t+14]]+m[e[t+15]]}var ne=typeof crypto!="undefined"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),R={randomUUID:ne};function oe(e,t,n){if(R.randomUUID&&!t&&!e)return R.randomUUID();e=e||{};let r=e.random||(e.rng||j)();if(r[6]=r[6]&15|64,r[8]=r[8]&63|128,t){n=n||0;for(let i=0;i<16;++i)t[n+i]=r[i];return t}return L(r)}var T=oe;var d=(e,t)=>{let n=$(`input[name="${e}"]`);n.attr("type")==="checkbox"?n.prop("checked",t):n.val(t)},V=e=>$(`input[name="${e}"]`).val();var O=e=>{let t=localStorage.getItem(e);try{return JSON.parse(t)}catch{return t}},q=(e,t)=>{let n=typeof t=="object"?JSON.stringify(t):t;localStorage.setItem(e,n)};var z=!1,B=e=>{let t=JSON.parse(localStorage.getItem("restaurant"));if(console.log(t),t&&Array.isArray(t.types)){let n=["bar","cafe","bakery","food","restaurant"];return!t.types.some(i=>n.includes(i))&&!z?(x(e),z=!0,!1):!0}return!1};function re(e){let n=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test($(e).val());return x($(e),!n,"Please fill correct email address."),n}function ae(e){let t=!0;return t=se(e),t}function se(e){let t=B(e);return t?x($(e),!1):x($(e),!0),t}function ie(e){let t,n=$(e).siblings(".select2"),r=$(e).siblings(".nice-select");n?t=n.find(".select2-selection--single"):r?t=$(r):t=$(e);let i=!0;return $(e).val()===""?(validArr.push(selectVal),$(t).addClass("is-invalid"),i=!1):$(t).removeClass("is-invalid"),i}function le(e){return x($(e),!1),!0}function ce(e){return $(e).attr("name")==="restaurant-name"&&x($(e),!0,"Please select a business location from the search results."),x($(e),!0),!1}var D=e=>{let t=e,n=!0;return $(t).prop("required")&&($(t).val()?$(t).is('[type="email"]')?n=re(t):$(t).attr("name")==="restaurant-name"?n=ae(t):$(t).is("select")?n=ie(t):n=le(t):n=ce(t)),n?x($(t),!1):$(t).addClass("error"),n},x=(e,t,n)=>{let r=$(e).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(e).closest(".form-field, [form-field]").toggleClass("error",t),r.toggle(t),n&&r.text(n)};var J=(e,i,n)=>{var r=$(e),i=$(i);Object.keys(n).forEach(function(u){var S=n[u],f=r.find('input[name="'+u.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');f.length===0&&(f=r.find('select[name="'+u.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var w=f.val();Array.isArray(S)||(S=[S]),S.forEach(function(I){var _=i.find("input[name="+I.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");_.attr("type")==="checkbox"?String(w).toLowerCase()==="true"?_.prop("checked",!0):_.prop("checked",!1):de(_,".hs-datepicker")?_.siblings("input[readonly]").val(w).change():_.val(w),["phone","mobilephone","email","pred_gmv"].includes(I)&&(_.get(0).focus({preventScrol:!0}),_.get(0).blur())})})},ue=e=>{let t=!1;var n=e.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),r=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");n?(t=!0,r.text(n),r.show()):r.hide();var i=e.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),u=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return i?(u.text(i),u.show(),t=!0):u.hide(),t};function G(e){X(e)}function H(){return new Promise(function(e){X=e})}var Q=e=>{let t=$('[data-form="submit-btn"]'),n,r=()=>{t.addClass("disabled")},i=()=>{t.removeClass("disabled")};P(!0),r(),setTimeout(()=>{n=ue(e),i(),n?P(!1):e[0].submit()},3e3)};function P(e){let t=$("[form-loader]");e?(t.find('[data-animation-type="lottie"]').trigger("click"),t.fadeIn()):t.hide()}var X;function de(e,t){let n=e[0]||e.get(0);if(!n)return!1;let{parentNode:r}=n;return r?Array.from(r.children).some(i=>i!==n&&i.matches(t)):!1}function K(){let e=sessionStorage.getItem("utmParams");if(!e)return{};try{return JSON.parse(e)}catch(t){return console.error("Error parsing UTM params from sessionStorage:",t),{}}}function me(){if(!window.mixpanel||!window.mixpanel.__SV){var e=window.mixpanel=window.mixpanel||[];e._i=[],e.init=function(r,i,u){function S(y,h){var k=h.split(".");k.length==2&&(y=y[k[0]],h=k[1]),y[h]=function(){y.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var f=e;typeof u!="undefined"?f=e[u]=[]:u="mixpanel",f.people=f.people||[],f.toString=function(y){var h="mixpanel";return u!=="mixpanel"&&(h+="."+u),y||(h+=" (stub)"),h},f.people.toString=function(){return f.toString(1)+".people (stub)"};for(var w="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" "),I=0;I<w.length;I++)S(f,w[I]);var _="set set_once union unset remove delete".split(" ");f.get_group=function(){function y(v){h[v]=function(){call2_args=arguments,call2=[v].concat(Array.prototype.slice.call(call2_args,0)),f.push([k,call2])}}for(var h={},k=["get_group"].concat(Array.prototype.slice.call(arguments,0)),E=0;E<_.length;E++)y(_[E]);return h},e._i.push([r,i,u])},e.__SV=1.2;var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=typeof MIXPANEL_CUSTOM_LIB_URL!="undefined"?MIXPANEL_CUSTOM_LIB_URL:document.location.protocol==="file:"&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n)}}me();mixpanel.init("8e3c791cba0b20f2bc5aa67d9fb2732a",{record_sessions_percent:100,record_mask_text_selector:""});$(document).ready(()=>{let e,t=typeof scheduleFlow!="undefined"&&scheduleFlow,n=O("webUserId");n||(n=T(),q("webUserId",n)),window.webUserId=n;function r(o){function a(){let{userAgent:N}=navigator,Y=navigator.appName,{platform:Z}=navigator,{language:ee}=navigator;return{userAgent:N,browser:Y,platform:Z,language:ee}}let l=a(),p=v.find($("input[name=first-name]")).val(),c=v.find($("input[name=last-name]")).val(),s=v.find($("input[name=name]")).val(),g=v.find($("input[name=cellphone]")).val(),F=v.find($("input[name=email]")).val(),b={displayName:p+" "+c,restaurantName:s,phone:g,email:F,firstName:p,lastName:c,...l};typeof mixpanel!="undefined"&&mixpanel&&(mixpanel.identify(n),mixpanel.people.set({$first_name:p,$last_name:c,$email:F,$phone:g,restaurantName:s,...l}),mixpanel.track(o,b))}function i(){var o="db833abde57f505b06b0e4b2bfe5e24f",a="2226621",l=document.createElement("img");l.src="https://ct.capterra.com/capterra_tracker.gif?vid="+a+"&vkey="+o,document.body.appendChild(l)}typeof n!="undefined"&&n&&mixpanel.identify(n);let u=()=>O("restaurant");function S(){return new Promise((o,a)=>{try{if(t){let l=u();e=void 0;let p=$('select[name="person-type"]').val()==="I'm a restaurant owner or manager",c=l.address_components.some(s=>s.short_name==="US");(!p||!c)&&(r("Submission Disqualified"),e=!1)}else e=!1;o()}catch(l){a(l)}})}function f(){let o=u(),a={name:o.name,address:o.formatted_address,website:o.website,email:"jonathan@owner.com",token:"AJXuyxPXgGF68NMv",sfdc_id:"None"},l;function p(c){return new Promise((s,g)=>{$.ajax({url:"https://owner-ops.net/business-info/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(c),timeout:15e3,success:function(F){s(F)},error:function(F,b,N){b==="timeout"?(console.log("Error occurred:",N),d("execution_time_seconds",15),d("gmv_pred",0),s("")):(console.log("Error occurred:",N),s(""))}})})}return p(a).then(c=>(console.log(c),c[0])).catch(c=>(console.error("Error:",c),!1))}function w(o,a){console.log(o),console.log(a);let l=$("[demo-form] input"),p=["brizo_id","base_enrich_date","inbound_add_to_cadence","execution_time_seconds","auto_dq_flag","auto_dq_reason","gmv_pred"];a?l.each(function(){let c=$(this).attr("name");if(p.includes(c)&&o.hasOwnProperty(c)){var s=o[c];typeof s=="number"||!isNaN(s)&&!isNaN(parseFloat(s))?$(this).val(Number(s).toFixed(2)):$(this).val(s)}}):_(!1)}function I(){let o=!0;return v.find(":input:visible, select").each(function(){let a=D($(this));o=o&&a}),o}function _(o){console.log(o),d("base_enrich_date",new Date().toISOString().slice(0,10)),d("inbound_add_to_cadence","true"),o===!1&&(d("execution_time_seconds",0),d("auto_dq_flags","true")),o===!0&&(d("execution_time_seconds",0),d("auto_dq_reason","none"),d("auto_dq_flags","false"),d("self_service_scheduling_shown",!0))}function y(){d("page_url",t?"/demo-schedule":window.location.pathname),d("page_lang",$("html").attr("lang")),d("url",(()=>{var a=u();if(a&&a.url){var l=a.url;return l.split("cid=")[1]}return"none"})());function o(){let a=K();if(!a||Object.keys(a).length===0){console.log("No UTM parameters found in session storage");return}let l=$("input"),p={},c={};l.each(function(){let s=$(this).attr("name");if(s)if(s.startsWith("0-2/")){let g=s.substring(4);c[g]=$(this)}else p[s]=$(this)}),Object.keys(a).forEach(s=>{let g=a[s];g&&(p[s]&&(p[s].val(g),console.log(`Set regular input ${s} = ${g}`)),c[s]&&(c[s].val(g),console.log(`Set prefixed input 0-2/${s} = ${g}`)))})}o(),d("web_user_id",n)}async function h(){let o=I();if(console.log(o),o){P(!0);try{if(await S(),typeof e!="boolean"){let a=await f(),l=a.auto_dq_flag;d("self_service_enrichment_api_used",!0),typeof l=="string"?(e=a.auto_dq_flag!=="True",w(a,!0),e&&d("self_service_scheduling_shown",!0)):(e=!1,w(a,!1))}else _(e)}catch(a){e=!1,console.log("Qualification check or call failed:",a)}y(),J(v,A,W),r("Form Button Clicked"),Q(A)}}function k(){h()}let E=()=>{let o=$(".demo-form_success"),a=!window.location.href.includes("/blog/")&&!window.location.href.includes("/resources/")&&!window.location.href.includes("/downloads/"),l=v.attr("data-custom-redirect"),p=t&&e&&l==="";if(P(!1),v.hide(),p){let g=function(F){var b=$.extend({},c,F);$(b.selector).html('<div class="meetings-iframe-container" data-src="'+b.link+`?embed=true&firstName=${b.fName}&lastName=${b.lName}&email=${b.email}&company=${b.company}"></div>`),$.getScript("https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js").done(function(){o.show()})};var s=g,c={link:"https://meetings.hubspot.com/jonathan-shenkman/self-scheduling",selector:".demo-form_success",email:V("email"),fName:V("first-name"),lName:V("last-name"),company:V("name")};g()}l!==""?(o.show(),window.location.href=l):a&&!p?(o.show(),window.location.href="https://www.owner.com/funnel-demo-requested"):o.show()},v=$("[demo-form]"),A,C="f3807262-aed3-4b9c-93a3-247ad4c55e60",M=window.location.href;M.indexOf("/resources/")!==-1&&(C="66b9776c-c640-4b5a-8807-439a721001ff"),M.indexOf("refer")!==-1&&(C="969fbdc3-b662-4428-a208-c78b8f20efa6"),hbspt.forms.create({portalId:"6449395",formId:C,target:"#hbst-form",onFormReady:G,onFormSubmit:function(){console.log("Submit"),r("Form Submission Attempt")},onFormSubmitted:()=>{r("Form Submission Sent"),i(),setTimeout(()=>{E()},200)}}),H().then(function(o){A=$(o)});let W={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",url:"place_cid",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total","number-of-locations":"of_locations_number",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download",page_lang:"page_lang",brizo_id:["brizo_id","0-2/brizo_id_account"],base_enrich_date:["auto_enrich_date","0-2/auto_enrich_date_company"],inbound_add_to_cadence:"inbound_add_to_cadence",execution_time_seconds:"auto_enrich_time",auto_dq_flag:"auto_dq_static",auto_dq_reason:["auto_dq_reason","0-2/auto_dq_reason_company"],gmv_pred:["pred_gmv","0-2/pred_gmv_company"],referrer_s_phone_number:"referrer_s_phone_number"};$("[data-form=submit-btn]").on("click",k),$('select[name="person-type"]').on("change",function(){$(this).val()==="I'm a restaurant owner or manager"?$("#locations-wrap").show():$("#locations-wrap").hide()}),$("[data-cleave-phone]").each(function(){new Cleave($(this),{numericOnly:!0,blocks:[0,3,3,4,10],delimiters:["(",") ","-"],delimiterLazyShow:!0})})});})();
