const fs = require("fs");
const path = require("path");
const {parse} = require("node-html-parser");

exports.loadComponents = (directory) => {
    return new Promise( async (resolve, reject) => {
        let components = [];
        let componentFiles = [];

        fs.readdirSync(directory).forEach(file => {
            if (file.endsWith(".component.html") || file.endsWith(".component.latte")) {
                componentFiles.push(file);
            }
        });

        for (let file of componentFiles) {
            fs.readFile(path.join(directory, file), (err, content) => {
                if (err) {
                    throw err;
                }

                components.push({
                    name: file.split(".component.")[0].replace(file[0], file[0].toUpperCase()),
                    content: content.toString()
                });

                if (componentFiles.length == components.length) {
                    resolve(components);
                }
            })
        }
    })
}

exports.renderComponents = (components = [], content) => {
    let dom = parse(content);
    for (let component of components) {
        let elements = dom.querySelectorAll(component.name);
        for (let e of elements) {
            let codeBlock = "{{\n props = {};";
            let attributes = e.attributes
            let keys = Object.keys(e.attributes);

            for (let key of keys) {
                codeBlock = codeBlock + `props["${key}"] = "${attributes[key]}";\n`
            }

            codeBlock = codeBlock + "}}";

            e.set_content(codeBlock + component.content);
        }
    }

    return dom.outerHTML;
}