function _readOnlyError(e){throw new Error('"'+e+'" is read-only')}var table=null,VIEW_PRIOS="prios",VIEW_RECEIVED="received",VIEW_SLOTS="slots",VIEW_WISHLIST="wishlist",view="",colCharacter=0,colArchetype=1,colAttendance=2,colMainRaidGroup=3,colNotes=4,colClass=5,colSlotTotal=10,colSlotHead=11,colSlotNeck=12,colSlotShoulder=13,colSlotBack=14,colSlotChest=15,colSlotWrists=16,colSlotHands=17,colSlotWaist=18,colSlotLegs=19,colSlotFeet=20,colSlotFinger=21,colSlotTrinket=22,colSlotWeapon=23,colSlotOffhand=24,colSlotRanged=25,colSlotOther=26,colInstanceTotal=27,colInstance1=28,colInstance2=29,colInstance3=30,colInstance4=31,colInstance5=32,colInstance6=33,colInstance7=34,colInstance8=35,colInstance9=36,colInstance10=37,colInstance11=38,colInstance12=39,colInstance13=40,colInstance14=41,colInstance15=42,colInstance16=43,colInstance17=44,colInstance18=45,colInstance19=46,colInstance20=47,colInstance21=48,colInstance22=49,colInstance23=50,colInstance24=51,colInstance25=52,colInstance26=53,colInstance27=54,colInstance28=55,colInstance29=56,colInstance30=57,allItemsVisible=!1,offspecVisible=!0,strikethroughVisible=!0,rosterHandlersTimeout=null;function createRosterStatsTable(){$.fn.DataTable.isDataTable("#characterStatsTable")&&$("#characterStatsTable").destroy();var e=[{title:'<span class="fas fa-fw fa-user"></span> '.concat(headerCharacter,' <span class="text-muted small">(').concat(characters.length,")</span>"),data:"name",render:{_:function _(e,t,n){return'<ul class="no-bullet no-indent">\n                        <li>\n                            <div class="dropdown text-'.concat(n.class?slug(n.class):"",'">\n                                <a class="dropdown-toggle font-weight-bold text-').concat(n.class?slug(n.class):"",'"\n                                    id="character').concat(n.id,'Dropdown"\n                                    role="button"\n                                    data-toggle="dropdown"\n                                    aria-haspopup="true"\n                                    aria-expanded="false"\n                                    title="').concat(n.username?n.username:"",'">\n                                    ').concat(n.name,'\n                                </a>\n                                <div class="dropdown-menu" aria-labelledby="character').concat(n.id,'Dropdown">\n                                    <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/c/").concat(n.id,"/").concat(n.slug,'">Profile</a>\n                                    <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/audit-log?character_id=").concat(n.id,'">History</a>\n                                    ').concat(showEdit?'<a class="dropdown-item" href="/'.concat(guild.id,"/").concat(guild.slug,"/c/").concat(n.id,"/").concat(n.slug,'/edit">Edit</a>\n                                        <a class="dropdown-item" href="/').concat(guild.id,"/").concat(guild.slug,"/c/").concat(n.id,"/").concat(n.slug,'/loot">Wishlist & Loot</a>'):"","\n                                    ").concat(n.member_id?'<a class="dropdown-item" href="/'.concat(guild.id,"/").concat(guild.slug,"/u/").concat(n.member_id,"/").concat(n.username?n.username.toLowerCase():"view member",'">').concat(n.username?n.username:"view member","</a>"):"","\n                                </div>\n                            </div>\n                        </li>\n                        ").concat(n.spec||n.display_spec||n.archetype?'<li class="small font-weight-light">\n                                <span class="'.concat(n.archetype?getArchetypeIcon(n.archetype):"",'"></span>\n                                <span class="">\n                                    ').concat(n.spec_label?n.spec_label:n.spec?n.display_spec:"","\n                                </span>\n                            </li>"):"","\n                        ").concat(n.raid_group_name?"<li>".concat(getRaidGroupHtml(n.raid_group_name,n.raid_group_color),"</li>"):"","\n                    </ul>")},sort:function sort(e,t,n){return e}},visible:!0,width:"50px",className:"width-50 fixed-width"},{title:"Role",data:"character",render:function render(e,t,n){return"".concat(n.archetype?n.archetype:""," ").concat(n.sub_archetype?n.sub_archetype:"")},visible:!0,width:"20px",className:"width-20 fixed-width"},{title:"Att.",data:"raid_count",render:{_:function _(e,t,n){return!guild.is_attendance_hidden&&(n.attendance_percentage||n.raid_count||n.benched_count)?'<ul class="list-inline small">\n                                '.concat(n.raid_count&&"number"==typeof n.attendance_percentage?'<li class="list-inline-item mr-0 '.concat(getAttendanceColor(n.attendance_percentage),'" title="attendance">').concat(Math.round(100*n.attendance_percentage),"%</li>"):"","\n                                ").concat(n.raid_count?'<li class="list-inline-item text-muted mr-0">'.concat(n.raid_count,"r</li>"):"","\n                                ").concat(n.benched_count?'<li class="list-inline-item text-muted mr-0">bench '.concat(n.benched_count,"x</li>"):"","\n                            </ul>"):""},sort:function sort(e,t,n){return e}},visible:!0,width:"10px",className:"width-10 fixed-width",type:"num"},{title:"Raid",data:"character",render:function render(e,t,n){if(n.raid_group_name||n.secondary_raid_groups&&n.secondary_raid_groups.length){var l="";return n.secondary_raid_groups&&n.secondary_raid_groups.length&&(l='<ul class="list-inline">',n.secondary_raid_groups.forEach(function(e,t){l+="".concat(e.id,' <li class="list-inline-item small"><span class="text-muted"><span class="role-circle align-fix" style="background-color:').concat(getColorFromDec(parseInt(e.color)),'"></span>').concat(e.name,"</span></li>")}),l+="</ul>"),n.raid_group_id+getRaidGroupHtml(n.raid_group_name,n.raid_group_color)+l}return""},visible:!1,width:"50px",className:"width-50 fixed-width"},{title:'<span class="fas fa-fw fa-comment-alt-lines"></span> '.concat(headerNotes),data:"notes",render:function render(e,t,n){return getNotes(e,t,n)},orderable:!1,visible:!1,width:"100px",className:"width-100 fixed-width"},{title:"Class",data:"class",render:function render(e,t,n){return n.class?n.class:null},visible:!1},{title:"Username",data:"username",render:function render(e,t,n){return n.username?n.username:null},visible:!1},{title:"Discord Username",data:"discord_username",render:function render(e,t,n){return n.discord_username?n.discord_username:null},visible:!1},{title:"Raids Attended",data:"raid_count",render:function render(e,t,n){return n.raid_count?n.raid_count:null},visible:!1,searchable:!1},{title:"Benched Count",data:"benched_count",render:function render(e,t,n){return n.benched_count?n.benched_count:null},visible:!1,searchable:!1}],t=!1;return view===VIEW_SLOTS&&(t=!0),e.push(createItemSlotColumn("Total",null,t),createItemSlotColumn("Head",[SLOT_HEAD],t),createItemSlotColumn("Neck",[SLOT_NECK],t),createItemSlotColumn("Shoulders",[SLOT_SHOULDERS],t),createItemSlotColumn("Back",[SLOT_BACK],t),createItemSlotColumn("Chest",[SLOT_CHEST_1,SLOT_CHEST_2],t),createItemSlotColumn("Wrist",[SLOT_WRIST],t),createItemSlotColumn("Waist",[SLOT_WAIST],t),createItemSlotColumn("Hands",[SLOT_HANDS],t),createItemSlotColumn("Legs",[SLOT_LEGS],t),createItemSlotColumn("Feet",[SLOT_FEET],t),createItemSlotColumn("Finger",[SLOT_FINGER],t),createItemSlotColumn("Trinket",[SLOT_TRINKET],t),createItemSlotColumn("Weapon",[SLOT_WEAPON_MAIN_HAND,SLOT_WEAPON_TWO_HAND,SLOT_WEAPON_ONE_HAND,SLOT_WEAPON_OFF_HAND],t),createItemSlotColumn("Offhand",[SLOT_SHIELD,SLOT_OFFHAND],t),createItemSlotColumn("Ranged /Relic",[SLOT_RANGED_1,SLOT_RANGED_2,SLOT_THROWN,SLOT_RELIC],t),createItemSlotColumn("Misc",[SLOT_MISC,SLOT_SHIRT,SLOT_BAG,SLOT_AMMO],t)),t=!![VIEW_PRIOS,VIEW_RECEIVED,VIEW_WISHLIST].includes(view),e.push(createInstanceTotalsColumn(t)),guild&&1===guild.expansion_id?e.push(createInstanceColumn("MC",1,t),createInstanceColumn("Ony",2,t),createInstanceColumn("BWL",3,t),createInstanceColumn("ZG",4,t),createInstanceColumn("AQ20",5,t),createInstanceColumn("AQ40",6,t),createInstanceColumn("Naxx",7,t),createInstanceColumn("World Bosses",8,t),createInstanceColumn("Other",null,t)):guild&&2===guild.expansion_id?e.push(createInstanceColumn("Kara",9,t),createInstanceColumn("Gruul",10,t),createInstanceColumn("Mag",11,t),createInstanceColumn("SSC",12,t),createInstanceColumn("Hyjal",13,t),createInstanceColumn("TK",14,t),createInstanceColumn("BT",15,t),createInstanceColumn("ZA",16,t),createInstanceColumn("Sunwell",17,t),createInstanceColumn("World Bosses",18,t),createInstanceColumn("Other",null,t)):guild&&3===guild.expansion_id&&(createInstanceColumn("Naxx N10",19,t),createInstanceColumn("Naxx N25",20,t),createInstanceColumn("EoE N10",21,t),createInstanceColumn("EoE N25",22,t),createInstanceColumn("OS N10",23,t),createInstanceColumn("OS N25",24,t),createInstanceColumn("Arch N10",25,t),createInstanceColumn("Arch N25",26,t),createInstanceColumn("Uld N10",27,t),createInstanceColumn("Uld N25",28,t),createInstanceColumn("TotC N10",29,t),createInstanceColumn("TotC N25",30,t),createInstanceColumn("TotC H10",31,t),createInstanceColumn("TotC H25",32,t),createInstanceColumn("Ony N10",33,t),createInstanceColumn("Ony N25",34,t),createInstanceColumn("ICC N10",35,t),createInstanceColumn("ICC N25",36,t),createInstanceColumn("ICC H10",37,t),createInstanceColumn("ICC H25",38,t),createInstanceColumn("RS N10",39,t),createInstanceColumn("RS N25",40,t),createInstanceColumn("RS H10",41,t),createInstanceColumn("RS H25",42,t),createInstanceColumn("Other",null,t)),rosterStatsTable=$("#characterStatsTable").DataTable({autoWidth:!1,data:characters,oLanguage:{sSearch:"<abbr title='Fuzzy searching is ON. To search exact text, wrap your search in \"quotes\"'>Search</abbr>"},columns:e,order:[],paging:!1,fixedHeader:!0,drawCallback:function drawCallback(){callRosterStatHandlers()},initComplete:function initComplete(){var e=[colClass,colArchetype,colMainRaidGroup];this.api().columns().every(function(t){var n=this,l=null,i=null;t==colArchetype?(l=$("#archetype_filter"),i=null):t==colClass?(l=$("#class_filter"),i=null):t==colMainRaidGroup&&(l=$("#raid_group_filter"),i=null),e.includes(t)&&(l.on("change",function(){var e=$.fn.dataTable.util.escapeRegex($(this).val());i&&i.val()&&(_readOnlyError("val"),e="(?=.*"+e+")(?=.*"+$.fn.dataTable.util.escapeRegex(i.val())+")"),n.search(e||"",!0,!1).draw()}).change(),i&&i.on("change",function(){var e=$.fn.dataTable.util.escapeRegex($(this).val());l&&l.val()&&(_readOnlyError("val"),e="(?=.*"+e+")(?=.*"+$.fn.dataTable.util.escapeRegex(l.val())+")"),n.search(e||"",!0,!1).draw()}).change())}),callRosterStatHandlers()}}),rosterStatsTable}function addInstanceFilterHandlers(){$("#instance_filter").change(function(){var e=$("#instance_filter").val();if(e.length){$("li.js-has-instance").hide();var t="";e.forEach(function(e){t+="li.js-has-instance[data-instance-id='"+e+"'],"}),t=t.replace(/(^,)|(,$)/g,""),$(t).show()}else $("li.js-has-instance").show()})}function getAverageTier(e,t){var n=e.filter(function(e){return e.guild_tier}),l,i;return getTierHtml({guild_tier:n.reduce(function(e,t){return t.guild_tier+e},0)/n.length},t)}function createInstanceColumn(e,t,n){return{className:"width-50 fixed-width pt-0 pl-0 pb-0 pr-1",title:e,data:"name",render:{_:function _(e,n,l){var i="",a=l.prios?l.prios.filter(function(e){return e.instance_id===t}):[],s=a.filter(function(e){return e.is_offspec}).length;a&&a.length?i+='<div class="js-prio-items">\n                            <ul class="list-inline mb-0">\n                                <li class="list-inline-item mr-1 font-weight-bold">'.concat(a.length,"</li>\n                                ").concat(guild.tier_mode?'<li class="list-inline-item mr-1">'.concat(getAverageTier(a,!1),"</li>"):"","\n                                ").concat(s?'<li class="list-inline-item small mr-1 text-muted">'.concat(s,"os</li>"):"","\n                                ").concat(a.length?'<li class="list-inline-item">'.concat(getItemListHtml(a,"prio",l.id,!1,!1),"</li>"):"","\n                            </ul>\n                        </div>"):i+='<div class="js-prio-items text-muted">—</div>';var c=l.received?l.received.filter(function(e){return e.instance_id===t}):[],o=c.filter(function(e){return e.is_offspec}).length;c&&c.length?i+='<div class="js-received-items">\n                            <ul class="list-inline mb-0">\n                                <li class="list-inline-item mr-1 font-weight-bold">'.concat(c.length,"</li>\n                                ").concat(guild.tier_mode?'<li class="list-inline-item mr-1">'.concat(getAverageTier(c,!1),"</li>"):"","\n                                ").concat(o?'<li class="list-inline-item mr-1 small text-muted">'.concat(o,"os</li>"):"","\n                                ").concat(c.length?'<li class="list-inline-item">'.concat(getItemListHtml(c,"received",l.id,!1,!1),"</li>"):"","\n                            </ul>\n                        </div>"):i+='<div class="js-received-items text-muted">—</div>';var r=l.all_wishlists?l.all_wishlists.filter(function(e){return e.instance_id===t&&e.list_number===guild.current_wishlist_number}):[],d=r.filter(function(e){return e.is_offspec}).length;return r&&r.length?i+='<div class="js-wishlist-items">\n                            <ul class="list-inline mb-0">\n                                <li class="list-inline-item mr-1 font-weight-bold">'.concat(r.length,"</li>\n                                ").concat(guild.tier_mode?'<li class="list-inline-item mr-1">'.concat(getAverageTier(r,!1),"</li>"):"","\n                                ").concat(d?'<li class="list-inline-item mr-1 small text-muted">'.concat(d,"os</li>"):"","\n                                ").concat(r.length?'<li class="list-inline-item">'.concat(getItemListHtml(r,"prio",l.id,!1,!1),"</li>"):"","\n                            </ul>\n                        </div>"):i+='<div class="js-wishlist-items text-muted">—</div>',i},sort:function sort(e,n,l){var i=[];return view===VIEW_PRIOS?i=l.prios?l.prios.filter(function(e){return e.instance_id===t}):[]:view===VIEW_RECEIVED?i=l.received?l.received.filter(function(e){return e.instance_id===t}):[]:view===VIEW_WISHLIST&&(i=l.all_wishlists?l.all_wishlists.filter(function(e){return e.instance_id===t&&e.list_number===guild.current_wishlist_number}):[]),i.length}},orderable:!0,visible:n,searchable:!0,type:"num"}}function createInstanceTotalsColumn(e){return{className:"width-50 fixed-width pt-0 pl-0 pb-0 pr-1",title:"Total",data:"name",render:{_:function _(e,t,n){var l="",i=n.prios?n.prios:[],a=i.filter(function(e){return e.is_offspec}).length;i&&i.length?l+='<div class="js-prio-items">\n                            <ul class="list-inline mb-0">\n                                <li class="list-inline-item mr-1 font-weight-bold">'.concat(i.length,"</li>\n                                ").concat(guild.tier_mode?'<li class="list-inline-item mr-1">'.concat(getAverageTier(i,!1),"</li>"):"","\n                                ").concat(a?'<li class="list-inline-item small mr-1 text-muted">'.concat(a,"os</li>"):"","\n                            </ul>\n                        </div>"):l+='<div class="js-prio-items text-muted">—</div>';var s=n.received?n.received:[],c=s.filter(function(e){return e.is_offspec}).length;s&&s.length?l+='<div class="js-received-items">\n                            <ul class="list-inline mb-0">\n                                <li class="list-inline-item mr-1 font-weight-bold">'.concat(s.length,"</li>\n                                ").concat(guild.tier_mode?'<li class="list-inline-item mr-1">'.concat(getAverageTier(s,!1),"</li>"):"","\n                                ").concat(c?'<li class="list-inline-item mr-1 small text-muted">'.concat(c,"os</li>"):"","\n                            </ul>\n                        </div>"):l+='<div class="js-received-items text-muted">—</div>';var o=n.all_wishlists?n.all_wishlists.filter(function(e){return e.list_number===guild.current_wishlist_number}):[],r=o.filter(function(e){return e.is_offspec}).length;return o&&o.length?l+='<div class="js-wishlist-items">\n                            <ul class="list-inline mb-0">\n                                <li class="list-inline-item mr-1 font-weight-bold">'.concat(o.length,"</li>\n                                ").concat(guild.tier_mode?'<li class="list-inline-item mr-1">'.concat(getAverageTier(o,!1),"</li>"):"","\n                                ").concat(r?'<li class="list-inline-item mr-1 small text-muted">'.concat(r,"os</li>"):"","\n                            </ul>\n                        </div>"):l+='<div class="js-wishlist-items text-muted">—</div>',l},sort:function sort(e,t,n){var l=[];return view===VIEW_PRIOS?l=n.prios?n.prios:[]:view===VIEW_RECEIVED?l=n.received?n.received:[]:view===VIEW_WISHLIST&&(l=n.all_wishlists?n.all_wishlists.filter(function(e){return e.list_number===guild.current_wishlist_number}):[]),l.length}},orderable:!0,visible:e,searchable:!0,type:"num"}}function createItemSlotColumn(e,t){return{className:"width-50 fixed-width pt-0 pl-0 pb-0 pr-1",title:e,data:"received",render:{_:function _(e,n,l){var i=t?e.filter(function(e){return t.includes(e.inventory_type)}):e,a=i.filter(function(e){return e.is_offspec}).length;return i&&i.length?'<div class="ml-1">\n                            <ul class="list-inline mb-0">\n                                <li class="list-inline-item mr-1 font-weight-bold">'.concat(i.length,"</li>\n                                ").concat(guild.tier_mode?'<li class="list-inline-item mr-1">'.concat(getAverageTier(i,!1),"</li>"):"","\n                                ").concat(a?'<li class="list-inline-item mr-1 small text-muted">'.concat(a,"os</li>"):"","\n                                ").concat(t&&i.length?'<li class="list-inline-item mr-1">'.concat(getItemListHtml(i,"received",l.id,!1,!1),"</li>"):"","\n                            </ul>\n                        </div>"):'<span class="text-muted">—</span>'},sort:function sort(e,n,l){var i;return(t?e.filter(function(e){return t.includes(e.inventory_type)}):e).length}},orderable:!0,visible:"slots"===view,searchable:!0,type:"num"}}function getItemListHtml(e,t,n){var l=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],a='<ol class="js-item-list list-inline mb-0" data-type="'.concat(t,'" data-id="').concat(n,'" style="').concat(i?"":"display:none;",'">');return $.each(e,function(e,i){var s='data-wowhead-link="https://'.concat(wowheadLocale+wowheadSubdomain,".wowhead.com/item=").concat(i.item_id,'"\n            data-wowhead="item=').concat(i.item_id,"?domain=").concat(wowheadLocale+wowheadSubdomain,'"');a+='\n            <li class="js-has-instance font-weight-normal"\n                data-type="'.concat(t,'"\n                data-id="').concat(n,'"\n                data-offspec="').concat(i.pivot.is_offspec?1:0,'"\n                data-instance-id="').concat(i.instance_id,'"\n                data-wishlist-number="').concat(i.list_number,'"\n                value="').concat(l?i.pivot.order:"",'">\n                ').concat(guild.tier_mode&&i.guild_tier?getTierHtml(i,!0):"",'\n                <a href="/').concat(guild.id,"/").concat(guild.slug,"/i/").concat(i.item_id,"/").concat(slug(i.name),'"\n                    class="small ').concat(i.quality?"q"+i.quality:""," ").concat(!i.pivot.is_received||"wishlist"!=i.pivot.type&&"prio"!=i.pivot.type?"":"font-strikethrough",'"\n                    ').concat(s,">\n                    ").concat(i.name,"\n                </a>\n                ").concat(i.pivot.is_offspec?'<span title="offspec item" class="small font-weight-bold text-muted">OS</span>':"",'\n                <span class="js-watchable-timestamp js-timestamp-title smaller text-muted"\n                    data-timestamp="').concat(i.pivot.received_at?i.pivot.received_at:i.pivot.created_at,'"\n                    data-title="added by ').concat(i.added_by_username,' at"\n                    data-is-short="1">\n                </span>\n            </li>')}),a+="</ol>"}function getNotes(e,t,n){return(n.public_note?'<span class="js-markdown-inline small">'.concat(DOMPurify.sanitize(nl2br(n.public_note)),"</span>"):"—")+(n.officer_note?'<br><small class="font-weight-medium font-italic text-gold">Officer\'s Note</small><br><span class="js-markdown-inline small">'.concat(DOMPurify.sanitize(nl2br(n.officer_note)),"</span>"):"")}function getRaidGroupHtml(e,t){return e?'<span class="small font-weight-light d-inline">\n            <span class="role-circle-small" style="background-color:'.concat(getColorFromDec(parseInt(t)),'"></span>\n                ').concat(e,"\n            </span>"):""}function getTierHtml(e,t){return'<span class="text-monospace small font-weight-normal text-'.concat(t&&e.guild_tier?"tier-"+Math.ceil(e.guild_tier):"muted",'">').concat(e.guild_tier?getItemTierLabel(e,guild.tier_mode):"&nbsp;","</span>")}function hideOffspecItems(){$("[data-offspec='1']").hide()}function showOffspecItems(){$("[data-offspec='1']").show()}function hideStrikethroughItems(){$("[data-type='prio']").children(".font-strikethrough").parent().hide(),$("[data-type='wishlist']").children(".font-strikethrough").parent().hide()}function showStrikethroughItems(){$("[data-type='prio']").children(".font-strikethrough").parent().show(),$("[data-type='wishlist']").children(".font-strikethrough").parent().show()}function toggleInstanceCols(e){1===guild.expansion_id?table.columns([colInstanceTotal,colInstance1,colInstance2,colInstance3,colInstance4,colInstance5,colInstance6,colInstance7,colInstance8,colInstance9]).visible(e):2===guild.expansion_id?table.columns([colInstanceTotal,colInstance1,colInstance2,colInstance3,colInstance4,colInstance5,colInstance6,colInstance7,colInstance8,colInstance9,colInstance10,colInstance11]).visible(e):guild.expansion_id}function toggleSlotCols(e){table.columns([colSlotTotal,colSlotHead,colSlotNeck,colSlotShoulder,colSlotBack,colSlotChest,colSlotWrists,colSlotHands,colSlotWaist,colSlotLegs,colSlotFeet,colSlotFinger,colSlotTrinket,colSlotWeapon,colSlotOffhand,colSlotRanged,colSlotOther]).visible(e)}function callRosterStatHandlers(){rosterHandlersTimeout&&clearTimeout(rosterHandlersTimeout),rosterHandlersTimeout=setTimeout(function(){makeWowheadLinks(),parseMarkdown(),trackTimestamps()},500)}$(document).ready(function(){view=window.location.hash.substring(1),[VIEW_PRIOS,VIEW_RECEIVED,VIEW_SLOTS,VIEW_WISHLIST].includes(view)||(view=VIEW_SLOTS),table=createRosterStatsTable(),view==VIEW_SLOTS?$(".js-show-slot-cols").addClass("disabled"):view==VIEW_PRIOS?($(".js-show-prio-cols").addClass("disabled"),$(".js-received-items").hide(),$(".js-wishlist-items").hide()):view==VIEW_RECEIVED?($(".js-show-received-cols").addClass("disabled"),$(".js-prio-items").hide(),$(".js-wishlist-items").hide()):view==VIEW_WISHLIST&&($(".js-show-wishlist-cols").addClass("disabled"),$(".js-prio-items").hide(),$(".js-received-items").hide()),$(".js-toggle-column").click(function(e){e.preventDefault();var t=table.column($(this).attr("data-column"));t.visible(!t.visible())}),$(".js-show-prio-cols").click(function(e){e.preventDefault(),view=VIEW_PRIOS,window.location="#"+VIEW_PRIOS,$(".js-toggle-column-set").removeClass("disabled"),$(this).addClass("disabled"),toggleInstanceCols(!0),toggleSlotCols(!1),$(".js-prio-items").show(),$(".js-received-items").hide(),$(".js-wishlist-items").hide()}),$(".js-show-received-cols").click(function(e){e.preventDefault(),view=VIEW_RECEIVED,window.location="#"+VIEW_RECEIVED,$(".js-toggle-column-set").removeClass("disabled"),$(this).addClass("disabled"),toggleInstanceCols(!0),toggleSlotCols(!1),$(".js-prio-items").hide(),$(".js-received-items").show(),$(".js-wishlist-items").hide()}),$(".js-show-slot-cols").click(function(e){e.preventDefault(),view=VIEW_SLOTS,window.location="#"+VIEW_SLOTS,$(".js-toggle-column-set").removeClass("disabled"),$(this).addClass("disabled"),toggleInstanceCols(!1),toggleSlotCols(!0)}),$(".js-show-wishlist-cols").click(function(e){e.preventDefault(),view=VIEW_WISHLIST,window.location="#"+VIEW_WISHLIST,$(".js-toggle-column-set").removeClass("disabled"),$(this).addClass("disabled"),toggleInstanceCols(!0),toggleSlotCols(!1),$(".js-prio-items").hide(),$(".js-received-items").hide(),$(".js-wishlist-items").show()}),$(".js-hide-strikethrough-items").click(function(){strikethroughVisible?(strikethroughVisible=!1,hideStrikethroughItems()):(strikethroughVisible=!0,showStrikethroughItems())}),table.on("column-visibility.dt",function(e,t,n,l){callRosterStatHandlers()}),$(".js-hide-offspec-items").click(function(){offspecVisible?(offspecVisible=!1,hideOffspecItems()):(offspecVisible=!0,showOffspecItems())}),$(".js-show-all-items").click(function(){allItemsVisible?($(".js-item-list").hide(),allItemsVisible=!1):($(".js-item-list").show(),allItemsVisible=!0)}),$(".selectpicker").selectpicker("refresh"),$(".loadingBarContainer").removeClass("d-flex").hide(),$("#characterStatsTable").show(),$("#characterStatsTableFilters").show(),callRosterStatHandlers(),addInstanceFilterHandlers()});
