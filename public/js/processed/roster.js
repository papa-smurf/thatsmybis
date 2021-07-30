var table = null;
var colName = 0;
var colPrios = 1;
var colWishlist = 2;
var colLoot = 3;
var colRecipes = 4;
var colRoles = 5;
var colNotes = 6;
var colClass = 7;
var colRaidGroup = 8;
var colRaidsAttended = 11;
var allItemsVisible = false;
$(document).ready(function () {
  var table = createTable();
  $(".toggle-column").click(function (e) {
    e.preventDefault();
    var column = table.column($(this).attr("data-column"));
    column.visible(!column.visible());
  });
  $(".toggle-column-default").click(function (e) {
    e.preventDefault();
    table.column(colName).visible(true);
    table.column(colRoles).visible(false);
    table.column(colLoot).visible(true);
    table.column(colWishlist).visible(true);
    table.column(colRecipes).visible(false);
    table.column(colNotes).visible(true);
  }); // Triggered when a column is made visible

  table.on('column-visibility.dt', function (e, settings, column, state) {
    // Refresh wowhead links to show stlying.
    // wowhead's script previously ignored these links if they weren't visible
    makeWowheadLinks();
    addClippedItemHandlers();
    trackTimestamps();
    parseMarkdown();
  }); // Toggle visiblity for all of the clipped/hidden items on the page

  $(".js-show-all-clipped-items").click(function () {
    if (allItemsVisible) {
      $(".js-clipped-item").hide();
      $(".js-show-clipped-items").show();
      $(".js-hide-clipped-items").hide();
      allItemsVisible = false;
    } else {
      $(".js-clipped-item").show();
      $(".js-show-clipped-items").hide();
      $(".js-hide-clipped-items").hide();
      allItemsVisible = true;
    }
  });
  $(".js-sort-by-raids-attended").click(function () {
    table.order(colRaidsAttended, 'desc').draw();
  });
  addClippedItemHandlers();
  addInstanceFilterHandlers();
  trackTimestamps();
});

