var TIER_MODE_NUM="num",TIER_MODE_S="s",TIERS={1:"S",2:"A",3:"B",4:"C",5:"D",6:"F"},timestampUpdateInterval=null;function addInputAntiSubmitHandler(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:":text";$(t).on("keypress keyup",function(t){if(13==t.which)return!1})}function addNestedDropdownSupport(){var t;$.fn.dropdown=(t=$.fn.dropdown,function(e){"string"==typeof e&&"toggle"===e&&($(".has-child-dropdown-show").removeClass("has-child-dropdown-show"),$(this).closest(".dropdown").parents(".dropdown").addClass("has-child-dropdown-show"));var n=t.call($(this),e);return $(this).off("click.bs.dropdown"),n}),$(function(){$('.dropdown [data-toggle="dropdown"]').on("click",function(t){$(this).dropdown("toggle"),t.stopPropagation()}),$(".dropdown").on("hide.bs.dropdown",function(t){$(this).is(".has-child-dropdown-show")&&($(this).removeClass("has-child-dropdown-show"),t.preventDefault()),t.stopPropagation()})})}function addNoteHandlers(){$(".js-show-note-edit").click(function(){$(".js-note-input").toggle()})}function addWishlistSortHandlers(){$(".js-sort-wishlists").click(function(){$(".js-wishlist-unsorted").toggle(),$(".js-wishlist-sorted").toggle()})}function cleanUrl(t,e,n){if(t){try{var a=decodeURIComponent(unescape(n)).replace(/[^\w:]/g,"").toLowerCase()}catch(t){return null}if(0===a.indexOf("javascript:")||0===a.indexOf("vbscript:")||0===a.indexOf("data:"))return null}e&&!originIndependentUrl.test(n)&&(n=resolveUrl(e,n));try{n=encodeURI(n).replace(/%25/g,"%")}catch(t){return null}return n}function decToHex(t){return parseInt(t).toString(16)}function getColorFromDec(t){if(t=parseInt(t))for(t=decToHex(t);t.length<6;)t="0"+t;else t="FFF";return"#"+t}function getItemTierLabel(t,e){return t.guild_tier?e==TIER_MODE_S?TIERS[t.guild_tier]:t.guild_tier:""}function makeWowheadLinks(){try{$WowheadPower.refreshLinks()}catch(t){console.log("Failed to refresh wowhead links.")}}function nl2br(t){return t?t.replace(/\n/g,"<br>"):""}function parseMarkdown(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=new marked.Renderer;e.link=function(t,e,n){var a="";return null===(t=cleanUrl(this.options.sanitize,this.options.baseUrl,t))?n:(a+='<a target="_blank" href="'+t+'"',e&&(a+=' title="'+e+'"'),a+=">"+n+"</a>")},t&&!t.hasClass("js-markdown-parsed")?(t.html(marked(t.html(),{renderer:e})),t.addClass("js-markdown-parsed")):($(".js-markdown").each(function(){$(this).hasClass("js-markdown-parsed")||($(this).html(marked($.trim($(this).text()),{renderer:e})),$(this).addClass("js-markdown-parsed"))}),$(".js-markdown-inline").each(function(){$(this).hasClass("js-markdown-parsed")||($(this).html(marked.parseInline($.trim($(this).text()),{renderer:e})),$(this).addClass("js-markdown-parsed"))}))}function rgbToHex(t){for(var e=Number(t).toString(16);e.length<6;)e="0"+e;return e}function slug(t){var e="-",n="àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;",a="aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------",r=new RegExp(n.split("").join("|"),"g"),o=t.toString().toLowerCase().replace(/\s+/g,"-").replace(r,function(t){return a.charAt(n.indexOf(t))}).replace(/&/g,"").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"").replace(/-+/g,"-").substr(0,50);return o||"-"}function trackTimestamps(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:15e3;$(".js-watchable-timestamp").each(function(){var t;$(this).data("isShort")&&moment.locale("en",{relativeTime:{past:"%s ago",s:"just now",ss:"%ss",m:"%dm",mm:"%dm",h:"%dh",hh:"%dh",d:"%dd",dd:"%dd",M:"%dmo",MM:"%dmo",y:"%dy",yy:"%dy"}});var e=$(this).data("timestamp");e<1e12&&(e*=1e3);var n=!1;e>Date.now()&&(n=!0);var a=null,r=$(this).data("maxDays");a=r&&e<moment().valueOf()-864e5*r?"over 2 weeks":moment.utc(e).fromNow(!0),$(this).is("abbr")?$(this).prop("title",(n?"in ":"")+a+(n?"":" ago")):$(this).html(a)}),$(".js-timestamp").each(function(){var t=$(this).data("timestamp");t<1e12&&(t*=1e3);var e=$(this).data("format")?$(this).data("format"):"dddd, MMMM Do YYYY, h:mm a",n=moment.utc(t).format(e);$(this).is("abbr")?$(this).prop("title",n):$(this).html(n)}),$(".js-timestamp-title").each(function(){var t=$(this).data("title"),e=$(this).data("timestamp");e<1e12&&(e*=1e3);var n=moment.utc(e).local().format("dddd, MMMM Do YYYY, h:mm a");t?$(this).prop("title",t+" "+n):$(this).prop("title",n)}),timestampUpdateInterval&&clearInterval(timestampUpdateInterval),timestampUpdateInterval=setInterval(function(){$(".js-watchable-timestamp").each(function(){var t=$(this).data("timestamp");t<1e12&&(t*=1e3);var e=!1;t>Date.now()&&(e=!0);var n=null,a=$(this).data("maxDays");n=a&&t<moment().valueOf()-864e5*a?"over 2 weeks":moment.utc(t).fromNow(!0),$(this).is("abbr")?$(this).prop("title",(e?"in ":"")+n+(e?"":" ago")):$(this).html(n)})},t)}function warnBeforeLeaving(t){$(t).one("change",function(){window.onbeforeunload=function(){return!0}}),$(t).one("submit",function(){window.onbeforeunload=function(){}})}$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),marked.setOptions({gfm:!0,breaks:!0}),$(document).ready(function(){addNestedDropdownSupport(),parseMarkdown(),makeWowheadLinks(),trackTimestamps(),addInputAntiSubmitHandler(),addNoteHandlers(),addWishlistSortHandlers(),$(".js-edit-content").click(function(t){t.preventDefault();var e=$(this).data("id");$(".js-content[data-id="+e+"]").toggle()})});
