import {TextAreaState} from "./TextAreaState";


let buttons = {}
/**
 * 面板生成类
 */
class UIManager {

    constructor(panel, getString) {
        this.getString = getString;
        this.panel = panel;
    }

    magic() {
        this.makeButtonRow();
        this.register();
    }

    register() {
        $(this.panel.input).on("keydown", (event) => {
            let keyCodeChar = String.fromCharCode(event.keyCode).toLowerCase();
            if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
                switch (keyCodeChar) {
                    case "b":
                        this.doClick(buttons.bold);
                        break;
                    case "i":
                        this.doClick(buttons.italic);
                        break;
                    case "l":
                        this.doClick(buttons.link);
                        break;
                    case "q":
                        this.doClick(buttons.quote);
                        break;
                    case "k":
                        this.doClick(buttons.code);
                        break;
                    case "g":
                        this.doClick(buttons.image);
                        break;
                    case "o":
                        this.doClick(buttons.olist);
                        break;
                    case "u":
                        this.doClick(buttons.ulist);
                        break;
                    case "h":
                        this.doClick(buttons.heading);
                        break;
                    case "r":
                        this.doClick(buttons.hr);
                        break;
                    case "y":
                        this.doClick(buttons.redo);
                        break;
                    case "z":
                        if (key.shiftKey) {
                            this.doClick(buttons.redo);
                        }
                        else {
                            this.doClick(buttons.undo);
                        }
                        break;
                    default:
                        return;
                }
                event.preventDefault();
            }

            if (!event.shiftKey && keyCodeChar === "\t") {
                let fakeTabButton = {};
                fakeTabButton.textOp = this.bind((chunk, postProcessing) => {
                    return this.commandManager.doTab(chunk, postProcessing)
                });
                this.doClick(fakeTabButton);
                event.preventDefault();
            } else if (event.shiftKey && keyCodeChar === "\t") {
                let fakeUnTabButton = {};
                fakeUnTabButton.textOp = this.bind((chunk, postProcessing) => {
                    return this.commandManager.doTab(chunk, postProcessing, true)
                });
                this.doClick(fakeUnTabButton);
                event.preventDefault();
            }

            if ($.inArray(event.keyCode, [13]) != -1) {
                switch (event.keyCode) {
                    case 13: {
                        let fakeButton = {};
                        fakeButton.textOp = this.bind('doIndent');
                        this.doClick(fakeButton);

                        break;
                    }
                    // case 8: {
                    //     let fakeButton = {};
                    //     fakeButton.textOp = this.bind("doBackSpace");
                    //     this.doClick(fakeButton)
                    //     break;
                    // }
                }
                event.preventDefault();
            }
        }).on("keyup", (event) => {
            if (event.shiftKey && !event.ctrlKey && !event.metaKey) {
                if (event.keyCode === 13) {
                    let fakeButton = {};
                    fakeButton.textOp = this.bind('doAutoIndent');
                    this.doClick(fakeButton);
                }
            }
        })

    }

    makeButtonRow() {
        let normalYShift = "0px", disabledYShift = "-20px", highlightYShift = "-40px";
        this.buttonRow = $("<div></div>").addClass("wmd-button-row");

        $(this.panel.toolbar).append(this.buttonRow);

        let xPosition = 0, step = () => {
            xPosition += 25;
        };


        buttons.bold = this.makeButton("wmd-bold-button", this.getString("bold"), "0px", xPosition, this.bind("doBold"));
        step();
        buttons.italic = this.makeButton("wmd-italic-button", this.getString("italic"), "-20px", xPosition, this.bind("doItalic"));
        step();
        this.makeSpacer(1);
        step();
        buttons.link = this.makeButton("wmd-link-button", this.getString("link"), "-40px", xPosition, this.bind((chunk, postProcessing) => {
            return this.commandManager.doLinkOrImage(chunk, postProcessing, false);
        }));
        step();
        buttons.quote = this.makeButton("wmd-quote-button", this.getString("quote"), "-60px", xPosition, this.bind("doBlockQuote"));
        step();
        buttons.code = this.makeButton("wmd-code-button", this.getString("code"), "-80px", xPosition, this.bind("doCode"));
        step();
        buttons.image = this.makeButton("wmd-image-button", this.getString("image"), "-100px", xPosition, this.bind((chunk, postProcessing) => {
            return this.commandManager.doLinkOrImage(chunk, postProcessing, true);
        }));
        step();
        this.makeSpacer(2);
        step();
        buttons.olist = this.makeButton("wmd-olist-button", this.getString("olist"), "-120px", xPosition, this.bind((chunk, postProcessing) => {
            return this.commandManager.doList(chunk, postProcessing, true);
        }));
        step();
        buttons.ulist = this.makeButton("wmd-ulist-button", this.getString("ulist"), "-140px", xPosition, this.bind((chunk, postProcessing) => {
            return this.commandManager.doList(chunk, postProcessing, false);
        }));
        step();
        buttons.heading = this.makeButton("wmd-heading-button", this.getString("heading"), "-160px", xPosition, this.bind("doHeading"));
        step();
        buttons.hr = this.makeButton("wmd-hr-button", this.getString("hr"), "-180px", xPosition, this.bind("doHorizontalRule"));
        step();
        this.makeSpacer(3);
        step();

        // 撤销和恢复,需要借助UndoManager
        buttons.undo = this.makeButton("wmd-undo-button", this.getString("undo"), "-200px", xPosition, null);
        buttons.undo.execute = function (manager) {
            if (manager) manager.undo();
        };
        step();
        let redoTitle = /win/.test(window.navigator.platform.toLowerCase()) ? this.getString("redo") : this.getString("redomac");
        buttons.redo = this.makeButton("wmd-redo-button", redoTitle, "-220px", xPosition, null);
        buttons.redo.execute = function (manager) {
            if (manager) manager.redo();
        };

        // 重新设置撤销和恢复按钮的状态
        this.setUndoRedoButtonStates();
    }

    /**
     * 重新设置撤销和恢复按钮的状态
     */
    setUndoRedoButtonStates() {
        if (this.undoManager) {
            this.setupButton(buttons.undo, this.undoManager.canUndo());
            this.setupButton(buttons.redo, this.undoManager.canRedo());
        }
    }

    /**
     * 生成按钮
     * @param id
     * @param title
     * @param XShift
     * @param xPosition
     * @param textOp
     * @returns {*|jQuery}
     */
    makeButton(id, title, XShift, xPosition, textOp) {
        let button = $("<li></li>").addClass("wmd-button").attr("id", id + this.id).css('left', xPosition);
        let buttonImage = $("<span></span>");

        button.append(buttonImage);
        button.attr("title", title);
        button.XShift = XShift;

        if (textOp)
            button.textOp = textOp;
        this.setupButton(button, true);
        this.buttonRow.append(button);

        return button;
    }

    /**
     * 生成分隔符
     * @param num
     */
    makeSpacer(num) {
        let spacer = $("<li></li>").addClass("wmd-spacer wmd-spacer" + num).attr("id", "wmd-spacer" + num + this.id);
        this.buttonRow.append(spacer);
    }

    /**
     * 按钮滤镜
     * @param button
     * @param isEnabled
     */
    setupButton(button, isEnabled) {
        let normalYShift = "0px", disabledYShift = "-20px", highlightYShift = "-40px";
        let image = button.find("span");

        if (isEnabled) {
            image.css("background-position", button.XShift + " " + normalYShift);

            button.on("mouseover", () => {
                image.css("background-position", button.XShift + " " + highlightYShift);
            });

            button.on("mouseout", () => {
                image.css("background-position", button.XShift + " " + normalYShift);
            });

            if (button) {
                button.on("click", (event) => {
                    $(this).mouseout();
                    this.doClick(button)
                    return false;
                })
            }
        }
        else {
            image.css("background-position", button.XShift + " " + disabledYShift);
            button.off('mouseover mouseout click')
            // button.on("mouseover mouseout click", () => {});
        }
    }

    /**
     * 绑定命令
     * @param method
     * @returns {Function}
     */
    bind(method) {
        if (typeof method === "string")
            method = this.commandManager[method];
        let _that = this;
        return function () {
            method.apply(_that.commandManager, arguments);
        };
    }

    doClick(button) {
        this.panel.input.focus();

        if (button.textOp) {

            if (this.undoManager) {
                this.undoManager.setCommandMode();
            }

            let state = new TextAreaState(this.panel.input);

            if (!state) {
                return;
            }

            let chunk = state.getChunk();

            let fixupInputArea = () => {

                this.panel.input.focus();

                if (chunk) {
                    state.setChunk(chunk);
                }

                state.restore();
                if (this.previewManager)
                    this.previewManager.refresh();
            };

            let noCleanup = button.textOp(chunk, fixupInputArea);

            if (!noCleanup) {
                fixupInputArea();
            }

        }

        if (button.execute) {
            button.execute(this.undoManager);
        }
    }
}

export {UIManager};