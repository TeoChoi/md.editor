
class PreviewManager {

    constructor(panel, format, preview, options) {
        this.panel = panel;
        this.format = format;
        this.preview = preview;

        this.maxDelay = 3000;

        this.registerEvents(this.panel.input, () => this.applyTimeout());
        this.makePreviewHtml();
        this.panel.preview.scrollTop = 0;
    }

    registerEvents(input, listener) {
        $(input).on('keypress keydown input drop paste', listener);
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

        // 文本没有变化,不进行下一步的操作
        if (text && text == this.oldInputText) {
            return;
        }
        else {
            this.oldInputText = text;
        }

        let prevTime = new Date().getTime();

        let html = this.format.getPreviewHtml();

        // 计算转换Html的时间, 这个时间用于时间监听的延迟时间
        let currTime = new Date().getTime();
        this.elapsedTime = currTime - prevTime;

        this.preview.setHtml(html);

        this.preview.run();

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

        if (code.length == 1 && pre.length == 1) {
            this.panel.preview.scrollTop += pre.position().top;
            pre.scrollTop(cur.position().top - cur.outerHeight() - (pre.outerHeight(true) - pre.outerHeight()) / 2);
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
        let pos = cur.position().top + cur.outerHeight();
        if (pos < this.panel.preview.clientHeight && cur.position().top > 0) {
            return;
        }
        this.panel.preview.scrollTop = this.panel.preview.scrollTop + cur.position().top;
    }
}

export {PreviewManager};