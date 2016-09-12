let hljs = require("bundle?lazy!highlight.js/lib/highlight.js");
let hljscss = require("bundle?lazy!highlight.js/styles/atom-one-dark.css");
let raphael = require("bundle?lazy!raphael");
let flowchart = require("bundle?lazy!flowchart.js");

class Preview {

    constructor(preview, options) {
        this.preview = preview;
        this.options = options;
    }

    run() {
        this.runHighlight();
        this.runFlowchart();
    }

    setHtml(html) {
        $(this.preview).find(".preview").html(html);
    }

    /**
     * 执行高亮
     */
    runHighlight() {
        let codes = $(this.preview).find('pre code[class!=flow]');

        if(this.options.highlight && codes.length) {
            hljs((hljs) => {
                hljscss(() => {});
                codes.each(function (i, code) {
                    let className = $(this).attr('class');

                    if (className && className.split(' ').length) {
                        className = className.split(' ')[0];
                        try {
                            let lang = require("bundle!highlight.js/lib/languages/" + className);
                            lang((module) => {
                                hljs.registerLanguage(className, module);
                                hljs.highlightBlock(code);
                            })
                        } catch (err) {
                            hljs.highlightBlock(code);
                        }
                    } else {
                        hljs.highlightBlock(code);
                    }
                })
            });
        }
    }

    /**
     * 执行flow
     */
    runFlowchart() {
        let charts = $(this.preview).find("code.flow");
        if (this.options.flowchart && charts.length) {
            charts.each(function (i, code) {
                flowchart(() => {
                    $(this).parent('pre').css({"overflow": "visible", "max-height": "none"});
                    $(this).flowChart();
                })
            })
        }
    }
}

export {Preview};