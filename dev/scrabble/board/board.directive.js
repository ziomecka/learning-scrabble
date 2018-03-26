/* jshint esversion: 6 */
angular
.module("boardModule")
.directive("boardDirective", [
  "boardOptions",
  "boardService",
  (boardOptions, boardService) => {
    let {row: row, field: field} = boardOptions.view;
    let {size, bonuses, view} = boardOptions;

    let fieldSVG =
      `<svg xmlns='http://www.w3.org/2000/svg' height="100%" width="100%">
        <rect height="100%" width="100%"></rect>
      </svg>`;

    let templatePattern = options => {
      let {element, attributes} = options;
      let {id, className} = view[element];
      // let id  = viewOptions[element].id;
      // let className = viewOptions[element].className;
      let templates = {
        idClassName: (inner, i) => `<div id="${id}-${i}" class="${className}">
                                ${inner}
                              </div>`,
        className: (inner) => `<div class="${className}">
                                ${inner}
                              </div>`,
        idClassNameMod: (inner, i, mod) => `<div id="${id}-${i}" class="${className} ${className}--${mod}">
                                ${inner}
                              </div>`,
        classNameMod: (inner, mod) => `<div class="${className} ${className}--${mod}">
                                ${inner}
                              </div>`,
        id: (inner, i) => `<div id="${id}-i">
                                ${inner}
                              </div>`
      };
      return templates[attributes];
    };

    let prepareBoard = () => {
      let fieldTemplate = templatePattern({element: "field", attributes: "idClassNameMod"});
      let rowTemplate = templatePattern({element: "row", attributes: "idClassName"});
      let boardTemplate = templatePattern({element: "board", attributes: "idClassName"});

      let fields = "";
      let rows = "";
      let board = "";

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          let bonus = boardService.fields[i][j].bonus;
            fields += fieldTemplate(fieldSVG, `${i}-${j}`, bonus);
        }
        rows += rowTemplate(fields, i);
        fields = "";
      }
      return boardTemplate(rows, 1);
    };

    return {
      // template: "<div>dupa</div>"
      template: prepareBoard()
    };
  }
]);
