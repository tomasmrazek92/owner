"use strict";(()=>{var y="restaurant";var p=()=>{let t=JSON.parse(localStorage.getItem(y)),e=["bar","cafe","bakery","food","restaurant"];for(let a=0;a<e.length;a++)if(t.types.includes(e[a]))return!0;return!1};var m=t=>{let e=t,a=!0;return $(e).prop("required")&&($(e).val()?$(e).is('[type="email"]')?a=b(e):$(e).attr("name")==="restaurant-name"?a=x(e):$(e).is("select")?a=I(e):a=V(e):a=S(e)),a?n($(e),!1):($(e).addClass("error"),console.log($(e)),console.log($(e).val())),a};function b(t){let a=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(t).val());return n($(t),!a,"Please fill correct email address."),a}function x(t){let e=!0;return e=w(t),e}var u=!1;function w(t){if(u)return u=!1,!0;let e=p();return e?n($(t),!1):n($(t),!0,"Are you sure this is correct? Please update your entry to a recognized restaurant."),u=!0,e}function I(t){let e,a=$(t).siblings(".select2"),r=$(t).siblings(".nice-select");a?e=a.find(".select2-selection--single"):r?e=$(r):e=$(t);let s=!0;return $(t).val()===""?(validArr.push(selectVal),$(e).addClass("is-invalid"),s=!1):$(e).removeClass("is-invalid"),s}function V(t){return n($(t),!1),!0}function S(t){return $(t).attr("name")==="restaurant-name"&&n($(t),!0,"Please select a business location from the search results."),n($(t),!0),!1}var n=(t,e,a)=>{let r=$(t).closest(".form-field-wrapper, [field-wrapper]").find(".field-validation, [field-validation]");$(t).closest(".form-field").toggleClass("error",e),r.toggle(e),a&&r.text(a)};var h=(t,s,a)=>{var r=$(t),s=$(s);console.log(s),Object.keys(a).forEach(function(o){var l=a[o],c=r.find('input[name="'+o.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]');c.length===0&&(c=r.find('select[name="'+o.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+'"]'));var f=c.val();Array.isArray(l)||(l=[l]),l.forEach(function(d){var i=s.find("input[name="+d.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")+"]");console.log(i),console.log(f),i.val(f),["phone","mobilephone","email"].includes(d)&&(i.get(0).focus(),i.get(0).blur())})})};function g(t){_(t)}function v(){return new Promise(function(t){_=t})}var _;$(document).ready(()=>{$(".nice-select li").on("click",function(){$(".nice-select .current").css("color","white")});let t=$("#demo-form"),e;hbspt.forms.create({portalId:"6449395",formId:"f3807262-aed3-4b9c-93a3-247ad4c55e60",target:"#hbst-form",onFormReady:g}),v().then(function(r){e=$(r)});let a={name:["company","0-2/name"],international_phone_number:["phone","0-2/phone"],"restaurant-address":["address","0-2/address"],locality:["city","0-2/city"],administrative_area_level_1:["state","0-2/state"],postal_code:["zip","0-2/zip"],country:["country","0-2/country"],"first-name":"firstname","last-name":"lastname",cellphone:"mobilephone",email:"email","person-type":"lead_person_type",website:"website",place_id:"place_id",place_types:["place_types_contact","0-2/place_types"],rating:"place_rating",user_ratings_total:"user_ratings_total",hear:"how_did_you_hear_about_us",page_url:"last_pdf_download"};$("[data-form=submit-btn]").on("click",function(r){let s=$(this);r.preventDefault();let o=!0;$(":input:visible, select").each(function(){let l=m($(this));o=o&&l}),o&&h(t,e,a),console.log(o)})});})();
