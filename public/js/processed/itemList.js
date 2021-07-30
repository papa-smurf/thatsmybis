var table = null;
var colSource = 0;
var colName = 1;
var colPrios = 2;
var colWishlist = 3;
var colReceived = 4;
var colNotes = 5;
var colPriority = 6; // For keeping track of the loot's source

var lastSource = null;
$(document).ready(function () {
  table = createTable();
  $(".toggle-column").click(function (e) {
    e.preventDefault();
    var column = table.column($(this).attr("data-column"));
    column.visible(!column.visible());
  });
  $(".toggle-column-default").click(function (e) {
    e.preventDefault();
    table.column(colName).visible(true);
    table.column(colPrios).visible(true);
    table.column(colWishlist).visible(true);
    table.column(colReceived).visible(true);
    table.column(colNotes).visible(true);
    table.column(colPriority).visible(true);
  }); // Triggered when a column is made visible

  table.on('column-visibility.dt', function (e, settings, column, state) {
    // Refresh wowhead links to show stlying.
    // wowhead's script previously ignored these links if they weren't visible
    makeWowheadLinks();
    trackTimestamps();
    parseMarkdown();
  }); // Filter out characters based on the raid group they are in

  $("#raid_group_filter").on('change', function () {
    var raidGroupId = $(this).val();

    if (raidGroupId) {
      $(".js-item-wishlist-character[data-raid-group-id!='" + raidGroupId + "']").hide();
      $(".js-item-wishlist-character[data-raid-group-id='" + raidGroupId + "']").show();
    } else {
      $(".js-item-wishlist-character").show();
    }
  }).change();
  trackTimestamps();
});

function createTable(lastSource) {
  memberTable = $("#itemTable").DataTable({
    "autoWidth": false,
    "data": items,
    "columns": [{
      "title": "<span class=\"fas fa-fw fa-skull-crossbones\"></span> ".concat(headerBoss),
      "data": "",
      "render": function render(data, type, row) {
        if (row.source_name) {
          thisSource = row.source_name;
        }

        return "\n                    <ul class=\"no-bullet no-indent mb-0\">\n                        ".concat(row.source_name ? "\n                            <li>\n                                <span class=\"font-weight-bold\">\n                                    ".concat(row.source_name, "\n                                </span>\n                            </li>") : "", "\n                    </ul>");
      },
      "visible": true,
      "width": "130px",
      "className": "text-right width-130"
    }, {
      "title": "<span class=\"fas fa-fw fa-sack text-success\"></span> ".concat(headerLoot, " <span class=\"text-muted small\">(").concat(items.length, ")</span>"),
      "data": "",
      "render": function render(data, type, row) {
        return getItemLink(row);
      },
      "visible": true,
      "width": "330px",
      "className": "width-330"
    }, {
      "title": "<span class=\"fas fa-fw fa-sort-amount-down text-gold\"></span> ".concat(headerPrios),
      "data": guild.is_attendance_hidden ? "priod_characters" : "priod_characters_with_attendance",
      "render": function render(data, type, row) {
        return data && data.length ? getCharacterList(data, 'prio', row.item_id) : '—';
      },
      "orderable": false,
      "visible": showPrios ? true : false,
      "width": "300px",
      "className": "width-300"
    }, {
      "title": "<span class=\"text-legendary fas fa-fw fa-scroll-old\"></span> ".concat(headerWishlist),
      "data": guild.is_attendance_hidden ? "wishlist_characters" : "wishlist_characters_with_attendance",
      "render": function render(data, type, row) {
        return data && data.length ? getCharacterList(data, 'wishlist', row.item_id) : '—';
      },
      "orderable": false,
      "visible": showWishlist ? true : false,
      "width": "400px",
      "className": "width-400"
    }, {
      "title": "<span class=\"text-success fas fa-fw fa-sack\"></span> ".concat(headerReceived),
      "data": "received_and_recipe_characters",
      "render": function render(data, type, row) {
        return data && data.length ? getCharacterList(data, 'received', row.item_id) : '—';
      },
      "orderable": false,
      "visible": true,
      "width": "300px",
      "className": "width-300"
    }, {
      "title": "<span class=\"fas fa-fw fa-comment-alt-lines\"></span> ".concat(headerNotes),
      "data": "guild_note",
      "render": function render(data, type, row) {
        return getNotes(row, data);
      },
      "orderable": false,
      "visible": showNotes ? true : false,
      "width": "200px",
      "className": "width-200"
    }, {
      "title": "<span class=\"fas fa-fw fa-comment-alt-lines\"></span> ".concat(headerPrioNotes),
      "data": "guild_priority",
      "render": function render(data, type, row) {
        return data ? "<span class=\"js-markdown-inline\">".concat(nl2br(data), "</span>") : '—';
      },
      "orderable": false,
      "visible": showNotes ? true : false,
      "width": "200px",
      "className": "width-200"
    }],
    "order": [],
    // Disable initial auto-sort; relies on server-side sorting
    "paging": false,
    "fixedHeader": true,
    // Header row sticks to top of window when scrolling down
    "initComplete": function initComplete() {
      makeWowheadLinks();
      parseMarkdown();
    },
    "createdRow": function createdRow(row, data, dataIndex) {
      // Add a top border style between different loot sources
      if (dataIndex == 0 || lastSource == null) {
        lastSource = data.source_name;
      }

      if (data.source_name != lastSource) {
        $(row).addClass("top-border");
        lastSource = data.source_name;
      }
    }
  });
  return memberTable;
} // Gets an HTML list of characters


