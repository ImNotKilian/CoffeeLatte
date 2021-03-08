const evalUtils = require("./evaluation.utils");
const contentUtils = require("./content.utils");

exports.evaluateBlocks = async(content, locals) => {
    let blocks = contentUtils.spliceBlocks(content);

    for (let block of blocks) {
        let evaluation = await evalUtils.evaluateBlock(block, locals);
        content = content.replace(block.outter, evaluation.result);
        locals = evaluation.locals;
    }

    return { content, locals }
}