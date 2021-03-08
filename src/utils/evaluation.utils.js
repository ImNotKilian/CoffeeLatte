exports.evaluateBlock = async (block, locals = {}) => {
    let prints = [];
    let props = locals.props || {};

    // Utils function for evaluation
    const print = (content) => {
        prints.push(content);
    }

    const get = (localKey, defaultValue) => {
        return locals[localKey] || defaultValue
    }

    // Evaluate code
    let evaluated = await eval(block.content);
    locals.props = props;

    if (block.type == "block") {
        return { result: prints.join(""), locals }
    } else {
        return { result: evaluated, locals };
    }
}