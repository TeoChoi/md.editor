import {TextAreaState} from "./TextAreaState";

let D = require("diff-match-patch");

class Format
{
    constructor(input, options) {
        this.input = input;
        this.converter = options.converter;

        this.oldHtml = "";
        this.specialString = "MDEditorSpecialString";
    }

    getHtml() {
        return this.converter.makeHtml(this.input.value);
    }

    getPreviewHtml() {
        let html = this.getHtml()

        if (html != "") {
            html = this.insertCursor(html);
        }
        return this.handlerCursor(html);
    }
    // 插入光标
    insertCursor(html) {
        let d = new D();
        let diffs = d.diff_main(this.oldHtml, html);
        this.oldHtml = html;
        let chunk = [];
        let r = /(<[^>]*$)/;
console.log(diffs);
        for (let i in diffs) {
            let type = diffs[i][0], content = diffs[i][1];
            // 寻找不同,分为三种情况, 没有变化的部分, 新增加部分和删除的部分
            if (type == 0) {
                // 没有变化的部分就是直接添加到chunk中
                chunk.push(content);
            } else if (type == 1) {
                // 如果是新增的就要判断,该部分是否是一个截断的标签
                // 判断是否是在标签内部, 如果是,光标符迁移到"<"符号前边
                if (r.test(content)) {
                    chunk.push(content.replace(r, this.specialString + "$1"));
                } else {
                    chunk.push(content + this.specialString);
                }
            } else {
                // 如果删除部分是含有未结束的标签, 证明上一个元素中含有另外一半标签符号, 进行操作
                if (r.test(content)) {
                    chunk[i - 1] = chunk[i - 1].replace(r, this.specialString + "$1");
                } else {
                    chunk.push(this.specialString);
                }
            }
        }
console.log(chunk);
        return chunk.join("");
    }

    /**
     * 处理光标处文本
     * @param html
     * @returns {string|XML|void|*}
     */
    handlerCursor(html) {
        // 一种变化是破坏了标签

        // 是否在标签内部
        let regexp = new RegExp('(<[^>]*)(' + this.specialString + ')([^<]*>)');
        if (regexp.test(html)) {
            html = html.replace(regexp, "$2$1$3")
                .replace(regexp, "$1$3");
        }

        if (html)
            html = html.replace(this.specialString, "<span class='cursor'></span>")
                .replace(new RegExp(this.specialString, 'g'), "");

        return html;
    }
}

export {Format};