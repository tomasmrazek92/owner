"use strict";(()=>{var d=(t,e)=>{console.log(e),$(`input[name=${t}]`).val(e)};var p=t=>{let e=localStorage.getItem(t);try{return JSON.parse(e)}catch{return e}};var x="restaurant";var h=()=>{let t=JSON.parse(localStorage.getItem(x)),e=["bar","cafe","bakery","food","restaurant"];for(let a=0;a<e.length;a++)if(t.types.includes(e[a]))return!0;return!1};function I(t){let a=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(t).val());return i($(t),!a,"Please fill correct email address."),a}function S(t){let e=!0;return e=V(t),e}var f=!1;function V(t){if(f)return f=!1,!0;let e=h();return e?i($(t),!1):i($(t),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),f=!0,e}function F(t){let e,a=$(t).siblings(".select2"),o=$(t).siblings(".nice-select");a?e=a.find(".select2-selection--single"):o?e=$(o):e=$(t);let r=!0;return $(t).val()===""?(validArr.push(selectVal),$(e).addClass("is-invalid"),r=!1):$(e).removeClass("is-invalid"),r}function k(t){return i($(t),!1),!0}function E(t){return $(t).attr("name")==="restaurant-name"&&i($(t),!0,"Please select a business location from the search results."),i($(t),!0),!1}var g=t=>{let e=t,a=!0;return $(e).prop("required")&&($(e).val()?$(e).is('[type="email"]')?a=I(e):$(e).attr("name")==="restaurant-name"?a=S(e):$(e).is("select")?a=F(e):a=k(e):a=E(e)),a?i($(e),!1):$(e).addClass("error"),a},i=(t,e,a)=>{let o=$(t).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(t).closest(".form-field, [form-field]").toggleClass("error",e),o.toggle(e),a&&o.text(a)};var v=(t,r,a)=>{var o=$(t),r=$(r);Object.keys(a).forEach(function(n){var s=a[n],l=o.find('input[name="'+n.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');l.length===0&&(l=o.find('select[name="'+n.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var c=l.val();Array.isArray(s)||(s=[s]),s.forEach(function(m){var u=r.find("input[name="+m.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");u.val(c),["phone","mobilephone","email"].includes(m)&&(u.get(0).focus(),u.get(0).blur())})})},P=t=>{let e=!1;var a=t.find("input[name=mobilephone]").parent().siblings(".hs-error-msgs").find(".hs-error-msg").text(),o=$('input[name="cellphone"]').closest("[field-wrapper]").find("[field-validation]");a?(e=!0,o.text(a),o.show()):o.hide();var r=t.find("input[name=email]").closest(".hs-fieldtype-text").find(".hs-error-msgs").find(".hs-error-msg").text(),n=$('input[name="email"]').closest("[field-wrapper]").find("[field-validation]");return r?(n.text(r),n.show(),e=!0):n.hide(),e};function b(t){w(t)}function _(){return new Promise(function(t){w=t})}var y=t=>{let e=$('[data-form="submit-btn"]'),a=e.text(),o,r=0,n=[".","..","..."],s=()=>{let u=`Submitting${n[r]}`;e.text(u),r=(r+1)%n.length},l=()=>{e.addClass("disabled")},c=()=>{e.removeClass("disabled").text(a)};l();let m=setInterval(s,500);setTimeout(()=>{o=P(t),clearInterval(m),c(),o||t.find("input[type=submit]").trigger("click")},3e3)},w;$(document).ready(()=>{$(".nice-select li").on("click",function(){$(".nice-select .current").css("color","white")});let t=$("#demo-form"),e,a=()=>{window.location.href="https://www.owner.com/funnel-demo-requested"};hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:b,onFormSubmitted:a}),_().then(function(r){e=$(r)});let o={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",url:"place_cid",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total","number-of-locations":"of_locations_number",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download",page_lang:"page_lang"};$("[data-form=submit-btn]").on("click",function(r){let n=$(this);r.preventDefault();let s=!0;t.find(":input:visible, select").each(function(){let l=g($(this));s=s&&l}),s&&(d("page_url",window.location.pathname),d("page_lang",$("html").attr("lang")),d("url",(()=>{var l=p("restaurant"),c=l.url;return console.log(c),c.split("cid=")[1]})()),v(t,e,o),y(e))}),$('select[name="person-type"]').on("change",function(){$(this).val()==="I'm a restaurant owner or manager"?$("#locations-wrap").show():$("#locations-wrap").hide()})});})();
