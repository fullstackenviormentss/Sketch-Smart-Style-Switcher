// @format
//
// verticalAlignment: layer.textAlignment(),
// textAlignment: layer.textAlignment(),
// textTransform: layer.styleAttributes()["MSAttributedStringTextTransformAttribute"],
// strinke: layer.styleAttributes()["NSStrikethrough"],
// underline: layer.styleAttributes()["NSUnderline"]

var onRun = function(context) {
  function pasteInstanceSharedStyle(layer, sharedStyle) {
    return (layer.style = sharedStyle.newInstance());
  }

  function msg(msg) {
    context.document.showMessage(msg);
  }

  function compareObjects(o1, o2) {
    for (var p in o1) {
      if (o1.hasOwnProperty(p)) {
        if (o1[p] !== o2[p]) {
          return false;
        }
      }
    }
    for (var p in o2) {
      if (o2.hasOwnProperty(p)) {
        if (o1[p] !== o2[p]) {
          return false;
        }
      }
    }
    return true;
  }

  function checkIfStyleHasChanged(layer) {
    const a = listTextLayerAttrs(layer);
    const b = listTextLayerAttrsFromStyle(layer.sharedObject());
    return !compareObjects(a, b);
  }

  function getAllTextSharedStyles() {
    return context.document
      .documentData()
      .layerTextStyles()
      .objects();
  }

  function listTextLayerAttrs(layer) {
    const attrs = layer.attributedString().treeAsDictionary().value.attributes[0];

    let tt;
    try {
      tt =
        layer
          .style()
          .textStyle()
          .encodedAttributes().MSAttributedStringTextTransformAttribute + "";
    } catch (error) {
      tt = null;
    }

    return {
      color: attrs.MSAttributedStringColorAttribute.value + "",
      nsfont: attrs.NSFont.attributes.NSFontNameAttribute + "",
      fontSize: attrs.NSFont.attributes.NSFontSizeAttribute + "",
      family: attrs.NSFont.family + "",
      name: attrs.NSFont.name + "",
      kerning: attrs.NSKern + "",
      alignment: attrs.NSParagraphStyle.style.alignment + "",
      lineHeight: attrs.NSParagraphStyle.style.maximumLineHeight + "",
      parapgrah: attrs.NSParagraphStyle.style.paragraphSpacing + "",
      va:
        layer
          .style()
          .textStyle()
          .verticalAlignment() + "",
      tt: tt
    };
  }

  function listTextLayerAttrsFromStyle(layerStyle) {
    const attrs = layerStyle
      .style()
      .primitiveTextStyle()
      .attributes()
      .treeAsDictionary();

    const nsfont = attrs.NSFont;
    const nsparagraph = attrs.NSParagraphStyle;

    let tt;
    try {
      tt =
        layerStyle
          .value()
          .textStyle()
          .encodedAttributes().MSAttributedStringTextTransformAttribute + "";
    } catch (error) {
      tt = null;
    }

    return {
      color: attrs.MSAttributedStringColorAttribute.value + "",
      nsfont: nsfont.attributes.NSFontNameAttribute + "",
      fontSize: nsfont.attributes.NSFontSizeAttribute + "",
      family: nsfont.family + "",
      name: nsfont.name + "",
      kerning: attrs.NSKern + "",
      alignment: nsparagraph.style.alignment + "",
      lineHeight: nsparagraph.style.maximumLineHeight + "",
      parapgrah: nsparagraph.style.paragraphSpacing + "",
      va:
        layerStyle
          .value()
          .textStyle()
          .verticalAlignment() + "",
      tt: tt
    };
  }

  // Main

  const sel = context.selection;

  context.document.currentPage().select_byExpandingSelection(0, 0);
  sel.forEach(layer => {
    if (checkIfStyleHasChanged(layer)) {
      log(layer.name());
      layer.select_byExpandingSelection(true, true);
    }
  });
};