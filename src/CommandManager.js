let SETTINGS = {lineLength: 72};

/**
 * 命令管理
 */
class CommandManager {
    constructor(getString) {
        this.getString = getString;
        // 匹配markdown前缀符号, 四个空格是代码, > 这个符号的是引用模块,等等
        this.prefixes = "(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)";
    }

    /**
     * 从选择的部分移除markdown的符号
     * @param chunk
     */
    unwrap(chunk) {
        let txt = new RegExp("([^\\n])\\n(?!(\\n|" + this.prefixes + "))", "g");
        chunk.selection = chunk.selection.replace(txt, "$1 $2");
    }

    wrap(chunk, length) {
        this.unwrap(chunk);
        let regex = new RegExp("(.{1," + length + "})( +|$\\n?)", "gm"),
            that = this;

        chunk.selection = chunk.selection.replace(regex, (line, marked) => {
            if (new RegExp("^" + that.prefixes, "").test(line)) {
                return line;
            }
            return marked + "\n";
        });

        chunk.selection = chunk.selection.replace(/\s+$/, "");
    }

    doBold(chunk, postProcessing) {
        return this.doBorI(chunk, postProcessing, 2, this.getString("boldexample"));
    }

    doItalic(chunk, postProcessing) {
        return this.doBorI(chunk, postProcessing, 1, this.getString("italicexample"));
    }

    doBorI(chunk, postProcessing, nStars, insertText) {
        // Get rid of whitespace and fixup newlines.
        chunk.trimWhitespace();
        chunk.selection = chunk.selection.replace(/\n{2,}/g, "\n");

        // 查看前后是否已经有markdown标记元素
        let starsBefore = /(\**$)/.exec(chunk.before)[0];
        let starsAfter = /(^\**)/.exec(chunk.after)[0];
        let prevStars = Math.min(starsBefore.length, starsAfter.length);

        // 如果该按钮是一个切换的功能, 则删除星号, 另一次点击则是添加 星号
        if ((prevStars >= nStars) && (prevStars != 2 || nStars != 1)) {
            chunk.before = chunk.before.replace(RegExp("[*]{" + nStars + "}$", ""), "");
            chunk.after = chunk.after.replace(RegExp("^[*]{" + nStars + "}", ""), "");
        }
        else if (!chunk.selection && starsAfter) {
            // 这段代码不是必要的, 只不过为了清除一些垃圾的符号罢了
            chunk.after = chunk.after.replace(/^([*_]*)/, "");
            chunk.before = chunk.before.replace(/(\s?)$/, "");
            let whitespace = RegExp.$1;
            chunk.before = chunk.before + starsAfter + whitespace;
        }
        else {
            // 如果你没有选择任何文本, 点击该按钮之后,就会生成一个带有星号的文本
            if (!chunk.selection && !starsAfter) {
                chunk.selection = insertText;
            }

            // 添加标记
            let markup = nStars <= 1 ? "*" : "**";
            chunk.before = chunk.before + markup;
            chunk.after = markup + chunk.after;
        }
    }

