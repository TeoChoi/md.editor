import {MdEditor} from "./src/MdEditor";

let e = new MdEditor("wmd-panel", {
    strings: [],        // 数组编辑器使用的,参考defaultString
    highlight: true,
    flowchart: true
});

e.run();



