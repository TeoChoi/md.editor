import {Preview} from "./src/Preview";

let p = new  Preview(document.getElementById("md-preview"), {
    highlight: true,
    flowchart:true
});

p.run();



