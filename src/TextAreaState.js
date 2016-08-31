import {util} from "./Utils";
import {Chunk} from "./Chunk";

/**
 * 用来实现撤销和重做的消息管理的
 */
class TextAreaState {

    /**
     *
     * @param textArea
     * @param isInitState  是否初始化状态
     */
    constructor(textArea, isInitState) {
        this.input = textArea;

        if (!util.isVisible(this.input)) {
            return;
        }
        // 如果不初始化状态, 并且输入框的元素是激活的
        if (!isInitState && document.activeElement && document.activeElement !== textArea) {
            return;
        }

        this.setSelectionStartEnd();

        this.scrollTop = this.input.scrollTop;

        if (!this.text && this.input.selectionStart || this.input.selectionStart === 0) {

            this.text = this.input.value;
        }
    }

    /**
     * 设置输入框选择区域
     */
    setSelection() {
        if (!util.isVisible(this.input)) {
            return;
        }

        if (this.input.selectionStart !== undefined) {

            this.input.focus();
            this.input.selectionStart = this.start;
            this.input.selectionEnd = this.end;
            this.input.scrollTop = this.scrollTop;
        }
    }

    /**
     * 设置开始位置和结束位置
     */
    setSelectionStartEnd() {
        if (this.input.selectionStart || this.input.selectionStart === 0) {
            this.start = this.input.selectionStart;
            this.end = this.input.selectionEnd;
        }
    }

    restore() {
        if (this.text != undefined && this.text != this.input.value) {
            this.input.value = this.text;
        }
        this.setSelection();
        this.input.scrollTop = this.scrollTop;
    }

    getChunk() {
        let chunk = new Chunk();
        chunk.before = util.fixEolChars(this.text.substring(0, this.start));
        chunk.startTag = "";
        chunk.selection = util.fixEolChars(this.text.substring(this.start, this.end));
        chunk.endTag = "";
        chunk.after = util.fixEolChars(this.text.substring(this.end));
        chunk.scrollTop = this.scrollTop;

        return chunk;
    }

    setChunk(chunk) {
        chunk.before = chunk.before + chunk.startTag;
        chunk.after = chunk.endTag + chunk.after;

        this.start = chunk.before.length;
        this.end = chunk.before.length + chunk.selection.length;
        this.text = chunk.before + chunk.selection + chunk.after;
        this.scrollTop = chunk.scrollTop;
    }
}

export {TextAreaState};