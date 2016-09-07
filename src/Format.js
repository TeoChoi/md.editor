import {TextAreaState} from "./TextAreaState";

class Format
{
    constructor(input, options) {
        this.input = input;
        this.converter = options.converter;
    }

    getHtml() {
        return this.converter.makeHtml(this.input.value);
    }

    getPreviewHtml() {
        let text = this.insertCursor();

        let html = this.converter.makeHtml(text);

        return this.handlerCursor(html);
    }

    /**
     * 插入光标
     * @returns {*}
     */
    insertCursor() {
        let chunk = (new TextAreaState(this.input, true)).getChunk();
        // 判断分割线
        let line = chunk.before.match(/.*$/)[0] + chunk.after.match(/^.*/)[0];
        if (line.length > 2 && (/^-+/.test(line) || /^`{3}[a-zA-Z]*$/.test(line))) {
            chunk.before = chunk.before.replace(/(.*$)/, this.specialString + "\n$1");
            return chunk.before + chunk.selection + chunk.after;
        }

        // 判断是否在图片中
        if (/!\[[^\]]*?$/.test(chunk.before) && /^[^\[]*\]/.test(chunk.after)) {
            chunk.before = chunk.before.replace(/(!\[[^\]]*?$)/, this.specialString + "$1");
            return chunk.before + chunk.selection + chunk.after;
        }

        return chunk.before + chunk.selection + this.specialString + chunk.after;
    }

    /**
     * 处理光标处文本
     * @param html
     * @returns {string|XML|void|*}
     */
    handlerCursor(html) {
        // 是否在标签内部
        let regexp = new RegExp('(<[^>]*)(' + this.specialString + ')([^<]*>)');
        if (regexp.test(html)) {
            html = html.replace(regexp, "$2$1$3")
                .replace(regexp, "$1$3");
        }
        // 如果跑到了h2中,应该是hr的
        regexp = new RegExp('<h2>(' + this.specialString + ")</h2>");
        if (regexp.test(html)) {
            html = html.replace(regexp, "$1<hr/>")
        }
        if (html)
            html = html.replace(this.specialString, "<span class='cursor'></span>");

        return html;
    }
}

export {Format};