function getCharacterList(data, type, itemId) {
  var characters = "<ul class=\"list-inline js-item-list mb-0\" data-type=\"".concat(type, "\" data-id=\"").concat(itemId, "\">");
  var initialLimit = 4;
  var lastRaidGroupId = null;
  $.each(data, function (index, character) {
    if (type == 'prio' && character.pivot.raid_group_id && character.pivot.raid_group_id != lastRaidGroupId) {
      lastRaidGroupId = character.pivot.raid_group_id;
      var raidGroupName = '';

      if (raidGroups.length) {
        var raidGroup = raidGroups.find(function (raidGroup) {
          return raidGroup.id === character.pivot.raid_group_id;
        });

        if (raidGroup) {
          raidGroupName = raidGroup.name;
        }
      }

      characters += "\n                <li data-raid-group-id=\"\" class=\"js-item-wishlist-character no-bullet font-weight-normal font-italic text-muted small\">\n                    ".concat(raidGroupName, "\n                </li>\n            ");
    }

    if (type == 'wishlist' && (character.raid_group_id && character.raid_group_id != lastRaidGroupId || !character.raid_group_id && lastRaidGroupId)) {
      var _raidGroupName = '';

      if (!character.raid_group_id && lastRaidGroupId) {
        _raidGroupName = 'no raid group';
        lastRaidGroupId = null;
      } else {
        lastRaidGroupId = character.raid_group_id;

        if (raidGroups.length) {
          var _raidGroup = raidGroups.find(function (raidGroup) {
            return raidGroup.id === character.raid_group_id;
          });

          if (_raidGroup) {
            _raidGroupName = _raidGroup.name;
          }
        }
      }

      characters += "\n                <li data-raid-group-id=\"\" class=\"js-item-wishlist-character no-bullet font-weight-normal font-italic text-muted small\">\n                    ".concat(_raidGroupName, "\n                </li>\n            ");
    }

    characters += "\n            <li data-raid-group-id=\"".concat(type == 'prio' ? character.pivot.raid_group_id : character.raid_group_id, "\"\n                value=\"").concat(type == 'prio' ? character.pivot.order : '', "\"\n                class=\"js-item-wishlist-character list-inline-item font-weight-normal mb-1 mr-0 ").concat(character.pivot.type != 'received' && character.pivot.received_at ? 'font-strikethrough' : '', "\">\n                <a href=\"/").concat(guild.id, "/").concat(guild.slug, "/c/").concat(character.id, "/").concat(character.slug, "\"\n                    title=\"").concat(character.raid_group_name ? character.raid_group_name + ' -' : '', " ").concat(character.level ? character.level : '', " ").concat(character.race ? character.race : '', " ").concat(character.spec ? character.spec : '', " ").concat(character["class"] ? character["class"] : '', " ").concat(character.raid_count ? "(".concat(character.raid_count, " raid").concat(character.raid_count > 1 ? 's' : '', " attended)") : "", " ").concat(character.username ? '(' + character.username + ')' : '', "\"\n                    class=\"tag text-muted d-inline\">\n                    <span class=\"\">").concat(type !== 'received' && character.pivot.order ? (character.pivot.order - character.attendance_order_modifier - character.personal_order_modifier * -1).toFixed(1) : '', "</span>\n                    <span class=\"small font-weight-bold\">").concat(character.pivot.is_offspec ? 'OS' : '', "</span>\n                    <span class=\"role-circle\" style=\"background-color:").concat(getColorFromDec(character.raid_group_color), "\"></span>\n                    <span class=\"text-").concat(character["class"] ? character["class"].toLowerCase() : '', "-important\">").concat(character.name, "</span>\n                    ").concat(character.is_alt ? "\n                        <span class=\"text-warning\">".concat(localeAlt, "</span>\n                    ") : '', "\n                    ").concat(!guild.is_attendance_hidden && (character.attendance_percentage || character.raid_count) ? "".concat(character.raid_count && typeof character.attendance_percentage === 'number' ? "<span title=\"attendance\" class=\"smaller ".concat(getAttendanceColor(character.attendance_percentage), "\">").concat(Math.round(character.attendance_percentage * 100), "%</span>") : '').concat(character.raid_count ? "<span class=\"smaller\"> ".concat(character.raid_count, "r</span>") : "", "\n                    ") : "", "\n                    <span class=\"js-watchable-timestamp smaller\"\n                        data-timestamp=\"").concat(character.pivot.created_at, "\"\n                        data-is-short=\"1\">\n                    </span>\n                    <span style=\"display:none;\">").concat(character.discord_username, " ").concat(character.username, "</span>\n                </a>\n            </li>");
  });
  characters += "</ul>";
  return characters;
}

