exports.spliceBlocks = (content) => {
    let spliced = content.split("{{");
    let unWrappedBlocks = [];
    let wrappedBlocks = [];

    for (let item of spliced) {
        if (item.includes("}}")) {
            unWrappedBlocks.push(item.split("}}")[0]);
        }
    }

    for (let unwrapped of unWrappedBlocks) {
        let block = {
            type: (unwrapped.includes("\n") ? "block" : "embed"),
            content: unwrapped,
            outter: "{{" + unwrapped + "}}"
        }

        wrappedBlocks.push(block);
    }

    return wrappedBlocks;
}