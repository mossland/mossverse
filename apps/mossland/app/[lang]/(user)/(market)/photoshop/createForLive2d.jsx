/// <reference types="types-for-adobe/Photoshop/2015.5"/>

function createForLive2d(doc, type) {
  var liveDoc = doc.duplicate();
  if (liveDoc.layers.length != 1) throw new Error("Group is not Unique");
  var group = liveDoc.layers[0];
  liveDoc.activeLayer = group;
  var groupName = group.name;
  for (var k = group.layers.length - 1; k >= 0; k--) group.layers[k].move(group, ElementPlacement.PLACEAFTER);
  if (group.locked) group.locked = false;
  group.remove();
  eval("#include /c/Mintaka_Github/akamir/libs/photoshop/Live2d_Preprocess.jsx");
  var file = File(partsPath + type + "/" + groupName + "/" + groupName + "-live2d" + ".psd");
  liveDoc.saveAs(file);
  liveDoc.close();
}
