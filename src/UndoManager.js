import {TextAreaState} from "./TextAreaState";

/**
 * 操作管理, 计算redo或者undo
 */
class UndoManager {

    /**
     * 操作管理类
     */
    constructor(textArea) {
        this.input = textArea;
        this.mode = 'none';
        this.lastState = null;
        this.undoStack = [];
        this.stackPtr = 0;

        this.setEventHandlers();
        this.refreshState(true);
        this.saveState();
    }

    setMode(newMode, noSave) {
        if (this.mode != newMode) {
            this.mode = newMode;
            if (!noSave) {
                this.saveState();
            }
        }

        if (this.mode != "moving") {
            this.timer = setTimeout(this.refreshState, 1);
        } else {
            this.inputStateObj = null;
        }
    }

    setCommandMode() {
        this.mode = "command";
        this.saveState();
        this.timer = setTimeout(() => this.refreshState(), 0);
    }

    saveState() {
        let currState = this.inputStateObj || new TextAreaState(this.input);

        if (!currState) {
            return false;
        }
        if (this.mode == "moving") {
            if (!this.lastState) {
                this.lastState = currState;
            }
            return;
        }
        if (this.lastState) {
            if (this.undoStack[this.stackPtr - 1].text != this.lastState.text) {
                this.undoStack[this.stackPtr++] = this.lastState;
            }
            this.lastState = null;
        }
        this.undoStack[this.stackPtr++] = currState;
        this.undoStack[this.stackPtr + 1] = null;

        if (this.callback) {
            this.callback();
        }
    }

    refreshState(isInitialState) {
        this.inputStateObj = new TextAreaState(this.input, isInitialState);
        this.timer = undefined;
    }

    setEventHandlers() {
        $(this.input).on('keypress', (event) => {
            if ((event.ctrlKey || event.metaKey) && !event.altKey && (event.keyCode == 89 || event.keyCode == 90)) {
                event.preventDefault();
            }
        });

        let handlePaste = () => {
            if ((this.inputStateObj && this.inputStateObj.text != this.input.value)) {
                if (this.timer == undefined) {
                    this.mode = "paste";
                    this.saveState();
                    this.refreshState();
                }
            }
        };

        $(this.input).on("keydown", (event) => {
            let handled = false;

            if ((event.ctrlKey || event.metaKey) && !event.altKey) {

                let keyCodeChar = String.fromCharCode(event.keyCode);

                switch (keyCodeChar.toLowerCase()) {
                    case "y":
                        this.redo();
                        handled = true;
                        break;

                    case "z":
                        if (!event.shiftKey) {
                            this.undo();
                        }
                        else {
                            this.redo();
                        }
                        handled = true;
                        break;
                }
            }

            if (handled) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (window.event) {
                    window.event.returnValue = false;
                }
                return;
            }
        }).on("keydown", (event) => {
            if (!event.ctrlKey && !event.metaKey) {

                let keyCode = event.keyCode;

                if ((keyCode >= 33 && keyCode <= 40) || (keyCode >= 63232 && keyCode <= 63235)) {
                    // 33 - 40: page up/dn and arrow keys
                    // 63232 - 63235: page up/dn and arrow keys on safari
                    this.setMode("moving");
                }
                else if (keyCode == 8 || keyCode == 46 || keyCode == 127) {
                    // 8: backspace
                    // 46: delete
                    // 127: delete
                    this.setMode("deleting");
                }
                else if (keyCode == 13) {
                    // 13: Enter
                    this.setMode("newlines");
                }
                else if (keyCode == 27) {
                    // 27: escape
                    this.setMode("escape");
                }
                else if ((keyCode < 16 || keyCode > 20) && keyCode != 91) {
                    // 16-20 are shift, etc.
                    // 91: left window key
                    // I think this might be a little messed up since there are
                    // a lot of nonprinting keys above 20.
                    this.setMode("typing");
                }
            }
        }).on("mousedown", () => {
            this.setMode("moving");
        });

        $(this.input).on("paste drop", handlePaste);
    }

    undo() {
        if (this.canUndo()) {
            if (this.lastState) {
                // What about setting state -1 to null or checking for undefined?
                this.lastState.restore();
                this.lastState = null;
            }
            else {
                this.undoStack[this.stackPtr] = new TextAreaState(this.input);
                this.undoStack[--this.stackPtr].restore();

                if (this.callback) {
                    this.callback();
                }
            }
        }

        this.mode = "none";
        this.input.focus();
        this.refreshState();
    }

    redo() {
        if (this.canRedo()) {
            this.undoStack[++this.stackPtr].restore();

            if (this.callback) {
                this.callback();
            }
        }

        this.mode = "none";
        this.input.focus();
        this.refreshState();
    }

    /**
     * 能否还原
     * @returns {boolean}
     */
    canRedo() {
        if (this.undoStack[this.stackPtr + 1]) {
            return true;
        }
        return false;
    }

    /**
     * 能否撤销
     * @returns {boolean}
     */
    canUndo() {
        return this.stackPtr > 1;
    }
}

export {UndoManager};