function getNotes(row, note) {
  var childItems = null; // Uncomment to show child items
  // if (row.child_items.length) {
  //     childItems = '<ul class="list-inline">';
  //     row.child_items.forEach(function (item, index) {
  //         item.quality = 0;
  //         childItems += `<li class="list-inline-item smaller">${ getItemLink(item, ' ') }</li>`;
  //     });
  //     childItems += '</ul>';
  // }

  if (note || childItems) {
    note = "<span class=\"js-markdown-inline\">".concat(note ? DOMPurify.sanitize(nl2br(note)) : '', "</span>").concat(childItems ? childItems : '');
  } else {
    note = '—';
  }

  return note;
}

function getItemLink(row) {
  var iconSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var wowheadData = "data-wowhead-link=\"https://".concat(wowheadLocale + wowheadSubdomain, ".wowhead.com/item=").concat(row.item_id, "\"\n    data-wowhead=\"item=").concat(row.item_id, "?domain=").concat(wowheadLocale + wowheadSubdomain, "\"");

  if (iconSize) {
    wowheadData += " data-wh-icon-size=\"".concat(iconSize, "\"");
  }

  var url = "";

  if (guild) {
    url = "/".concat(guild.id, "/").concat(guild.slug, "/i/").concat(row.item_id, "/").concat(slug(row.name));
  } else {
    url = "";
  }

  return "\n    <ul class=\"no-bullet no-indent mb-0\">\n        <li>\n            ".concat(guild.tier_mode ? "<span class=\"text-monospace font-weight-medium text-tier-".concat(row.guild_tier ? row.guild_tier : '', "\">").concat(row.guild_tier ? getItemTierLabel(row, guild.tier_mode) : '&nbsp;', "</span>") : "", "\n            <a href=\"").concat(url, "\"\n                class=\"").concat(row.quality ? 'q' + row.quality : '', "\"\n                ").concat(wowheadData, ">\n                ").concat(row.name, "\n            </a>\n        </li>\n    </ul>");
}
