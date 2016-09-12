import {util} from "./Utils";

/**
 * 模块操作
 */
class Chunk {

    /**
     * 使用正则表达是,找到对应的标签
     * @param startRegex    一个正则表达式去匹配开始的标签
     * @param endRegex      一个正则表达式去匹配结束的标签
     */
    findTags(startRegex, endRegex) {
        let regex;

        if (startRegex) {
            regex = util.extendRegExp(startRegex, "", "$");

            this.before = this.before.replace(regex, (match) => {
                this.startTag = this.startTag + match;
                return "";
            });

            regex = util.extendRegExp(startRegex, "^", "");

            this.selection = this.selection.replace(regex, (match) => {
                this.startTag = this.startTag + match;
                return "";
            })
        }

        if (endRegex) {
            regex = util.extendRegExp(endRegex, "", "$");

            this.selection = this.selection.replace(regex, (match) => {
                this.endTag = match + this.endTag;
                return "";
            });

            regex = util.extendRegExp(endRegex, "^", "");

            this.after = this.after.replace(regex, (match) => {
                this.endTag = match + this.endTag;
                return "";
            });
        }
    }

    /**
     * 如果 参数为true,那么移除选择区域前后的空格
     * 如果为false 空格就会转移到选择光标的前后
     * @param remove
     */
    trimWhitespace(remove) {
        let beforeReplacer, afterReplacer;
        if (remove) {
            beforeReplacer = afterReplacer = "";
        } else {
            beforeReplacer = (s) => {
                this.before += s;
                return "";
            };
            afterReplacer = (s) => {
                this.after = s + this.after;
                return "";
            };
        }

        this.selection = this.selection.replace(/^(\s*)/, beforeReplacer).replace(/(\s*)$/, afterReplacer);
    }

    skipLines(nLinesBefore, nLinesAfter, findExtraNewlines) {
        if (nLinesBefore === undefined) {
            nLinesBefore = 1;
        }

        if (nLinesAfter === undefined) {
            nLinesAfter = 1;
        }

        nLinesBefore++;
        nLinesAfter++;

        let regexText;
        let replacementText;

        if (navigator.userAgent.match(/Chrome/)) {
            "X".match(/()./);
        }

        this.selection = this.selection.replace(/(^\n*)/, "");

        this.startTag = this.startTag + RegExp.$1;

        this.selection = this.selection.replace(/(\n*$)/, "");
        this.endTag = this.endTag + RegExp.$1;
        this.startTag = this.startTag.replace(/(^\n*)/, "");
        this.before = this.before + RegExp.$1;
        this.endTag = this.endTag.replace(/(\n*$)/, "");
        this.after = this.after + RegExp.$1;

        if (this.before) {

            regexText = replacementText = "";

            while (nLinesBefore--) {
                regexText += "\\n?";
                replacementText += "\n";
            }

            if (findExtraNewlines) {
                regexText = "\\n*";
            }
            this.before = this.before.replace(new RegExp(regexText + "$", ""), replacementText);
        }

        if (this.after) {

            regexText = replacementText = "";

            while (nLinesAfter--) {
                regexText += "\\n?";
                replacementText += "\n";
            }
            if (findExtraNewlines) {
                regexText = "\\n*";
            }

            this.after = this.after.replace(new RegExp(regexText, ""), replacementText);
        }
    }
}

export {Chunk}