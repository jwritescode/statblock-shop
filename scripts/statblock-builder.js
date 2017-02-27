var monster = {};

$(document).ready(function() {

  $.getJSON("/default_template.json", function(json) {
    monster = json;
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $('#two-column-checkbox').change(function() {
    monster.two_column = this.checked;
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#monster-name").keyup(function() {
    monster.name = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#monster-header").keyup(function() {
    monster.heading = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#str-score").on("input", function() {
    monster.ability_scores.str = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#dex-score").on("input", function() {
    monster.ability_scores.dex = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#con-score").on("input", function() {
    monster.ability_scores.con = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#wis-score").on("input", function() {
    monster.ability_scores.wis = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#int-score").on("input", function() {
    monster.ability_scores.int = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#cha-score").on("input", function() {
    monster.ability_scores.cha = $(this).val();
    $("#live-statblock").html(makeStatblockHTML(monster));
  });

  $("#basic-info-box").keyup(function() {
    try {
      var parsedInfo = propertyLineParser($(this).val());
      monster.traits = parsedInfo.result;
      if (parsedInfo.error) {
        $(this).parent().addClass("has-danger");
      } else {
        $(this).parent().removeClass("has-danger");
      }
    } catch(err) {
      console.log(err);
      $(this).parent().addClass("has-danger");
    } finally {
      $("#live-statblock").html(makeStatblockHTML(monster));
    }
  });

  $("#traits-box").keyup(function() {
    try {
      var parsedTraits = propertyLineParser($(this).val());
      monster.traits = parsedTraits.result;
      if (parsedTraits.error) {
        $(this).parent().addClass("has-danger");
      } else {
        $(this).parent().removeClass("has-danger");
      }
    } catch(err) {
      console.log(err);
      $(this).parent().addClass("has-danger");
    } finally {
      $("#live-statblock").html(makeStatblockHTML(monster));
    }
  });

  $("#main-content").keyup(function() {
    try {
      var parsedContent = contentParser($(this).val());
      monster.content = parsedContent.result;
      if (parsedContent.error) {
        $(this).parent().addClass("has-danger");
      } else {
        $(this).parent().removeClass("has-danger");
      }
    } catch(err) {
      console.log(err);
      $(this).parent().addClass("has-danger");
    } finally {
      $("#live-statblock").html(makeStatblockHTML(monster));
    }
  });
});

function propertyLineParser(string) {
  var result = [];
  var error = false;
  var lines = string.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i] === '')
      continue;
    try {
      var parts = lines[i].match(/([^\\\][^\|]|\\\|)+/g);
      result.push({name: parts[0].trim(), desc: parts[1].trim()});
    } catch(err) {
      result.push("input_error");
      error = true;
    }
  }
  return {result: result, error: error};
}

function contentParser(string) {
  var result = [];
  error = false;
  var lines = string.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i] === '')
      continue;
    var parts = lines[i].match(/([^\\\][^\|]|\\\|)+/g);
    try {
      switch (parts[0].trim().toLowerCase()) {
        case 'property':
          result.push({property_line: {
                       name: parts[1].trim(), desc: parts[2].trim()}});
          break;
        case 'description':
          result.push({property_block: {
                       name: parts[1].trim(), desc: parts[2].trim()}});
          break;
        case 'text':
          result.push({text:parts[1]});
          break;
        case 'subtitle':
          result.push({subtitle:parts[1]});
          break;
        default:
          result.push("input_error");
          error = true;
      }
    } catch(err) {
      result.push("input_error");
      error = true;
    }
  }
  return {result: result, error: error};
}
