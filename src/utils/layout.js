const fs = require("fs");
const {parse} = require("node-html-parser");

exports.loadLayout = (filePath) => {
    return new Promise ( (resolve, reject ) => {
        fs.readFile(filePath, async (err, content) => {
            if (err) {
                return reject(err);
            }

            resolve(content.toString());
        });
    })
}

exports.renderLayout = (layout, view, target) => {
    let virtualDOM = parse(layout);
    let targetElement = virtualDOM.querySelector(target);
    targetElement.set_content(view);
    return virtualDOM.outerHTML;
}