import {MdEditor} from "./src/MdEditor";
require("jquery");
require("bootstrap");
let e = new MdEditor("md-text", {
    strings: [],        // 数组编辑器使用的,参考defaultString
    highlight: true,
    flowchart: true,
    // enablePreview: false,
    height: "100%",
    uploadUrl:"./upload.json"
});

e.run();



