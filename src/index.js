const Renderer = require("./renderer");

// For express.js
exports.express = (app, config) => {
    let handler = new Renderer(config || {
        layout: app.get("layout"),
        components: app.get("components"),
        target: app.get("target")
    });

    let engine = async (filePath, options, callback) => {
        let error = null;
        let rendered = await handler.byFile(filePath, options).catch((e) => { error = e });
        return callback(error, rendered);
    }

    app.engine("latte", engine);
    app.set("view engine", "latte");
    
    return engine;
}

// Render a File by path
exports.renderFile = (filePath, config) => {
    let handler = new Renderer(config || {});
    return handler.byFile(filePath);
}

// Render a String
exports.renderString = (content, config) => {
    let handler = new Renderer(config || {});
    return handler.byString(content);
}