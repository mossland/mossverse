/// <reference types="types-for-adobe/Photoshop/2015.5"/>

function splitGroupsToFiles(doc, type, saveLive2d) {
  alert("Start to Export " + doc.layers.length + " Files");
  for (var i = 0; i < doc.layers.length; i++) {
    var newDoc = doc.duplicate();
    var layer = newDoc.layers[i];
    newDoc.name = layer.name;
    for (var j = doc.layers.length - 1; j >= 0; j--) {
      if (j == i) continue;
      var rmLayer = newDoc.layers[j];
      if (rmLayer.locked) layToRm.locked = false;
      rmLayer.remove();
    }
    // var file = File(dataPath + layer.name + ".psd");
    var file = File(partsPath + type + "/" + layer.name + "/" + layer.name + ".psd");
    newDoc.saveAs(file);
    if (saveLive2d) createForLive2d(newDoc, type);
    newDoc.close();
  }
}

function splitGroupsToImages(doc) {
  alert("Start to Export " + doc.layers.length + " Files");
  var opt = new ExportOptionsSaveForWeb();
  opt.format = SaveDocumentType.PNG;
  opt.PNG8 = false;
  opt.quality = 100;
  for (var i = 0; i < doc.layers.length; i++) {
    var newDoc = doc.duplicate();
    var layer = newDoc.layers[i];
    newDoc.name = layer.name;
    for (var j = doc.layers.length - 1; j >= 0; j--) {
      if (j == i) continue;
      var rmLayer = newDoc.layers[j];
      if (rmLayer.locked) layToRm.locked = false;
      rmLayer.remove();
    }
    var folder = new Folder(assetPath + "/" + layer.name);
    if (!folder.exists) folder.create();
    else continue;
    var group = newDoc.layers[0];
    for (var j = 0; j < group.layers.length; j++) group.layers[j].visible = true;
    newDoc.trim(TrimType.TRANSPARENT);
    for (var j = 0; j < group.layers.length; j++) group.layers[j].visible = false;
    for (var j = 0; j < group.layers.length; j++) {
      group.layers[j].visible = true;
      var image = File(assetPath + "/" + layer.name + "/" + group.layers[j].name + ".png");
      newDoc.exportDocument(image, ExportType.SAVEFORWEB, opt);
      group.layers[j].visible = false;
    }
    for (var j = 0; j < group.layers.length; j++) group.layers[j].visible = true;
    var file = File(assetPath + "/" + layer.name + "/" + layer.name + ".psd");
    newDoc.saveAs(file);
    newDoc.close();
  }
}