function createTable() {
  memberTable = $("#characterTable").DataTable({
    "autoWidth": false,
    "data": characters,
    "columns": [{
      "title": "<span class=\"fas fa-fw fa-user\"></span> ".concat(headerCharacter, " <span class=\"text-muted small\">(").concat(characters.length, ")</span>"),
      "data": "character",
      "render": function render(data, type, row) {
        return "\n                    <ul class=\"no-bullet no-indent mb-2\">\n                        <li>\n                            <div class=\"dropdown text-".concat(row["class"] ? row["class"].toLowerCase() : '', "\">\n                                <a class=\"dropdown-toggle text-4 font-weight-bold text-").concat(row["class"] ? row["class"].toLowerCase() : '', "\"\n                                    id=\"character").concat(row.id, "Dropdown\"\n                                    role=\"button\"\n                                    data-toggle=\"dropdown\"\n                                    aria-haspopup=\"true\"\n                                    aria-expanded=\"false\"\n                                    title=\"").concat(row.username ? row.username : '', "\">\n                                    ").concat(row.name, "\n                                </a>\n                                <div class=\"dropdown-menu\" aria-labelledby=\"character").concat(row.id, "Dropdown\">\n                                    <a class=\"dropdown-item\" href=\"/").concat(guild.id, "/").concat(guild.slug, "/c/").concat(row.id, "/").concat(row.slug, "\">Profile</a>\n                                    <a class=\"dropdown-item\" href=\"/").concat(guild.id, "/").concat(guild.slug, "/audit-log?character_id=").concat(row.id, "\">History</a>\n                                    ").concat(showEdit ? "<a class=\"dropdown-item\" href=\"/".concat(guild.id, "/").concat(guild.slug, "/c/").concat(row.id, "/").concat(row.slug, "/edit\">Edit</a>\n                                        <a class=\"dropdown-item\" href=\"/").concat(guild.id, "/").concat(guild.slug, "/c/").concat(row.id, "/").concat(row.slug, "/loot\">Wishlist & Loot</a>") : "", "\n                                    ").concat(row.member_id ? "<a class=\"dropdown-item\" href=\"/".concat(guild.id, "/").concat(guild.slug, "/u/").concat(row.member_id, "/").concat(row.username ? row.username.toLowerCase() : 'view member', "\">").concat(row.username ? row.username : 'view member', "</a>") : "", "\n                                </div>\n                            </div>\n                        </li>\n                        ").concat(row.is_alt || row.raid_group_name || row["class"] ? "\n                            <li>\n                                ".concat(row.is_alt ? "\n                                    <span class=\"text-warning font-weight-bold\">".concat(localeAlt, "</span>&nbsp;\n                                ") : '', "\n                                ").concat(row.raid_group_name ? "\n                                    <span class=\"font-weight-bold d-inline tag\">\n                                        <span class=\"role-circle\" style=\"background-color:".concat(getColorFromDec(parseInt(row.raid_group_color)), "\"></span>\n                                        ").concat(row.raid_group_name ? row.raid_group_name : '', "\n                                    </span>&nbsp;\n                                ") : "", "\n                                ").concat(row["class"] ? row["class"] : '', "\n                            </li>") : "", "\n\n                        ").concat(!guild.is_attendance_hidden && (row.attendance_percentage || row.raid_count) ? "<li>\n                                ".concat(row.raid_count && typeof row.attendance_percentage === 'number' ? "<span title=\"attendance\" class=\"".concat(getAttendanceColor(row.attendance_percentage), "\">").concat(Math.round(row.attendance_percentage * 100), "%</span>") : '', "\n                                ").concat(row.raid_count ? "<span class=\"small text-muted\">".concat(row.raid_count, " raid").concat(row.raid_count > 1 ? 's' : '', "</span>") : "", "\n                            </li>") : "", "\n\n                        ").concat(row.level || row.race || row.spec ? "\n                            <li>\n                                <span class=\"small text-muted\">\n                                    ".concat(row.level ? row.level : '', "\n                                    <span class=\"font-weight-bold\">\n                                        ").concat(row.race ? row.race : '', "\n                                        ").concat(row.spec ? row.spec : '', "\n                                    </span>\n                                </span>\n                            </li>") : "", "\n\n                        ").concat(row.rank || row.profession_1 || row.profession_2 ? "\n                            <li>\n                                <span class=\"small text-muted\">\n                                    ".concat(row.rank ? 'Rank ' + row.rank + (row.profession_1 || row.profession_2 ? ',' : '') : '', "\n                                    ").concat(row.profession_1 ? row.profession_1 + (row.profession_2 ? ',' : '') : '', "\n                                    ").concat(row.profession_2 ? row.profession_2 : '', "\n                                </span>\n                            </li>") : "", "\n                        ").concat(showEdit ? "\n                            ".concat(row.is_received_unlocked ? "<li class=\"list-inline-item small text-warning\" title=\"To lock, edit the member that owns this character\">loot unlocked</li>" : "", "\n                            ").concat(row.is_wishlist_unlocked ? "<li class=\"list-inline-item small text-warning\" title=\"To lock, edit the member that owns this character\">wishlist unlocked</li>" : "", "\n                            ") : "", "\n                    </ul>");
      },
      "visible": true,
      "width": "250px",
      "className": "width-250"
    }, {
      "title": "<span class=\"text-gold fas fa-fw fa-sort-amount-down\"></span> ".concat(headerPrios),
      "data": "prios",
      "render": function render(data, type, row) {
        return data && data.length ? getItemList(data, 'prio', row.id, true) : '—';
      },
      "orderable": false,
      "visible": showPrios ? true : false,
      "width": "280px",
      "className": "width-280"
    }, {
      "title": "<span class=\"text-legendary fas fa-fw fa-scroll-old\"></span> ".concat(headerWishlist, "\n                    <span class=\"js-sort-wishlists text-link\">\n                        <span class=\"fas fa-fw fa-exchange cursor-pointer\"></span>\n                    </span>"),
      "data": "wishlist",
      "render": function render(data, type, row) {
        if (data && data.length) {
          // Create a copy of data, then sort it by instance_order DESC, user chosen order ASC
          var dataSorted = data.slice().sort(function (a, b) {
            return a.instance_order - b.instance_order || a.pivot.order - b.pivot.order;
          });
          var list = "";
          list += getItemList(dataSorted, 'wishlist', row.id, true, true, 'js-wishlist-sorted', guild.do_sort_items_by_instance ? true : false);
          list += getItemList(data, 'wishlist', row.id, true, false, 'js-wishlist-unsorted', guild.do_sort_items_by_instance ? false : true);
          return list;
        } else {
          return '—';
        }
      },
      "orderable": false,
      "visible": showWishlist ? true : false,
      "width": "280px",
      "className": "width-280"
    }, {
      "title": "<span class=\"text-success fas fa-fw fa-sack\"></span> ".concat(headerReceived),
      "data": "received",
      "render": function render(data, type, row) {
        return data && data.length ? getItemList(data, 'received', row.id) : '—';
      },
      "orderable": false,
      "visible": true,
      "width": "280px",
      "className": "width-280"
    }, {
      "title": "<span class=\"text-gold fas fa-fw fa-book\"></span> ".concat(headerRecipes),
      "data": "recipes",
      "render": function render(data, type, row) {
        return data && data.length ? getItemList(data, 'recipes', row.id) : '—';
      },
      "orderable": false,
      "visible": false,
      "width": "280px",
      "className": "width-280"
    }, {
      /* this feature has been cut */
      "title": "Roles",
      "data": "user.roles",
      "render": function render(data, type, row) {
        var roles = "";

        if (data && data.length > 0) {
          roles = '<ul class="list-inline">';
          data.forEach(function (item, index) {
            var color = item.color != 0 ? '#' + rgbToHex(item.color) : "#FFFFFF";
            roles += "<li class=\"list-inline-item\"><span class=\"tag\" style=\"border-color:".concat(color, ";\"><span class=\"role-circle\" style=\"background-color:").concat(color, "\"></span>").concat(item.name, "</span></li>");
          });
          roles += "</ul>";
        } else {
          roles = '—';
        }

        return roles;
      },
      "orderable": false,
      "visible": false
    }, {
      "title": "<span class=\"fas fa-fw fa-comment-alt-lines\"></span> ".concat(headerNotes),
      "data": "public_note",
      "render": function render(data, type, row) {
        return getNotes(data, type, row);
      },
      "orderable": false,
      "visible": true,
      "width": "280px",
      "className": "width-280"
    }, {
      "title": "Class",
      "data": "class",
      "render": function render(data, type, row) {
        return row["class"] ? row["class"] : null;
      },
      "visible": false
    }, {
      "title": "Raid Group",
      "data": "raid_group",
      "render": function render(data, type, row) {
        var contents = '' + (row.raid_group_id ? row.raid_group_id : '');

        if (row.secondary_raid_groups && row.secondary_raid_groups.length) {
          row.secondary_raid_groups.forEach(function (raidGroup, index) {
            contents += "".concat(raidGroup.id, " ");
          });
        }

        return contents;
      },
      "visible": false
    }, {
      "title": "Username",
      "data": "username",
      "render": function render(data, type, row) {
        return row.username ? row.username : null;
      },
      "visible": false
    }, {
      "title": "Discord Username",
      "data": "discord_username",
      "render": function render(data, type, row) {
        return row.discord_username ? row.discord_username : null;
      },
      "visible": false
    }, {
      "title": "Raids Attended",
      "data": "raid_count",
      "render": function render(data, type, row) {
        return row.raid_count ? row.raid_count : null;
      },
      "visible": false,
      "searchable": false
    }],
    "order": [],
    // Disable initial auto-sort; relies on server-side sorting
    "paging": false,
    "fixedHeader": true,
    // Header row sticks to top of window when scrolling down
    initComplete: function initComplete() {
      var sortColumns = [colClass, colRaidGroup];
      this.api().columns().every(function (index) {
        var column = this;
        var select1 = null;
        var select2 = null; // Initialize this beside select1 if we want a secondary sort

        if (index == colClass) {
          select1 = $("#class_filter");
          select2 = null;
        }

        if (index == colRaidGroup) {
          select1 = $("#raid_group_filter");
          select2 = null;
        }

        if (sortColumns.includes(index)) {
          select1.on('change', function () {
            var val = $.fn.dataTable.util.escapeRegex($(this).val());

            if (select2 && select2.val()) {
              // Must contain both
              val = "(?=.*" + val + ")(?=.*" + $.fn.dataTable.util.escapeRegex(select2.val()) + ")";
            }

            column.search(val ? val : '', true, false).draw();
          }).change();

          if (select2) {
            select2.on('change', function () {
              var val = $.fn.dataTable.util.escapeRegex($(this).val());

              if (select1 && select1.val()) {
                // Must contain both
                val = "(?=.*" + val + ")(?=.*" + $.fn.dataTable.util.escapeRegex(select1.val()) + ")";
              }

              column.search(val ? val : '', true, false).draw();
            }).change();
          }
        }
      });
      makeWowheadLinks();
      addItemAutocompleteHandler();
      addTagInputHandlers();
      addWishlistSortHandlers();
      parseMarkdown();
    }
  });
  return memberTable;
}

