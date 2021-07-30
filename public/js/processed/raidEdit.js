$(document).ready(function () {
  var initializing = true;
  warnBeforeLeaving("#editForm"); // Always initialize to null, let the javascript convert from UTC time to local browser time,
  // then it will populate the date.

  $(".js-date-input").datetimepicker({
    format: 'Y-m-d H:i:s',
    inline: true,
    step: 30,
    theme: 'dark',
    value: moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss")
  }); // Trigger a date change to make it convert to UTC and stuff.

  $(".js-date-input").change();
  $("[name=raid_group_id\\[\\]]").change(function () {
    if (!initializing) {
      if ($(this).val()) {
        fillCharactersFromRaid($(this).val());
      }
    }
  }); // Don't allow for picking the same character in multiple inputs.

  $("[name^=characters][name$=\\[character_id\\]").change(function () {
    if (!initializing) {
      var existing = findExistingCharacter($(this).val(), $(this).find(":selected"));

      if (existing.length) {
        $(this).selectpicker("val", "").selectpicker("refresh");
      }
    }
  }); // Show the next input

  $(".js-show-next").change(function () {
    showNext(this);
  }).change();
  $(".js-show-next").keyup(function () {
    showNext(this);
  });
  $(".js-show-next-character").change(function () {
    showNextCharacter(this);
  }).change();
  $(".js-show-next-character").keyup(function () {
    showNextCharacter(this);
  });
  $(".js-show-notes").click(function () {
    var index = $(this).data('index');
    $(this).hide();
    $(".js-notes[data-index=\"".concat(index, "\"]")).show();
  });
  $(".js-attendance-skip").on('change', function () {
    var index = $(this).data('index');

    if (this.checked) {
      $("[data-attendance-input=\"".concat(index, "\"]")).addClass("disabled").hide();
      $("[data-attendance-skip-note=\"".concat(index, "\"]")).show();
    } else {
      $("[data-attendance-input=\"".concat(index, "\"]")).removeClass("disabled").show();
      $("[data-attendance-skip-note=\"".concat(index, "\"]")).hide();
    }
  }).change();
  $(".js-clear-attendees").click(function () {
    resetAttendees();
  });
  initializing = false;
}); // Reset and empty the attendee list.

function resetAttendees() {
  if (confirm("Are you sure you want to empty and reset the attendee list?")) {
    // Raid group selects
    $('select[name^=raid_group_id]').val('').change(); // Char select

    $('select[name^=characters][name$=\\[character_id\\]]').val('').change(); // Excused

    $(".js-attendance-skip").prop("checked", false).change(); // Note / remark

    $('select[name^=characters][name$=\\[remark_id\\]]').val('').change(); // Credit slider

    $("[name^=characters][name$=\\[credit\\]]").bootstrapSlider('setValue', 1); // Public note

    $('[name^=characters][name$=\\[public_note\\]]').val(''); // Officer note

    $('[name^=characters][name$=\\[officer_note\\]]').val(''); // Show the custom note toggle

    $(".js-show-notes").show(); // Hide the custom notes

    $(".js-notes").hide();
  }
}

function findExistingCharacter(characterId) {
  var except = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (except) {
    return $("select[name^=characters][name$=\\[character_id\\]] option:selected[value=\"".concat(characterId, "\"]")).not(except).first();
  } else {
    return $("select[name^=characters][name$=\\[character_id\\]] option:selected[value=\"".concat(characterId, "\"]")).first();
  }
} // Add characters belonging to the given raid group to the character list if they're not already in it


function fillCharactersFromRaid(raidGroupId) {
  var mainRaidGroupCharacters = characters.filter(function (character) {
    return character.raid_group_id == raidGroupId;
  });
  var secondaryRaidGroupCharacters = characters.filter(function (character) {
    return character.secondary_raid_groups.filter(function (raidGroup) {
      return raidGroup.id == raidGroupId;
    }).length > 0;
  }); // Combine the two arrays and sort by name

  var raidGroupCharacters = mainRaidGroupCharacters.concat(secondaryRaidGroupCharacters).sort(function (a, b) {
    return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
  });
  var addedCount = 0;
  var alreadyAddedCount = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = raidGroupCharacters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var character = _step.value;
      var existing = findExistingCharacter(character.id);

      if (!existing.length) {
        var emptyCharacterSelect = $('select[name^=characters][name$=\\[character_id\\]] option:selected[value=""]').first().parent();
        var characterOption = emptyCharacterSelect.find('option[value="' + character.id + '"i]');

        if (characterOption.val()) {
          characterOption.prop("selected", true).change();
          addedCount++;
        } // Reset associated inputs


        var row = emptyCharacterSelect.parent().closest(".js-row");
        $(row).find("[name^=characters][name$=\\[is_exempt\\]]").prop("checked", false).change();
        $(row).find("[name^=characters][name$=\\[remark_id\\]]").val("").change();
        $(row).find("[name^=characters][name$=\\[credit\\]]").bootstrapSlider('setValue', 1);
      } else {
        alreadyAddedCount++;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  $(".js-raid-group-message").html("".concat(addedCount, " characters added").concat(alreadyAddedCount ? " (".concat(alreadyAddedCount, " already in list)") : '')).show();
  setTimeout(function () {
    return $(".js-raid-group-message").hide();
  }, 7500);
} // Hack to get the slider's labels to refresh: https://github.com/seiyria/bootstrap-slider/issues/396#issuecomment-310415503


function fixSliderLabels() {
  window.dispatchEvent(new Event('resize'));
} // If the current element has a value, show it and the next element that is hidden because it is empty


function showNext(currentElement) {
  if ($(currentElement).val() != "") {
    $(currentElement).show();
    $(currentElement).parent().next(".js-hide-empty").show();
  }
} // If the current element has a value, show it and the next element that is hidden because it is empty


function showNextCharacter(currentElement) {
  if ($(currentElement).val() != "") {
    $(currentElement).show();
    var nextElement = $(currentElement).closest(".js-row").next(".js-hide-empty");
    nextElement.show();
    nextElement.find("select[name^=characters][name$=\\[character_id\\]]").addClass("selectpicker").selectpicker();
    fixSliderLabels();
  }
}
