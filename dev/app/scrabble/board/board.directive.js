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
        let firstRowTemplate = templatePattern({element: "firstRow", attributes: "className"});
        let descriptionFieldTemplate = templatePattern({element: "descriptionField", attributes: "className"});
        let fieldTemplate = templatePattern({element: "field", attributes: "idClassNameMod"});
        let rowTemplate = templatePattern({element: "row", attributes: "idClassName"});
        let boardTemplate = templatePattern({element: "board", attributes: "idClassName"});

        let fields = "";
        let rows = "";
        let board = "";

        /** Prepare the first row with letters. */
        let charCode = 97;
        fields += descriptionFieldTemplate("");
        for (let j = 0; j < size; j++) {
          fields += descriptionFieldTemplate(String.fromCharCode(charCode++));
        }

        rows += firstRowTemplate(fields);

        for (let i = 0; i < size; i++) {
          /** Prepare the first column with numbers. */
          fields = descriptionFieldTemplate(i + 1);
          for (let j = 0; j < size; j++) {
            let bonus = boardService.fields[i][j].bonus;
              fields += fieldTemplate(fieldSVG, `${i}-${j}`, bonus);
          }
          rows += rowTemplate(fields, i);
        }
        return boardTemplate(rows, 1);
      };

      return {
        template: prepareBoard()
      };
    }
  ]);