function addClippedItemHandlers() {
  $(".js-show-clipped-items").click(function () {
    var id = $(this).data("id");
    var type = $(this).data("type");
    $(".js-clipped-item[data-id='" + id + "'][data-type='" + type + "']").show();
    $(".js-show-clipped-items[data-id='" + id + "'][data-type='" + type + "']").hide();
    $(".js-hide-clipped-items[data-id='" + id + "'][data-type='" + type + "']").show();
  });
  $(".js-hide-clipped-items").click(function () {
    var id = $(this).data("id");
    var type = $(this).data("type");
    $(".js-clipped-item[data-id='" + id + "'][data-type='" + type + "']").hide();
    $(".js-show-clipped-items[data-id='" + id + "'][data-type='" + type + "']").show();
    $(".js-hide-clipped-items[data-id='" + id + "'][data-type='" + type + "']").hide();
  });
}

function addInstanceFilterHandlers() {
  $("#instance_filter").change(function () {
    var instanceId = $("#instance_filter").val();

    if (instanceId) {
      // Show all items, then remove the visible/hidden filters; they interfere with this filter.
      allItemsVisible = false;
      $(".js-show-all-clipped-items").click();
      $(".js-show-all-clipped-items").hide();
      $(".js-show-clipped-items").hide();
      $(".js-hide-clipped-items").hide(); // hide all other instance's items

      $("li.js-has-instance[data-instance-id='" + instanceId + "']").show();
      $("li.js-has-instance[data-instance-id!='" + instanceId + "']").hide();
    } else {
      // show all instance's items
      $("li.js-has-instance[data-instance-id]").show(); // Reset the visible/hidden filters to their default state.

      allItemsVisible = true;
      $(".js-show-all-clipped-items").click();
      $(".js-show-all-clipped-items").show();
      $(".js-show-clipped-items").show();
      $(".js-hide-clipped-items").hide();
    }
  });
} // Gets an HTML list of items with pretty wowhead formatting


