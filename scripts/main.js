var monsters = [];
var selectedEncounter = [];

$(document).ready(function(){

  monsters = JSON.parse(localStorage.getItem('monsters'));
  if (monsters !== null)
    makeMonsterCards();

  $("#search-bar").keyup(function() {
    makeMonsterCards();
  });

  $("#add-srd").click(function() {
    $.getJSON("test.json", function(json) {
      addMonsters(json);
    });
  });

  $("#import").click(function() {

  });

  $("#export").click(function() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(monsters, null, '\t'));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "monsterLibrary.json");
    dlAnchorElem.click();
  });


  $("#add-monster").click(function() {
    if (monster !== null) {
      var found = false;
      for (var i = 0; i < selectedEncounter.length; i++) {
        if (selectedEncounter[i].name == selectedMonster.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        selectedEncounter.push(monster);

        var item = '<li class="list-group-item">';
        item += '<button type="button" class="btn btn-danger btn-sm mr-2 rm-encounter-btn">&times;</button>';
        item += selectedMonster.name;
        item += '</li>';
        $("#encounter-list").append(item);
      }
    }
  });

  $("#confirm-clear-list").click(function() {
    clearMonsters();
    $("#stat-block-location").empty();
  });

  $("#new-monster").click(function() {
    window.location.href='editor/';
  });

  $('#confirm-delete-statblock').on("click", function() {
    for (var i = 0; i < monsters.length; i++) {
      if (monster.name == monsters[i].name) {
        monsters.splice(i, 1);
        break;
      }
    }

    for (var j = 0; j < selectedEncounter.length; j++) {
      if (monster.name == selectedEncounter[j].name) {
        selectedEncounter.splice(j, 1);
        break;
      }
    }

    monster = null;
    makeEncounterList();
    makeMonsterCards();
    localStorage.setItem('monsters', JSON.stringify(monsters));
    $("#stat-block-location").empty();
  });

  $(document).on("click", ".rm-encounter-btn", function() {
    var listItem = $(this).parent();
    for (var i = 0; i < selectedEncounter.length; i++) {
      if (listItem.text().substring(1) == selectedEncounter[i].name)
        selectedEncounter.splice(i, 1);
    }
    listItem.remove();
  });

  $(document).on("click", ".monster-card", function() {
    var monsterName = $(this).find('.card-title').text();
    var monsterObject = monsters.filter(function(item) {
      return item.name === monsterName;
    });

    $(".active-monster").removeClass("active-monster");
    $(this).addClass("active-monster");
    monster = monsterObject[0];
    sessionStorage.setItem('activeMonster', JSON.stringify(monster));

    $("#stat-block-location").html(makeStatblockHTML(monster));
  });

});

function addMonsters(data) {
  if (monsters === null) {
    monsters = data;
  } else {
    for (var i = 0; i < data.length; i++) {
      var found = false;
      for (var j = 0; j < monsters.length; j++) {
        if (monsters[j].name == data[i].name) {
          found = true;
          break;
        }
      }
      if (!found) {
        monsters.push(data[i]);
      }
    }
  }

  localStorage.setItem('monsters', JSON.stringify(monsters));
  makeMonsterCards();
}

function makeMonsterCards() {
  var monsterList = [];
  var searchString = $("#search-bar").val().toLowerCase();

  if (searchString === '')
    monsterList = monsters;
  else {
    for (var i = 0; i < monsters.length; i++) {
      if (monsters[i].name.toLowerCase().indexOf(searchString) !== -1)
        monsterList.push(monsters[i]);
    }
  }

  var cards = "";
  for (var j = 0; j < monsterList.length; j++) {
    if (monster.name === monsterList[j].name)
      cards += '<div class="card monster-card active-monster">';
    else
      cards += '<div class="card monster-card">';

    cards += '<div class="card-block">';
    cards += '<h4 class="card-title">' + monsterList[j].name + '</h4>';
    cards += '<p class="card-text">' + monsterList[j].heading + '</p>';
    cards += '</div></div>';
  }

  $("#monster-list").html(cards);
}

function makeEncounterList() {
  var encounterList = "";
  for (var i = 0; i < selectedEncounter.length; i++) {
    encounterList += '<li class="list-group-item">';
    encounterList += '<button type="button" class="btn btn-danger btn-sm mr-2 rm-encounter-btn">&times;</button>';
    encounterList += selectedEncounter[i].name;
    encounterList += '</li>';
  }
  $("#encounter-list").html(encounterList);
}

function clearMonsters() {
  monsters = null;
  $("#monster-list").empty();
  localStorage.setItem('monsters', monsters);
}