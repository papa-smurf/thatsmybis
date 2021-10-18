var TIER_MODE_NUM="num",TIER_MODE_S="s",TIERS={1:"S",2:"A",3:"B",4:"C",5:"D",6:"F"},SLOT_MISC=0,SLOT_HEAD=1,SLOT_NECK=2,SLOT_SHOULDERS=3,SLOT_SHIRT=4,SLOT_CHEST_1=5,SLOT_WAIST=6,SLOT_LEGS=7,SLOT_FEET=8,SLOT_WRIST=9,SLOT_HANDS=10,SLOT_FINGER=11,SLOT_TRINKET=12,SLOT_WEAPON_MAIN_HAND=13,SLOT_SHIELD=14,SLOT_RANGED_1=15,SLOT_BACK=16,SLOT_WEAPON_TWO_HAND=17,SLOT_BAG=18,SLOT_CHEST_2=20,SLOT_WEAPON_ONE_HAND=21,SLOT_WEAPON_OFF_HAND=22,SLOT_OFFHAND=23,SLOT_AMMO=24,SLOT_THROWN=25,SLOT_RANGED_2=26,SLOT_RELIC=28,timestampCheckRate=3e4,timestampUpdateInterval=null;function addDateInputHandlers(){$(".js-date-input").change(function(){var t=$(this).prev(".js-date");$(this).val()?t.val(moment($(this).val()).utc().format("YYYY-MM-DD HH:mm:ss")):(t.val(date),$(this).val(moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss")))})}function addInputAntiSubmitHandler(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:":text";$(t).on("keypress keyup",function(t){if(13==t.which)return!1})}function addNestedDropdownSupport(){var t;$.fn.dropdown=(t=$.fn.dropdown,function(e){"string"==typeof e&&"toggle"===e&&($(".has-child-dropdown-show").removeClass("has-child-dropdown-show"),$(this).closest(".dropdown").parents(".dropdown").addClass("has-child-dropdown-show"));var a=t.call($(this),e);return $(this).off("click.bs.dropdown"),a}),$(function(){$('.dropdown [data-toggle="dropdown"]').on("click",function(t){$(this).dropdown("toggle"),t.stopPropagation()}),$(".dropdown").on("hide.bs.dropdown",function(t){$(this).is(".has-child-dropdown-show")&&($(this).removeClass("has-child-dropdown-show"),t.preventDefault()),t.stopPropagation()})})}function addNoteHandlers(){$(".js-show-note-edit").click(function(){$(".js-note-input").toggle()})}function addSortHandlers(){$(".js-sortable").sortable({handle:".js-sort-handle"}),$(".js-sortable-lazy").one("mouseenter",function(){$(this).sortable({handle:".js-sort-handle"})})}function addTooltips(){$("span").tooltip(),$("abbr").tooltip(),$("a").tooltip()}function addWishlistSortHandlers(){$(".js-sort-wishlists").click(function(){$(".js-wishlist-unsorted").toggle(),$(".js-wishlist-sorted").toggle()})}function configureMoment(){moment.relativeTimeThreshold("ss",40),moment.relativeTimeThreshold("s",60),moment.relativeTimeThreshold("m",60),moment.relativeTimeThreshold("h",49),moment.relativeTimeThreshold("d",93),moment.relativeTimeThreshold("M",25),moment.relativeTimeRounding(Math.floor)}function cleanUrl(t,e,a){if(t){try{var n=decodeURIComponent(unescape(a)).replace(/[^\w:]/g,"").toLowerCase()}catch(t){return null}if(0===n.indexOf("javascript:")||0===n.indexOf("vbscript:")||0===n.indexOf("data:"))return null}e&&!originIndependentUrl.test(a)&&(a=resolveUrl(e,a));try{a=encodeURI(a).replace(/%25/g,"%")}catch(t){return null}return a}function decToHex(t){return parseInt(t).toString(16)}function flashElement(t){t.fadeTo(100,.3,function(){$(this).fadeTo(500,1)})}function getAttendanceColor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e="";return e=t>=.95?"text-tier-1":t>=.9?"text-tier-2":t>=.8?"text-tier-3":t>=.7?"text-tier-4":"text-tier-5"}function getColorFromDec(t){if(t=parseInt(t))for(t=decToHex(t);t.length<6;)t="0"+t;else t="FFF";return"#"+t}function getItemTierLabel(t,e){return t.guild_tier?e==TIER_MODE_S?numToSTier(t.guild_tier):t.guild_tier:""}function makeWowheadLinks(){try{$WowheadPower.refreshLinks()}catch(t){console.log("Failed to refresh wowhead links.")}}function nl2br(t){return t?t.replace(/\n/g,"<br>"):""}function numToSTier(t){return t>0?(tiers=TIERS,whole=Math.floor(t),decimal=t-whole,affix="",decimal>.66?affix="++":decimal>.33&&(affix="+"),tiers[Math.ceil(t)]+affix):""}function parseMarkdown(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=new marked.Renderer;e.link=function(t,e,a){var n="";return null===(t=cleanUrl(this.options.sanitize,this.options.baseUrl,t))?a:(n+='<a target="_blank" href="'+t+'"',e&&(n+=' title="'+e+'"'),n+=">"+a+"</a>")},t&&!t.hasClass("js-markdown-parsed")?(t.html(marked(DOMPurify.sanitize(t.html()),{renderer:e})),t.addClass("js-markdown-parsed")):($(".js-markdown").each(function(){if(!$(this).hasClass("js-markdown-parsed")){var t=DOMPurify.sanitize($.trim($(this).text()));$(this).html(marked(t),{renderer:e}),$(this).addClass("js-markdown-parsed")}}),$(".js-markdown-inline").each(function(){if(!$(this).hasClass("js-markdown-parsed")){var t=DOMPurify.sanitize($.trim($(this).text()));$(this).html(marked.parseInline(t),{renderer:e}),$(this).addClass("js-markdown-parsed")}}))}function rgbToHex(t){for(var e=Number(t).toString(16);e.length<6;)e="0"+e;return e}function slug(t){var e="-",a="àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;",n="aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------",o=new RegExp(a.split("").join("|"),"g"),r=t.toString().toLowerCase().replace(/\s+/g,"-").replace(o,function(t){return n.charAt(a.indexOf(t))}).replace(/&/g,"").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"").replace(/-+/g,"-").substr(0,50);return r||"-"}function trackTimestamps(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:timestampCheckRate;$(".js-watchable-timestamp").each(function(){var t=$(this).data("isShort");locale&&moment.locale(locale),!t||locale&&"en"!==locale||moment.locale("en",{relativeTime:{past:"%s ago",s:"just now",ss:"%ss",m:"%dm",mm:"%dm",h:"%dh",hh:"%dh",d:"%dd",dd:"%dd",M:"%dmo",MM:"%dmo",y:"%dy",yy:"%dy"}});var e=$(this).data("timestamp");e<1e12&&(e*=1e3);var a=!1;e>Date.now()&&(a=!0);var n=null,o=$(this).data("maxDays");n=o&&e<moment().valueOf()-864e5*o?"over 2 weeks":moment.utc(e).fromNow(!0),$(this).is("abbr")?$(this).prop("title",(a?"in ":"")+n+(a?"":" ago")):$(this).html(n)}),$(".js-timestamp").each(function(){var t=$(this).data("timestamp");t<1e12&&(t*=1e3);var e=$(this).data("format")?$(this).data("format"):"ddd, MMM Do YYYY @ h:mm a",a=moment.utc(t).local().format(e);$(this).is("abbr")?$(this).prop("title",a):$(this).html(a)}),$(".js-timestamp-title").each(function(){var t=$(this).data("title"),e=$(this).data("timestamp");e<1e12&&(e*=1e3);var a=moment.utc(e).local().format("ddd, MMM Do YYYY @ h:mm a");t?$(this).prop("title",t+" "+a):$(this).prop("title",a)}),timestampUpdateInterval&&clearInterval(timestampUpdateInterval),timestampUpdateInterval=setInterval(function(){$(".js-watchable-timestamp").each(function(){var t=$(this).data("timestamp");t<1e12&&(t*=1e3);var e=!1;t>Date.now()&&(e=!0);var a=null,n=$(this).data("maxDays");a=n&&t<moment().valueOf()-864e5*n?"over 2 weeks":moment.utc(t).fromNow(!0),$(this).is("abbr")?$(this).prop("title",(e?"in ":"")+a+(e?"":" ago")):$(this).html(a)})},t)}function warnBeforeLeaving(t){$(t).one("change",function(){window.onbeforeunload=function(){return!0}}),$(t).one("submit",function(){window.onbeforeunload=function(){}})}$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),marked.setOptions({gfm:!0,breaks:!0}),configureMoment(),$(document).ready(function(){addNestedDropdownSupport(),parseMarkdown(),makeWowheadLinks(),trackTimestamps(),addDateInputHandlers(),addInputAntiSubmitHandler(),addNoteHandlers(),addWishlistSortHandlers(),$(".js-edit-content").click(function(t){t.preventDefault();var e=$(this).data("id");$(".js-content[data-id="+e+"]").toggle()}),addTooltips()});