function getItemList(data, type, characterId) {
  var useOrder = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var showInstances = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var listClass = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var isVisible = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
  var items = "<ol class=\"no-indent js-item-list mb-2 ".concat(listClass, "\" data-type=\"").concat(type, "\" data-id=\"").concat(characterId, "\" style=\"").concat(isVisible ? '' : 'display:none;', "\">");
  var initialLimit = 4;
  var lastInstanceId = null;
  var lastRaidGroupId = null;
  $.each(data, function (index, item) {
    // Skip prio item if raid group is disabled or not found in the guild
    // if (type == 'prio' && item.pivot.raid_group_id && guild.raidGroups.filter(raidGroup => (raidGroup.id == item.pivot.raid_group_id)).length < 1) {
    //     console.log(item.pivot.raid_group_id + ' not found');
    //     return false;
    // }
    var clipItem = false;

    if (index >= initialLimit) {
      clipItem = true;

      if (index == initialLimit) {
        items += "<li class=\"js-show-clipped-items small cursor-pointer no-bullet \" data-type=\"".concat(type, "\" data-id=\"").concat(characterId, "\">show ").concat(data.length - initialLimit, " more\u2026</li>");
      }
    }

    if (type == 'prio' && item.pivot.raid_group_id && item.pivot.raid_group_id != lastRaidGroupId) {
      lastRaidGroupId = item.pivot.raid_group_id;
      var raidGroupName = '';

      if (raidGroups.length) {
        var raidGroup = raidGroups.find(function (raidGroup) {
          return raidGroup.id === item.pivot.raid_group_id;
        });

        if (raidGroup) {
          raidGroupName = raidGroup.name;
        }
      }

      items += "\n                <li data-raid-group-id=\"\" class=\"".concat(clipItem ? 'js-clipped-item' : '', " js-item-wishlist-character no-bullet font-weight-normal font-italic text-muted small\"\n                    style=\"").concat(clipItem ? 'display:none;' : '', "\"\n                    data-type=\"").concat(type, "\"\n                    data-id=\"").concat(characterId, "\">\n                    ").concat(raidGroupName, "\n                </li>\n            ");
    }

    if (showInstances && item.instance_id && item.instance_id != lastInstanceId) {
      lastInstanceId = item.instance_id;
      items += "\n                <li class=\"js-has-instance ".concat(clipItem ? 'js-clipped-item' : '', " no-bullet font-weight-normal font-italic text-muted small\"\n                    style=\"").concat(clipItem ? 'display:none;' : '', "\"\n                    data-type=\"").concat(type, "\"\n                    data-id=\"").concat(characterId, "\"\n                    data-instance-id=\"").concat(item.instance_id, "\">\n                    ").concat(item.instance_name, "\n                </li>\n            ");
    }

    var wowheadData = "data-wowhead-link=\"https://".concat(wowheadLocale + wowheadSubdomain, ".wowhead.com/item=").concat(item.item_id, "\"\n            data-wowhead=\"item=").concat(item.item_id, "?domain=").concat(wowheadLocale + wowheadSubdomain, "\"");
    items += "\n            <li class=\"js-has-instance font-weight-normal ".concat(clipItem ? 'js-clipped-item' : '', "\"\n                data-type=\"").concat(type, "\"\n                data-id=\"").concat(characterId, "\"\n                data-instance-id=\"").concat(item.instance_id, "\"\n                value=\"").concat(useOrder ? item.pivot.order : '', "\"\n                style=\"").concat(clipItem ? 'display:none;' : '', "\">\n                ").concat(guild.tier_mode ? "<span class=\"text-monospace font-weight-medium text-tier-".concat(item.guild_tier ? item.guild_tier : '', "\">").concat(item.guild_tier ? getItemTierLabel(item, guild.tier_mode) : '&nbsp;', "</span>") : "", "\n                <a href=\"/").concat(guild.id, "/").concat(guild.slug, "/i/").concat(item.item_id, "/").concat(slug(item.name), "\"\n                    class=\"").concat(item.quality ? 'q' + item.quality : '', " ").concat(item.pivot.is_received && (item.pivot.type == 'wishlist' || item.pivot.type == 'prio') ? 'font-strikethrough' : '', "\"\n                    ").concat(wowheadData, ">\n                    ").concat(item.name, "\n                </a>\n                ").concat(item.pivot.is_offspec ? '<span title="offspec item" class="small font-weight-bold text-muted">OS</span>' : '', "\n                <span class=\"js-watchable-timestamp js-timestamp-title smaller text-muted\"\n                    data-timestamp=\"").concat(item.pivot.received_at ? item.pivot.received_at : item.pivot.created_at, "\"\n                    data-title=\"added by ").concat(item.added_by_username, " at\"\n                    data-is-short=\"1\">\n                </span>\n            </li>");
  });

  if (data.length > initialLimit) {
    items += "<li class=\"js-hide-clipped-items small cursor-pointer no-bullet\" style=\"display:none;\" data-type=\"".concat(type, "\" data-id=\"").concat(characterId, "\">show less</li>");
  }

  items += "</ol>";
  return items;
}

function getNotes(data, type, row) {
  var secondaryRaidGroups = '';

  if (row.secondary_raid_groups && row.secondary_raid_groups.length) {
    secondaryRaidGroups = "<ul class=\"list-inline\">";
    row.secondary_raid_groups.forEach(function (raidGroup, index) {
      secondaryRaidGroups += "<li class=\"list-inline-item small\"><span class=\"tag text-muted\"><span class=\"role-circle align-fix\" style=\"background-color:".concat(getColorFromDec(parseInt(raidGroup.color)), "\"></span>").concat(raidGroup.name, "</span></li>");
    });
    secondaryRaidGroups += "</ul>";
  }

  return (row.public_note ? "<span class=\"js-markdown-inline\">".concat(DOMPurify.sanitize(nl2br(row.public_note)), "</span>") : '—') + (row.officer_note ? "<br><small class=\"font-weight-bold font-italic text-gold\">Officer's Note</small><br><span class=\"js-markdown-inline\">".concat(DOMPurify.sanitize(nl2br(row.officer_note)), "</span>") : '') + (secondaryRaidGroups ? "<br>".concat(secondaryRaidGroups) : "");
}
