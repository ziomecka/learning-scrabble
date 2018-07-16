import path from "path";
import fs from "fs";

module.exports = (p, Plugin, call) => {
  if (p !== null && p !== undefined) {
    let result = [];

    let iterator = 1;

    let isDir = (pp, callback) => {
      fs.readdir(path.join(pp), (err, files) => {
        if (err) {
          iterator--;
          let regexp = /^(?!((.*)?index)).*\.pug$/;
          if (path.extname(pp) === ".pug" && regexp.test(pp)) {
            let template = pp.split(path.sep).splice(1).join(path.sep);
            let filename = (() => {
              let r = path.dirname(pp).split(path.sep);
              let result = [];
              for (let i = 0; i <= 1; i++) {
                result.unshift(r.pop());
              }
              return `${result.join(".")}.html`;
            })();
            result.push(new Plugin({
              "template": template,
              "filename": filename,
              "inject": false
            }));
          }
          if (iterator === 0) {
            return call(result);
          }
          return false;
        }
        else {
          iterator += files.length - 1;
          if (callback) {
            callback(pp, files);
          } else {
            return files;
          }
        }
      });
    }

    let loopFiles = (p, files) => {
      Array.from(Object(files)).forEach(file => {
        let newPath = path.join(p, file);
        isDir(newPath, loopFiles);

      });
    }
    loopFiles(p, isDir(p, loopFiles));
  }
};
