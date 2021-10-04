function _createForOfIteratorHelper(t,a){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||a&&t&&"number"==typeof t.length){r&&(t=r);var c=0,i=function F(){};return{s:i,n:function n(){return c>=t.length?{done:!0}:{done:!1,value:t[c++]}},e:function e(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o=!0,d=!1,h;return{s:function s(){r=r.call(t)},n:function n(){var e=r.next();return o=e.done,e},e:function e(t){d=!0,h=t},f:function f(){try{o||null==r.return||r.return()}finally{if(d)throw h}}}}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}function resetAttendees(){confirm("Are you sure you want to empty and reset the attendee list?")&&($("select[name^=raid_group_id]").val("").change(),$("select[name^=characters][name$=\\[character_id\\]]").val("").change(),$(".js-attendance-skip").prop("checked",!1).change(),$("select[name^=characters][name$=\\[remark_id\\]]").val("").change(),$("[name^=characters][name$=\\[credit\\]]").bootstrapSlider("setValue",1),$("[name^=characters][name$=\\[public_note\\]]").val(""),$("[name^=characters][name$=\\[officer_note\\]]").val(""),$(".js-show-notes").show(),$(".js-notes").hide())}function findExistingCharacter(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return t?$('select[name^=characters][name$=\\[character_id\\]] option:selected[value="'.concat(e,'"]')).not(t).first():$('select[name^=characters][name$=\\[character_id\\]] option:selected[value="'.concat(e,'"]')).first()}function fillCharactersFromRaid(e){var t=characters.filter(function(t){return t.raid_group_id==e}),a=characters.filter(function(t){return t.secondary_raid_groups.filter(function(t){return t.id==e}).length>0}),n,r=0,c=0,i=_createForOfIteratorHelper(t.concat(a).sort(function(e,t){return e.name>t.name?1:t.name>e.name?-1:0})),o;try{for(i.s();!(o=i.n()).done;){var s=o.value,d;if(findExistingCharacter(s.id).length)c++;else{var h=$('select[name^=characters][name$=\\[character_id\\]] option:selected[value=""]').first().parent(),l=h.find('option[value="'+s.id+'"i]');l.val()&&(l.prop("selected",!0).change(),r++);var u=h.parent().closest(".js-row");$(u).find("[name^=characters][name$=\\[is_exempt\\]]").prop("checked",!1).change(),$(u).find("[name^=characters][name$=\\[remark_id\\]]").val("").change(),$(u).find("[name^=characters][name$=\\[credit\\]]").bootstrapSlider("setValue",1)}}}catch(e){i.e(e)}finally{i.f()}$(".js-raid-group-message").html("".concat(r," characters added").concat(c?" (".concat(c," already in list)"):"")).show(),setTimeout(function(){return $(".js-raid-group-message").hide()},7500)}function fixSliderLabels(){window.dispatchEvent(new Event("resize"))}function showNext(e){""!=$(e).val()&&($(e).show(),$(e).parent().next(".js-hide-empty").show())}function showNextCharacter(e){if(""!=$(e).val()){$(e).show();var t=$(e).closest(".js-row").next(".js-hide-empty");t.show(),t.find("select[name^=characters][name$=\\[character_id\\]]").addClass("selectpicker").selectpicker(),fixSliderLabels()}}$(document).ready(function(){var e=!0;warnBeforeLeaving("#editForm"),$(".js-date-input").datetimepicker({format:"Y-m-d H:i:s",inline:!0,step:30,theme:"dark",value:date?moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss"):null}),$(".js-date-input").change(),$("[name=raid_group_id\\[\\]]").change(function(){e||$("[name=add_raiders]").prop("checked")&&$(this).val()&&fillCharactersFromRaid($(this).val())}),$("[name^=characters][name$=\\[character_id\\]").change(function(){var t;e||findExistingCharacter($(this).val(),$(this).find(":selected")).length&&$(this).selectpicker("val","").selectpicker("refresh")}),$(".js-show-next").change(function(){showNext(this)}).change(),$(".js-show-next").keyup(function(){showNext(this)}),$(".js-show-next-character").change(function(){showNextCharacter(this)}).change(),$(".js-show-next-character").keyup(function(){showNextCharacter(this)}),$(".js-show-notes").click(function(){var e=$(this).data("index");$(this).hide(),$('.js-notes[data-index="'.concat(e,'"]')).show()}),$(".js-attendance-skip").on("change",function(){var e=$(this).data("index");this.checked?($('[data-attendance-input="'.concat(e,'"]')).addClass("disabled").hide(),$('[data-attendance-skip-note="'.concat(e,'"]')).show()):($('[data-attendance-input="'.concat(e,'"]')).removeClass("disabled").show(),$('[data-attendance-skip-note="'.concat(e,'"]')).hide())}).change(),$(".js-clear-attendees").click(function(){resetAttendees()}),e=!1,$(".loadingBarContainer").removeClass("d-flex").hide(),$("#editForm").show(),fixSliderLabels()});
