const fs = require("fs");
const layoutUtils = require("./utils/layout");
const renderUtils = require("./utils/render.utils");
const componentLoader = require("./components");
const error = require("./error");

const defaultConfig = {}

class Renderer {
    constructor (config) {
        this.config = config;

        this.setup();
    }

    async setup () {
        let error = null;
        if (this.getConfig("layout") != null) {
            this.layout = await layoutUtils.loadLayout(this.getConfig("layout")).catch((e) => {
                error = e;
            });
        }

        if (this.getConfig("components") != null) {
            this.components = await componentLoader.loadComponents(this.getConfig("components")).catch((e) => {
                error = e;
            });
        }

        this.error = error;
    }

    byFile (filePath, options) {
        return new Promise ( (resolve, reject ) => {
            fs.readFile(filePath, async (err, content) => {
                if (err) {
                    reject(err);
                }
    
                let rendered = await this.byString(content.toString(), options).catch((e) => {
                    err = e;
                });

                if (err) {
                    reject (err);
                } else {
                    resolve(rendered);
                }
            });
        })
    }

    byString (content, locals = {}) {
        return new Promise ( async (resolve, reject) => {
            try {
                // Throw if error
                if (this.error != null) {
                    throw this.error;
                }
                
                // Renderize layout
                if (this.layout != null) {
                    content = layoutUtils.renderLayout(this.layout, content, this.getConfig("target"));
                }

                // Evaluate blocks
                let render = await renderUtils.evaluateBlocks(content, locals);
                content = render.content; 
                locals = render.locals;
     
                // Renderize components
                content = componentLoader.renderComponents(this.components, content);

                // Re-Evaluate blocks
                render = await renderUtils.evaluateBlocks(content, locals);
                content = render.content; 
                locals = render.locals;

                resolve(content);
            } catch (e) {
                if (process.env.NODE_ENV == "production") {
                    reject(e);
                } else {
                    resolve(error.renderError(e));
                }
            }
        })
    }

    getConfig (key) {
        return this.config[key] || defaultConfig[key];
    }
}



module.exports = Renderer;