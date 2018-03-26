/* jshint esversion: 6 */

angular.module("svgmModule").service("svgService", function () {
  this.prepare = data => {
    let {node: node, attributes: attributes, innerHtml: innerHtml} = data;
    let {
      id: id,
      "class": className,
      height: height,
      width: width,
      x: x,
      y: y,
      fontSize: fontSize,
      alignmentBaseline: alignmentBaseline,
      textAlign: textAlign
    } = attributes;
    attributes = null;
    let txt = `<${node}`;

    Object.keys(attributes).forEach(key => {
      txt += `'${key}='+${attributes[key]}`;
    });

    txt += ` ${innerHtml? innerHtml : ""}` +
    `</${node}>`;

    txt.replace(/className/,"class");
    txt.replace(/alignmentBaseline/,"alignment-baseline");
    txt.replace(/textAlign/,"text-align");

    return txt;
  };
  this.get = () => {
  };

  this.parse = data => {
    const svgNS = "http://www.w3.org/2000/svg";
    const element = document.createElementNS(svgNS, data.node);
    let attributes = data.attributes;
    for (let attribute in attributes) {
      if (attributes[attribute]) {
        element.setAttributeNS(null, `${attribute}`, attributes[attribute]);
      }
    }
    attributes = null;
    if (data.svg) element.innerHTML = data.svg;
    return element;
  };

  this.prepareFragment = data => {
    /** get data */
    let {
      parent: parent,
      method: method = "appendChild",
      node: node = "svg",
      number: number = 1,
      attributes: attributes,
      frag: frag = document.createDocumentFragment(),
      svg: svg
    } = data;

    /** Append svg to document fragment. */
    for (let i = 0, len = number; i < len; i ++) {
      frag.appendChild(this.parseSVG({
        node: node,
        attributes: attributes,
        svg: svg
      }));
    }
    return frag;
  };

  this.appendFragment = data => {
    let {
      parent: parent,
      method: method = "appendChild",
      frag: frag
    } = data;

    /** Find html element. */
    let element = parent.element || document[parent.method](parent.identifier);
    /** If HTMLcollection get the first element. */
    if (HTMLCollection.prototype.isPrototypeOf(element)) {
      element = element[0];
    }
    /** Append / prepend document fragment to the element. */
    element[method](frag);

    element = null;
    frag = null;
  };

});
