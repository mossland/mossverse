/// <reference types="types-for-adobe/Photoshop/2015.5"/>

function renameLayerAndGroups(doc) {
  renameArtLayers(doc.artLayers);
  renameGroups(doc.layerSets);
}

function renameGroups(groups) {
  for (var i = 0; i < groups.length; i++) {
    groups[i].name = getPurifiedName(groups[i].name);
    renameArtLayers(groups[i].artLayers);
    if (groups[i].layerSets.length > 0) renameGroups(groups[i].layerSets);
  }
}

function renameArtLayers(artLayers) {
  for (var i = 0; i < artLayers.length; i++) artLayers[i].name = getPurifiedName(artLayers[i].name);
}

function getPurifiedName(name) {
  var strArr = name.split(" ");
  if (strArr.length == 1) return strArr.join("").replace(/(copy|복사)/g, "");
  else if (strArr.length >= 1)
    return strArr
      .slice(0, -1)
      .join("")
      .replace(/(copy|복사)/g, "");
}
