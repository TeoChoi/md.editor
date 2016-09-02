import {MdEditor} from "./src/MdEditor";

let e = new MdEditor("md-text", {
    strings: [],        // 数组编辑器使用的,参考defaultString
    highlight: true,
    flowchart: true,
    // enablePreview: false,
    uploadUrl:"./upload.json"
});

e.run();



