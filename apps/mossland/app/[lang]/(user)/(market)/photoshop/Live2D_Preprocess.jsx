// **************************************************************************************
// This is Javascript for Adobe Photoshop CC
// Copyright (c) 2018 Live2D inc.
// This software is released under the MIT License.
// https://opensource.org/licenses/mit-license.php
//
// 「*」(アスタリスク)が付いていないレイヤーセットを結合
// 更新 2019/04/04  クイックマスクモードになっていると結合できない問題を解消
// **************************************************************************************
(function () {
  var Layers = activeDocument.layers;

  activeDocument.suspendHistory("フォルダを結合", "LayerCheck(Layers)");

  function LayerCheck(Targets) {
    //  ===  パスの削除処理 start  =======
    var docRef = app.activeDocument;
    var PathItems = docRef.pathItems;
    var numPath = PathItems.length;
    for (var i = 0; i < numPath; i++) {
      var PathItem = PathItems[0];
      PathItem.remove();
    }
    //  ===  パスの削除処理 end  =======
    var qmask = docRef.quickMaskMode;
    if (qmask == true) {
      docRef.quickMaskMode = false;
    }

    var Vflag = false;
    for (var i = 0; i < Targets.length; i++) {
      var SelectLayer = Targets[i];
      var LayerType = SelectLayer.typename;
      if (SelectLayer.visible == false) {
        Vflag = true;
      }
      activeDocument.activeLayer = SelectLayer;
      if (LayerType == "LayerSet") {
        if (SelectLayer.name.match(/\*/g) != null) {
          if (Vflag == true) {
            activeDocument.activeLayer.visible = false;
          }
          LayerCheck(SelectLayer.layers); //  「*」付きのレイヤーセットの場合は再帰処理
        } else {
          activeDocument.activeLayer.merge();
        }
      }

      if (activeDocument.activeLayer.typename == "ArtLayer" && hasLayerMask() == true) {
        if (MaskEnabled() == true) {
          applyLayerMask();
        } else {
          selectLayerMask();
          deleteMask();
        }
      }
      if (Vflag == true) {
        activeDocument.activeLayer.visible = false;
        Vflag = false;
      }
    }
  }

  // === レイヤーマスクがあるかどうかの判定
  function hasLayerMask() {
    var hasLayerMask = false;
    try {
      var ref = new ActionReference();
      var keyUserMaskEnabled = app.charIDToTypeID("UsrM");
      ref.putProperty(app.charIDToTypeID("Prpr"), keyUserMaskEnabled);
      ref.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
      var desc = executeActionGet(ref);
      if (desc.hasKey(keyUserMaskEnabled)) {
        hasLayerMask = true;
      }
    } catch (e) {
      hasLayerMask = false;
    }
    return hasLayerMask;
  }

  //  レイヤーマスクの適用
  function applyLayerMask() {
    try {
      var idDlt = charIDToTypeID("Dlt ");
      var desc78 = new ActionDescriptor();
      var idnull = charIDToTypeID("null");
      var ref29 = new ActionReference();
      var idChnl = charIDToTypeID("Chnl");
      var idChnl = charIDToTypeID("Chnl");
      var idMsk = charIDToTypeID("Msk ");
      ref29.putEnumerated(idChnl, idChnl, idMsk);
      desc78.putReference(idnull, ref29);
      var idAply = charIDToTypeID("Aply");
      desc78.putBoolean(idAply, true);
      executeAction(idDlt, desc78, DialogModes.NO);
    } catch (e) {}
  }

  //  レイヤーマスクが有効か無効か判定
  function MaskEnabled() {
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("userMaskEnabled"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var maskFlag = executeActionGet(ref).getBoolean(stringIDToTypeID("userMaskEnabled"));
    return maskFlag;
  }

  //  レイヤーマスクを削除
  function deleteMask() {
    var idDlt = charIDToTypeID("Dlt ");
    var desc60 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref28 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref28.putEnumerated(idChnl, idOrdn, idTrgt);
    desc60.putReference(idnull, ref28);
    executeAction(idDlt, desc60, DialogModes.NO);
  }

  //  =====  レイヤーマスクがあった場合に選択する関数
  function selectLayerMask() {
    try {
      var id759 = charIDToTypeID("slct");
      var desc153 = new ActionDescriptor();
      var id760 = charIDToTypeID("null");
      var ref92 = new ActionReference();
      var id761 = charIDToTypeID("Chnl");
      var id762 = charIDToTypeID("Chnl");
      var id763 = charIDToTypeID("Msk ");
      ref92.putEnumerated(id761, id762, id763);
      desc153.putReference(id760, ref92);
      var id764 = charIDToTypeID("MkVs");
      desc153.putBoolean(id764, false);
      executeAction(id759, desc153, DialogModes.NO);
    } catch (e) {}
  }
})();
