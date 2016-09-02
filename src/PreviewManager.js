let hljs = require("bundle?lazy!highlight.js/lib/highlight.js");
let hljscss = require("bundle?lazy!highlight.js/styles/atom-one-dark.css");
let raphael = require("bundle?lazy!raphael");
let flowchart = require("bundle?lazy!flowchart.js");

class PreviewManager {

    constructor(panel, options) {
        this.panel = panel;
        this.format = options.format;
        this.maxDelay = 3000;
        this.specialString = "MDEditorSpecialString";
        this.highlight = options.highlight;
        this.flowchart = options.flowchart;

        this.registerEvents(this.panel.input, () => this.applyTimeout());
        this.makePreviewHtml();
        this.panel.preview.scrollTop = 0;
    }

    registerEvents(input, listener) {
        $(input).bind('input paste drop keypress keydown', listener);
    }

    refresh(requiresRefresh) {
        if (requiresRefresh) {
            this.oldInputText = "";
            this.makePreviewHtml();
        }
        else {
            this.applyTimeout();
        }
    }

    applyTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        let delay = this.elapsedTime;

        if (delay > this.maxDelay) {
            delay = this.maxDelay;
        }

        this.timeout = setTimeout(() => this.makePreviewHtml(), delay);
    };

    makePreviewHtml() {
        let text = this.panel.input.value;

        if (text && text == this.oldInputText) {
            return; // 文本没有变化,不进行下一步的操作
        }
        else {
            this.oldInputText = text;
        }

        let prevTime = new Date().getTime();

        text = this.format.getPreviewHtml();

        // 计算转换Html的时间, 这个时间用于时间监听的延迟时间
        let currTime = new Date().getTime();
        this.elapsedTime = currTime - prevTime;

        $(this.panel.preview).html(text);

        this.afterPreview();

        this.setPreviewScrollTops();
    }

    /**
     * 设置预览滚动
     */
    setPreviewScrollTops() {
        let cur = $('.cursor'), code = cur.parent('code'), pre = code.parent('pre');

        if (cur.length == 0) {
            return;
        }

        if (code.length == 1 ) {
            this.panel.preview.scrollTop += pre.position().top;
            pre.scrollTop((pre.height() - pre.innerHeight()) / 2 + pre.scrollTop() + cur.position().top);
            return;
        }

        if (cur.parent('p').length != 0) {
            cur.parent('p').addClass('diff');
            if (this.t)
                clearTimeout(this.t);

            this.t = setTimeout(() => {
                cur.parent('p').removeAttr("class");
            }, 3000);
        }


        if (cur.position().top < this.panel.preview.clientHeight && cur.position().top > 0) {
            return;
        }
        this.panel.preview.scrollTop = this.panel.preview.scrollTop + cur.position().top;
    }

    afterPreview() {
        this.runHighlight();
        this.runFlowchart();
    }

    /**
     * 执行高亮
     */
    runHighlight() {
        if(this.highlight && $('code[class!=flow]').length) {
            hljs((hljs) => {
                hljscss(() => {});
                $('code').each(function (i, code) {
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
        if (this.flowchart && $("code.flow").length) {
            $("code.flow").each(function (i, code) {
                flowchart(() => {
                    $(this).parent('pre').css({"overflow": "visible", "max-height": "none"});
                    $(this).flowChart();
                })
            })
        }
    }
}

export {PreviewManager};