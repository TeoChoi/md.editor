class util {

    /**
     * 判断元素的
     * @param element
     * @returns {*|jQuery}
     */
    static isVisible(element) {
        return $(element).is(":visible");
    }

    /**
     * 将"\r\n"或者"\r" 转化为"\n"
     * @param text
     * @returns string
     */
    static fixEolChars(text) {
        return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }

    /**
     * 给定一个正则表达式,增加前缀或者后缀,生成一个新的表达式返回
     * @param regex
     * @param pre
     * @param post
     * @returns {RegExp}
     */
    static extendRegExp(regex, pre, post) {
        if (pre === null || pre === undefined) {
            pre = "";
        }
        if (post === null || post === undefined) {
            post = "";
        }

        let pattern = regex.toString();
        let flags;

        // 使用flags变量存储匹配模式
        pattern = pattern.replace(/\/([gim]*)$/, function (wholeMatch, flagsPart) {
            flags = flagsPart;
            return "";
        });

        // 删除斜线分隔符的正则表达式。
        pattern = pattern.replace(/(^\/|\/$)/g, "");
        pattern = pre + pattern + post;

        return new RegExp(pattern, flags);
    }
}

class position {
    static getTop(element) {
        return $(element).offset().top;
    }

    static getHeight(element) {
        return $(element).outerHeight();
    }

    static getWidth(element) {
        return $(element).outerWidth();
    }
}

export {util, position}