    /**
     * 自动缩进功能
     * @param chunk
     * @param postProcessing
     */
    doAutoIndent(chunk, postProcessing) {
        let fakeSelection = false;

        chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]*\n$/, "\n\n");
        chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}>[ \t]*\n$/, "\n\n");
        chunk.before = chunk.before.replace(/(\n|^)[ \t]+\n$/, "\n\n");

        // 没有选择区域,光标不是在如下行的结束位置:
        // 列表、代码、引用
        // 那么将光标以后的部分当成是临时选择区域
        if (!chunk.selection && !/^[ \t]*(?:\n|$)/.test(chunk.after)) {
            chunk.after = chunk.after.replace(/^[^\n]*/, (wholeMatch) => {
                chunk.selection = wholeMatch;
                return "";
            });
            fakeSelection = true;
        }
        // 匹配列表
        if (/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]+.*\n$/.test(chunk.before)) {
            if (this.doList) {
                this.doList(chunk);
            }
        }
        // 匹配引用
        if (/(\n|^)[ ]{0,3}>[ \t]+.*\n$/.test(chunk.before)) {
            if (this.doBlockQuote) {
                this.doBlockQuote(chunk);
            }
        }
        // 匹配代码段
        if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
            if (this.doCode) {
                this.doCode(chunk);
            }
        }

        if (fakeSelection) {
            chunk.after = chunk.selection + chunk.after;
            chunk.selection = "";
        }
    }

    /**
     * 当回车的时候,判断是否缩进
     * @param chunk
     * @param postProcessing
     */
    doIndent(chunk, postProcessing) {
        let regex = /(\n|^)([ ]{4,})(.*)$/;

        if (regex.test(chunk.before))
            chunk.before += "\n" + chunk.before.match(regex)[2];
        else
            chunk.before += "\n";
    }

    /**
     * 引用模块
     * @param chunk
     * @param postProcessing
     */
    doBlockQuote(chunk, postProcessing) {
        chunk.selection = chunk.selection.replace(/^(\n*)([^\r]+?)(\n*)$/, (totalMatch, newlinesBefore, text, newlinesAfter) => {
            chunk.before += newlinesBefore;
            chunk.after = newlinesAfter + chunk.after;
            return text;
        });

        chunk.before = chunk.before.replace(/(>[ \t]*)$/, (totalMatch, blankLine) => {
            chunk.selection = blankLine + chunk.selection;
            return "";
        });

        chunk.selection = chunk.selection.replace(/^(\s|>)+$/, "");
        chunk.selection = chunk.selection || this.getString("quoteexample");

        let match = "",
            leftOver = "",
            line;
        if (chunk.before) {
            let lines = chunk.before.replace(/\n$/, "").split("\n");
            let inChain = false;
            for (let i = 0; i < lines.length; i++) {
                let good = false;
                line = lines[i];
                inChain = inChain && line.length > 0; // c) any non-empty line continues the chain
                if (/^>/.test(line)) {                // a)
                    good = true;
                    if (!inChain && line.length > 1)  // c) any line that starts with ">" and has at least one more character starts the chain
                        inChain = true;
                } else if (/^[ \t]*$/.test(line)) {   // b)
                    good = true;
                } else {
                    good = inChain;                   // c) the line is not empty and does not start with ">", so it matches if and only if we're in the chain
                }
                if (good) {
                    match += line + "\n";
                } else {
                    leftOver += match + line;
                    match = "\n";
                }
            }
            if (!/(^|\n)>/.test(match)) {             // d)
                leftOver += match;
                match = "";
            }
        }

        chunk.startTag = match;
        chunk.before = leftOver;

        if (chunk.after) {
            chunk.after = chunk.after.replace(/^\n?/, "\n");
        }

        chunk.after = chunk.after.replace(/^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/, (totalMatch) => {
                chunk.endTag = totalMatch;
                return "";
            }
        );

        let replaceBlanksInTags = (useBracket) => {

            let replacement = useBracket ? "> " : "";

            if (chunk.startTag) {
                chunk.startTag = chunk.startTag.replace(/\n((>|\s)*)\n$/, (totalMatch, markdown) => {
                    return "\n" + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + "\n";
                });
            }
            if (chunk.endTag) {
                chunk.endTag = chunk.endTag.replace(/^\n((>|\s)*)\n/, (totalMatch, markdown) => {
                    return "\n" + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + "\n";
                });
            }
        };

        if (/^(?![ ]{0,3}>)/m.test(chunk.selection)) {
            this.wrap(chunk, SETTINGS.lineLength - 2);
            chunk.selection = chunk.selection.replace(/^/gm, "> ");
            replaceBlanksInTags(true);
            chunk.skipLines();
        } else {
            chunk.selection = chunk.selection.replace(/^[ ]{0,3}> ?/gm, "");
            this.unwrap(chunk);
            replaceBlanksInTags(false);

            if (!/^(\n|^)[ ]{0,3}>/.test(chunk.selection) && chunk.startTag) {
                chunk.startTag = chunk.startTag.replace(/\n{0,2}$/, "\n\n");
            }

            if (!/(\n|^)[ ]{0,3}>.*$/.test(chunk.selection) && chunk.endTag) {
                chunk.endTag = chunk.endTag.replace(/^\n{0,2}/, "\n\n");
            }
        }

        if (!/\n/.test(chunk.selection)) {
            chunk.selection = chunk.selection.replace(/^(> *)/, (wholeMatch, blanks) => {
                chunk.startTag += blanks;
                return "";
            });
        }
    }

    /**
     * 代码模块
     * @param chunk
     * @param postProcessing
     */
    doCode(chunk, postProcessing) {
        let hasTextBefore = /\S[ ]*$/.test(chunk.before);
        let hasTextAfter = /^[ ]*\S/.test(chunk.after);

        // 光标前后没有任何字符 使用四个空格匹配当前选择行或者多行
        if ((!hasTextAfter && !hasTextBefore) || /\n/.test(chunk.selection)) {

            chunk.before = chunk.before.replace(/[ ]{4}$/, (totalMatch) => {
                chunk.selection = totalMatch + chunk.selection;
                return "";
            });

            let nLinesBack = 1;
            let nLinesForward = 1;

            if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
                nLinesBack = 0;
            }

            if (/^\n(\t|[ ]{4,})/.test(chunk.after)) {
                nLinesForward = 0;
            }

            chunk.skipLines(nLinesBack, nLinesForward);

            if (!chunk.selection) {
                chunk.startTag = "```\n";
                chunk.selection = this.getString("codeexample");
                chunk.endTag = "\n```";
            }
            else {
                if (/^[ ]{0,3}\S/m.test(chunk.selection)) {
                    if (/\n/.test(chunk.selection))
                        chunk.selection = chunk.selection.replace(/^/gm, "    ");
                    else // if it's not multiline, do not select the four added spaces; this is more consistent with the doList behavior
                        chunk.before += "    ";
                }
                else {
                    chunk.selection = chunk.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t)/gm, "");
                }
            }
        }
        else {
            // 使用 (`) 限定边界
            chunk.trimWhitespace();
            chunk.findTags(/`/, /`/);
            if (!chunk.startTag && !chunk.endTag) {
                chunk.startTag = chunk.endTag = "`";
                if (!chunk.selection) {
                    chunk.selection = this.getString("codeexample");
                }
            }
            else if (chunk.endTag && !chunk.startTag) {
                chunk.before += chunk.endTag;
                chunk.endTag = "";
            }
            else {
                chunk.startTag = chunk.endTag = "";
            }
        }
    }

    doList(chunk, postProcessing, isNumberedList) {
        // 一般都是一样的, 除了一些特殊的开始和结束,可以使用正则表达式,能够看得更清楚些
        let previousItemsRegex = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
        let nextItemsRegex = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;

        // 默认的符号是破折号,当然使用其他的也是可以的, 没有特定的html符号, 这仅仅是个markdown符号
        let bullet = "-";

        // 如果数字列表, 初始化数值
        let num = 1;

        // 获取列表前缀 - 例如:" 1. " 数字列表, " - " 普通列表
        let getItemPrefix = () => {
            let prefix;
            if (isNumberedList) {
                prefix = " " + num + ". ";
                num++;
            }
            else {
                prefix = " " + bullet + " ";
            }
            return prefix;
        };

        // 修复一下列表的前缀
        let getPrefixedItem = (itemText) => {
            // 当调用自动缩进功能的时候, 数字表示被重置
            if (isNumberedList === undefined) {
                isNumberedList = /^\s*\d/.test(itemText);
            }

            // 重新编号
            itemText = itemText.replace(/^[ ]{0,3}([*+-]|\d+[.])\s/gm, (_) => {
                return getItemPrefix();
            });

            return itemText;
        };

        chunk.findTags(/(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/, null);

        if (chunk.before && !/\n$/.test(chunk.before) && !/^\n/.test(chunk.startTag)) {
            chunk.before += chunk.startTag;
            chunk.startTag = "";
        }

        if (chunk.startTag) {

            let hasDigits = /\d+[.]/.test(chunk.startTag);
            chunk.startTag = "";
            chunk.selection = chunk.selection.replace(/\n[ ]{4}/g, "\n");
            this.unwrap(chunk);
            chunk.skipLines();

            if (hasDigits) {
                // Have to renumber the bullet points if this is a numbered list.
                chunk.after = chunk.after.replace(nextItemsRegex, getPrefixedItem);
            }
            if (isNumberedList == hasDigits) {
                return;
            }
        }

        let nLinesUp = 1;

        chunk.before = chunk.before.replace(previousItemsRegex, (itemText) => {
            if (/^\s*([*+-])/.test(itemText)) {
                bullet = RegExp.$1;
            }
            nLinesUp = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
            return getPrefixedItem(itemText);
        });

        if (!chunk.selection) {
            chunk.selection = this.getString("litem");
        }

        let prefix = getItemPrefix();

        let nLinesDown = 1;

        chunk.after = chunk.after.replace(nextItemsRegex, (itemText) => {
            nLinesDown = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
            return getPrefixedItem(itemText);
        });

        chunk.trimWhitespace(true);
        chunk.skipLines(nLinesUp, nLinesDown, true);
        chunk.startTag = prefix;
        let spaces = prefix.replace(/./g, " ");
        this.wrap(chunk, SETTINGS.lineLength - spaces.length);
        chunk.selection = chunk.selection.replace(/\n/g, "\n" + spaces);
    }

    doHeading(chunk, postProcessing) {
        // 删除前后空格
        chunk.selection = chunk.selection.replace(/\s+/g, " ");
        chunk.selection = chunk.selection.replace(/(^\s+|\s+$)/g, "");

        // 如果没有选择文本直接点击按钮的话, 仅仅增加head2
        if (!chunk.selection) {
            chunk.startTag = "## ";
            chunk.selection = this.getString("headingexample");
            chunk.endTag = " ##";
            return;
        }

        // 文本级别
        let headerLevel = 0;

        // 删除已经存在的heading 标记 并且保存级别
        chunk.findTags(/#+[ ]*/, /[ ]*#+/);
        if (/#+/.test(chunk.startTag)) {
            headerLevel = RegExp.lastMatch.length;
        }
        chunk.startTag = chunk.endTag = "";

        // 查找选中的文本下当前的级别,- 还是 =
        chunk.findTags(null, /\s?(-+|=+)/);
        if (/=+/.test(chunk.endTag)) {
            headerLevel = 1;
        }
        if (/-+/.test(chunk.endTag)) {
            headerLevel = 2;
        }

        // 跳一行
        chunk.startTag = chunk.endTag = "";
        chunk.skipLines(1, 1);

        // 查看当前级别,如果是2,则升级到1,如果是1,则消除级别
        let headerLevelToCreate = headerLevel == 0 ? 2 : headerLevel - 1;

        if (headerLevelToCreate > 0) {
            // 该功能只创建一级标题和二级标题
            let headerChar = headerLevelToCreate >= 2 ? "-" : "=";
            let len = chunk.selection.length;
            if (len > SETTINGS.lineLength) {
                len = SETTINGS.lineLength;
            }
            chunk.endTag = "\n";
            while (len--) {
                chunk.endTag += headerChar;
            }
        }
    }

    doLinkOrImage(chunk, postProcessing, isImage) {
        chunk.trimWhitespace();
        chunk.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\[.*?\])?/);

        if (chunk.endTag.length > 1 && chunk.startTag.length > 0) {
            chunk.startTag = chunk.startTag.replace(/!?\[/, "");
            chunk.endTag = "";
            this.addLinkDef(chunk, null);
        }
        else {
            chunk.selection = chunk.startTag + chunk.selection + chunk.endTag;
            chunk.startTag = chunk.endTag = "";

            if (/\n\n/.test(chunk.selection)) {
                this.addLinkDef(chunk, null);
                return;
            }

            let linkEnteredCallback = (link) => {
                if (link !== null) {
                    chunk.selection = (" " + chunk.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, "$1\\").substr(1);

                    let linkDef = " [999]: " + this._properlyEncoded(link);

                    let num = this.addLinkDef(chunk, linkDef);
                    chunk.startTag = isImage ? "![" : "[";
                    chunk.endTag = "][" + num + "]";

                    if (!chunk.selection) {
                        if (isImage) {
                            chunk.selection = this.getString("imagedescription");
                        }
                        else {
                            chunk.selection = this.getString("linkdescription");
                        }
                    }
                }

                postProcessing();
            };

            if (isImage) {
                this.dialog.image(this.getString("imagedialog"), linkEnteredCallback);
            }
            else {
                this.dialog.link(this.getString("linkdialog"), linkEnteredCallback);
            }
            return true;
        }
    }

    doHorizontalRule(chunk, postProcessing) {
        chunk.startTag = "----------\n";
        chunk.selection = "";
        chunk.skipLines(2, 1, true);
    }

    doTab(chunk, postProcessing, isShift) {
        let beforeRex = /.*$/;
        let afterRex = /^.*/;
        let process = (whole, $1, $2) => {
            if ($2.length < 4) {
                return $1;
            } else {
                return $1 + $2.replace(/[ ]{4}/, "");
            }
        };

        if (isShift) {
            // 不是选择的多行
            if (!/\n+/.test(chunk.selection)) {
                let regex = /(\n|^)([ ]+)$/;
                chunk.before = chunk.before.replace(regex, process)
            } else {
                chunk.selection = chunk.before.match(beforeRex)[0] + chunk.selection + chunk.after.match(afterRex)[0];

                chunk.before = chunk.before.replace(beforeRex, "");
                chunk.after = chunk.after.replace(afterRex, "");

                let regex = /(\n|^)([ ]+)/mg;

                chunk.selection = chunk.selection.replace(regex, process);
            }

        }else {
            // 不是选择的多行
            if (!/\n+/.test(chunk.selection)) {
                chunk.startTag = "    ";
            } else {
                chunk.selection = chunk.before.match(beforeRex)[0] + chunk.selection;
                chunk.before = chunk.before.replace(beforeRex, "");

                let regex = /(^|\n)(.+)/mg;

                chunk.selection = chunk.selection.replace(regex, "$1    $2");
            }

        }
    }

    _properlyEncoded(linkdef) {
        return linkdef.replace(/^\s*(.*?)(?:\s+"(.+)")?\s*$/, function (wholematch, link, title) {

            let inQueryString = false;

            link = link.replace(/%(?:[\da-fA-F]{2})|\?|\+|[^\w\d-./[\]]/g, function (match) {
                if (match.length === 3 && match.charAt(0) == "%") {
                    return match.toUpperCase();
                }
                switch (match) {
                    case "?":
                        inQueryString = true;
                        return "?";
                        break;
                    case "+":
                        if (inQueryString)
                            return "%20";
                        break;
                }
                return encodeURI(match);
            });

            if (title) {
                title = title.trim ? title.trim() : title.replace(/^\s*/, "").replace(/\s*$/, "");
                title = title.replace(/"/g, "quot;").replace(/\(/g, "&#40;").replace(/\)/g, "&#41;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
            return title ? link + ' "' + title + '"' : link;
        });
    }

    addLinkDef(chunk, linkDef) {
        let refNumber = 0, defsToAdd = {};
        // 查找并删除之前的连接标记
        chunk.before = this.stripLinkDefs(chunk.before, defsToAdd);
        chunk.selection = this.stripLinkDefs(chunk.selection, defsToAdd);
        chunk.after = this.stripLinkDefs(chunk.after, defsToAdd);

        let defs = "";
        let regex = /(\[)((?:\[[^\]]*\]|[^\[\]])*)(\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;


        let complete = chunk.before + chunk.selection + chunk.after;

        let fakedefs = "\n\n";

        let skippedChars = 0;
        let uniquify;

        let uniquified = complete.replace(regex, uniquify = (wholeMatch, before, inner, afterInner, id, end, offset) => {
            skippedChars += offset;
            fakedefs += " [" + skippedChars + "]: " + skippedChars + "/unicorn\n";
            skippedChars += before.length;
            inner = inner.replace(regex, uniquify);
            skippedChars -= before.length;
            let result = before + inner + afterInner + skippedChars + end;
            skippedChars -= offset;
            return result;
        });

        let addDefNumber = (def) => {
            refNumber++;
            def = def.replace(/^[ ]{0,3}\[(\d+)\]:/, "  [" + refNumber + "]:");
            defs += "\n" + def;
        };

        let getLink = (wholeMatch, before, inner, afterInner, id, end, offset) => {
            skippedChars += offset + before.length;
            inner = inner.replace(regex, getLink);
            skippedChars -= offset + before.length;
            if (defsToAdd[id]) {
                addDefNumber(defsToAdd[id]);
                return before + inner + afterInner + refNumber + end;
            }
            return wholeMatch;
        };

        let len = chunk.before.length;
        chunk.before = chunk.before.replace(regex, getLink);
        skippedChars += len;

        len = chunk.selection.length;
        if (linkDef) {
            addDefNumber(linkDef);
        }
        else {
            chunk.selection = chunk.selection.replace(regex, getLink);
        }
        skippedChars += len;

        let refOut = refNumber;

        chunk.after = chunk.after.replace(regex, getLink);

        if (chunk.after) {
            chunk.after = chunk.after.replace(/\n*$/, "");
        }
        if (!chunk.after) {
            chunk.selection = chunk.selection.replace(/\n*$/, "");
        }

        chunk.after += "\n\n" + defs;

        return refOut;
    }

    stripLinkDefs(text, defsToAdd) {
        let regex = /^[ ]{0,3}\[(\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm;
        text = text.replace(regex, (totalMatch, id, link, newlines, title) => {
            defsToAdd[id] = totalMatch.replace(/\s*$/, "");
            if (newlines) {
                // Strip the title and return that separately.
                defsToAdd[id] = totalMatch.replace(/["(](.+?)[")]$/, "");
                return newlines + title;
            }
            return "";
        });

        return text;
    }
}

export {CommandManager};