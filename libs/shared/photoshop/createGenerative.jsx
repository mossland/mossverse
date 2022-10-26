/// <reference types="types-for-adobe/Photoshop/2015.5"/>

function createGenerative(idx) {
  var doc = documents.add(2000, 2000, 300, "" + idx, NewDocumentMode.RGB);
  // doc.layers[0].locked = false;
  // doc.layers[0].remove();
  var attrSrc = getJson(genPath + "/" + idx + "/" + "attribute.json");
  for (var i = attrSrc.layers.length - 1; i >= 0; i--) {
    var layer = attrSrc.layers[i];
    var layerSet = doc.layerSets.add();
    layerSet.name = layer.name;
    for (var j = layer.paths.length - 1; j >= 0; j--) {
      var path = layer.paths[j];
      var fileName = path.split("/")[1];
      var layerName = fileName.replace(".png", "");
      var artLayer = layerSet.artLayers.add();
      artLayer.name = layerName;
    }
  }
  //   doc.selection.stroke(skinColor, 5, StrokeLocation.OUTSIDE, ColorBlendMode.NORMAL, 100, true);
  // fillLayers(doc, doc.artLayers, "ffffff");
}
function fillLayers(doc, artLayers, colorStr) {
  var color = getColorFromHex(colorStr);
  for (var i = 0; i < artLayers.length; i++) {
    doc.activeLayer = artLayers[i];
    doc.selection.fill(color, ColorBlendMode.DISSOLVE, 100, true);
  }
}
function getColorFromHex(colorStr) {
  var color = new SolidColor();
  color.rgb.red = parseInt(colorStr.slice(0, 2), 16);
  color.rgb.green = parseInt(colorStr.slice(2, 4), 16);
  color.rgb.blue = parseInt(colorStr.slice(4, 6), 16);
  return color;
}

function generateTribe(doc) {
  var sexs = ["male", "female"];
  var sexLayers = [doc.layers[0], doc.layers[1]];
  for (var i = 0; i < sexs.length; i++) {
    var sex = sexs[i];
    //human
    for (var j = 0; j < humanSkinColors.length; j++) {
      var groupName = "human-" + sex + "-" + (j + 1);
      var group = sexLayers[i].duplicate();
      group.name = groupName;
      for (var k = 0; k < group.layerSets.length; k++)
        fillLayers(doc, [group.layerSets[k].layers[1]], humanSkinColors[j]);
    }
    //angel
    for (var j = 0; j < angelSkinColors.length; j++) {
      var groupName = "angel-" + sex + "-" + (j + 1);
      var group = sexLayers[i].duplicate();
      group.name = groupName;
      for (var k = 0; k < group.layerSets.length; k++)
        fillLayers(doc, [group.layerSets[k].layers[1]], angelSkinColors[j]);
    }
    //devil
    for (var j = 0; j < devilSkinColors.length; j++) {
      var groupName = "devil-" + sex + "-" + (j + 1);
      var group = sexLayers[i].duplicate();
      group.name = groupName;
      for (var k = 0; k < group.layerSets.length; k++)
        fillLayers(doc, [group.layerSets[k].layers[1]], devilSkinColors[j]);
    }
  }
}
