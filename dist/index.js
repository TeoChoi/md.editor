webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _MdEditor = __webpack_require__(30);

	var e = new _MdEditor.MdEditor("wmd-panel", {
	    strings: [], // 数组编辑器使用的,参考defaultString
	    highlight: true,
	    flowchart: true
	});

	e.run();

/***/ },

/***/ 30:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.MdEditor = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _UIManager = __webpack_require__(31);

	var _Panel = __webpack_require__(35);

	var _Dialog = __webpack_require__(36);

	var _CommandManager = __webpack_require__(40);

	var _UndoManager = __webpack_require__(41);

	var _Format = __webpack_require__(42);

	var _PreviewManager = __webpack_require__(43);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HyperDown = __webpack_require__(234);
	/**
	 * 编辑器类
	 */

	var MdEditor = function () {
	    function MdEditor(id, opts) {
	        var _this = this;

	        _classCallCheck(this, MdEditor);

	        this.id = id;
	        this.events = new Map();
	        options = $.extend(options, opts);

	        var panel = void 0,
	            dialog = void 0,
	            commandManager = void 0,
	            undoManager = void 0,
	            format = void 0,
	            previewManager = void 0;

	        panel = new _Panel.Panel(this.id);
	        dialog = new _Dialog.Dialog(options.uploadUrl);

	        commandManager = new _CommandManager.CommandManager(this.getString);
	        commandManager.dialog = dialog;
	        undoManager = new _UndoManager.UndoManager(panel.input);
	        format = new _Format.Format(panel.input, options.converter);

	        if (options.preview) {
	            previewManager = new _PreviewManager.PreviewManager(panel, format);
	            previewManager.highlight = options.highlight || false;
	            previewManager.flowchart = options.flowchart || false;
	        }

	        this.uiManager = new _UIManager.UIManager(panel, this.getString);

	        undoManager.callback = function () {
	            _this.uiManager.setUndoRedoButtonStates();
	        };

	        this.uiManager.commandManager = commandManager;
	        this.uiManager.undoManager = undoManager;
	        this.uiManager.previewManager = previewManager;
	    }

	    _createClass(MdEditor, [{
	        key: "getString",
	        value: function getString(key) {
	            return options.strings[key] || defaultsStrings[key];
	        }
	    }, {
	        key: "run",
	        value: function run() {
	            this.uiManager.magic();
	        }
	    }]);

	    return MdEditor;
	}();

	var options = {
	    converter: new HyperDown(),
	    preview: true,
	    uploadUrl: "",
	    highlight: false,
	    flowchart: false
	};

	var defaultsStrings = {
	    bold: "粗体 <strong> Ctrl+B",
	    boldexample: "加粗文本",

	    italic: "斜体 <em> Ctrl+I",
	    italicexample: "斜体文本",

	    link: "链接 <a> Ctrl+L",
	    linkdescription: "链接描述",
	    linkdialog: "插入链接",

	    quote: "引用 <blockquote> Ctrl+Q",
	    quoteexample: "引用文本",

	    code: "代码 <pre><code> Ctrl+K",
	    codeexample: "请输入代码",

	    image: "图片 <img> Ctrl+G",
	    imagedescription: "输入图片地址",
	    imagedialog: "插入图片",

	    olist: "数字列表 <ol> Ctrl+O",
	    ulist: "普通列表 <ul> Ctrl+U",
	    litem: "列表项目",

	    heading: "标题 <h1>/<h2> Ctrl+H",
	    headingexample: "标题文本",

	    hr: "分割线 <hr> Ctrl+R",

	    undo: "撤销 - Ctrl+Z",
	    redo: "重做 - Ctrl+Y",
	    redomac: "重做 - Ctrl+Shift+Z",

	    help: "Markdown 帮助"
	};

	exports.MdEditor = MdEditor;

/***/ },

/***/ 31:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UIManager = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _TextAreaState = __webpack_require__(32);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var buttons = {};
	/**
	 * 面板生成类
	 */

	var UIManager = function () {
	    function UIManager(panel, getString) {
	        _classCallCheck(this, UIManager);

	        this.getString = getString;
	        this.panel = panel;
	    }

	    _createClass(UIManager, [{
	        key: "magic",
	        value: function magic() {
	            this.makeButtonRow();
	            this.register();
	        }
	    }, {
	        key: "register",
	        value: function register() {
	            var _this = this;

	            $(this.panel.input).on("keydown", function (event) {
	                var keyCodeChar = String.fromCharCode(event.keyCode).toLowerCase();
	                if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
	                    switch (keyCodeChar) {
	                        case "b":
	                            _this.doClick(buttons.bold);
	                            break;
	                        case "i":
	                            _this.doClick(buttons.italic);
	                            break;
	                        case "l":
	                            _this.doClick(buttons.link);
	                            break;
	                        case "q":
	                            _this.doClick(buttons.quote);
	                            break;
	                        case "k":
	                            _this.doClick(buttons.code);
	                            break;
	                        case "g":
	                            _this.doClick(buttons.image);
	                            break;
	                        case "o":
	                            _this.doClick(buttons.olist);
	                            break;
	                        case "u":
	                            _this.doClick(buttons.ulist);
	                            break;
	                        case "h":
	                            _this.doClick(buttons.heading);
	                            break;
	                        case "r":
	                            _this.doClick(buttons.hr);
	                            break;
	                        case "y":
	                            _this.doClick(buttons.redo);
	                            break;
	                        case "z":
	                            if (key.shiftKey) {
	                                _this.doClick(buttons.redo);
	                            } else {
	                                _this.doClick(buttons.undo);
	                            }
	                            break;
	                        default:
	                            return;
	                    }
	                    event.preventDefault();
	                }

	                if (!event.shiftKey && keyCodeChar === "\t") {
	                    var fakeTabButton = {};
	                    fakeTabButton.textOp = _this.bind(function (chunk, postProcessing) {
	                        return _this.commandManager.doTab(chunk, postProcessing);
	                    });
	                    _this.doClick(fakeTabButton);
	                    event.preventDefault();
	                } else if (event.shiftKey && keyCodeChar === "\t") {
	                    var fakeUnTabButton = {};
	                    fakeUnTabButton.textOp = _this.bind(function (chunk, postProcessing) {
	                        return _this.commandManager.doTab(chunk, postProcessing, true);
	                    });
	                    _this.doClick(fakeUnTabButton);
	                    event.preventDefault();
	                }

	                if ($.inArray(event.keyCode, [13]) != -1) {
	                    switch (event.keyCode) {
	                        case 13:
	                            {
	                                var fakeButton = {};
	                                fakeButton.textOp = _this.bind('doIndent');
	                                _this.doClick(fakeButton);

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
	            }).on("keyup", function (event) {
	                if (event.shiftKey && !event.ctrlKey && !event.metaKey) {
	                    if (event.keyCode === 13) {
	                        var fakeButton = {};
	                        fakeButton.textOp = _this.bind('doAutoIndent');
	                        _this.doClick(fakeButton);
	                    }
	                }
	            });
	        }
	    }, {
	        key: "makeButtonRow",
	        value: function makeButtonRow() {
	            var _this2 = this;

	            var normalYShift = "0px",
	                disabledYShift = "-20px",
	                highlightYShift = "-40px";
	            this.buttonRow = $("<div></div>").addClass("wmd-button-row");

	            $(this.panel.toolbar).append(this.buttonRow);

	            var xPosition = 0,
	                step = function step() {
	                xPosition += 25;
	            };

	            buttons.bold = this.makeButton("wmd-bold-button", this.getString("bold"), "0px", xPosition, this.bind("doBold"));
	            step();
	            buttons.italic = this.makeButton("wmd-italic-button", this.getString("italic"), "-20px", xPosition, this.bind("doItalic"));
	            step();
	            this.makeSpacer(1);
	            step();
	            buttons.link = this.makeButton("wmd-link-button", this.getString("link"), "-40px", xPosition, this.bind(function (chunk, postProcessing) {
	                return _this2.commandManager.doLinkOrImage(chunk, postProcessing, false);
	            }));
	            step();
	            buttons.quote = this.makeButton("wmd-quote-button", this.getString("quote"), "-60px", xPosition, this.bind("doBlockQuote"));
	            step();
	            buttons.code = this.makeButton("wmd-code-button", this.getString("code"), "-80px", xPosition, this.bind("doCode"));
	            step();
	            buttons.image = this.makeButton("wmd-image-button", this.getString("image"), "-100px", xPosition, this.bind(function (chunk, postProcessing) {
	                return _this2.commandManager.doLinkOrImage(chunk, postProcessing, true);
	            }));
	            step();
	            this.makeSpacer(2);
	            step();
	            buttons.olist = this.makeButton("wmd-olist-button", this.getString("olist"), "-120px", xPosition, this.bind(function (chunk, postProcessing) {
	                return _this2.commandManager.doList(chunk, postProcessing, true);
	            }));
	            step();
	            buttons.ulist = this.makeButton("wmd-ulist-button", this.getString("ulist"), "-140px", xPosition, this.bind(function (chunk, postProcessing) {
	                return _this2.commandManager.doList(chunk, postProcessing, false);
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
	            var redoTitle = /win/.test(window.navigator.platform.toLowerCase()) ? this.getString("redo") : this.getString("redomac");
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

	    }, {
	        key: "setUndoRedoButtonStates",
	        value: function setUndoRedoButtonStates() {
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

	    }, {
	        key: "makeButton",
	        value: function makeButton(id, title, XShift, xPosition, textOp) {
	            var button = $("<li></li>").addClass("wmd-button").attr("id", id + this.id).css('left', xPosition);
	            var buttonImage = $("<span></span>");

	            button.append(buttonImage);
	            button.attr("title", title);
	            button.XShift = XShift;

	            if (textOp) button.textOp = textOp;
	            this.setupButton(button, true);
	            this.buttonRow.append(button);

	            return button;
	        }

	        /**
	         * 生成分隔符
	         * @param num
	         */

	    }, {
	        key: "makeSpacer",
	        value: function makeSpacer(num) {
	            var spacer = $("<li></li>").addClass("wmd-spacer wmd-spacer" + num).attr("id", "wmd-spacer" + num + this.id);
	            this.buttonRow.append(spacer);
	        }

	        /**
	         * 按钮滤镜
	         * @param button
	         * @param isEnabled
	         */

	    }, {
	        key: "setupButton",
	        value: function setupButton(button, isEnabled) {
	            var _this3 = this;

	            var normalYShift = "0px",
	                disabledYShift = "-20px",
	                highlightYShift = "-40px";
	            var image = button.find("span");

	            if (isEnabled) {
	                image.css("background-position", button.XShift + " " + normalYShift);

	                button.on("mouseover", function () {
	                    image.css("background-position", button.XShift + " " + highlightYShift);
	                });

	                button.on("mouseout", function () {
	                    image.css("background-position", button.XShift + " " + normalYShift);
	                });

	                if (button) {
	                    button.on("click", function (event) {
	                        $(_this3).mouseout();
	                        _this3.doClick(button);
	                        return false;
	                    });
	                }
	            } else {
	                image.css("background-position", button.XShift + " " + disabledYShift);
	                button.off('mouseover mouseout click');
	                // button.on("mouseover mouseout click", () => {});
	            }
	        }

	        /**
	         * 绑定命令
	         * @param method
	         * @returns {Function}
	         */

	    }, {
	        key: "bind",
	        value: function bind(method) {
	            if (typeof method === "string") method = this.commandManager[method];
	            var _that = this;
	            return function () {
	                method.apply(_that.commandManager, arguments);
	            };
	        }
	    }, {
	        key: "doClick",
	        value: function doClick(button) {
	            var _this4 = this;

	            this.panel.input.focus();

	            if (button.textOp) {
	                var _ret = function () {

	                    if (_this4.undoManager) {
	                        _this4.undoManager.setCommandMode();
	                    }

	                    var state = new _TextAreaState.TextAreaState(_this4.panel.input);

	                    if (!state) {
	                        return {
	                            v: void 0
	                        };
	                    }

	                    var chunk = state.getChunk();

	                    var fixupInputArea = function fixupInputArea() {

	                        _this4.panel.input.focus();

	                        if (chunk) {
	                            state.setChunk(chunk);
	                        }

	                        state.restore();
	                        if (_this4.previewManager) _this4.previewManager.refresh();
	                    };

	                    var noCleanup = button.textOp(chunk, fixupInputArea);

	                    if (!noCleanup) {
	                        fixupInputArea();
	                    }
	                }();

	                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	            }

	            if (button.execute) {
	                button.execute(this.undoManager);
	            }
	        }
	    }]);

	    return UIManager;
	}();

	exports.UIManager = UIManager;

/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TextAreaState = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(33);

	var _Chunk = __webpack_require__(34);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 用来实现撤销和重做的消息管理的
	 */
	var TextAreaState = function () {

	    /**
	     *
	     * @param textArea
	     * @param isInitState  是否初始化状态
	     */
	    function TextAreaState(textArea, isInitState) {
	        _classCallCheck(this, TextAreaState);

	        this.input = textArea;

	        if (!_Utils.util.isVisible(this.input)) {
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


	    _createClass(TextAreaState, [{
	        key: "setSelection",
	        value: function setSelection() {
	            if (!_Utils.util.isVisible(this.input)) {
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

	    }, {
	        key: "setSelectionStartEnd",
	        value: function setSelectionStartEnd() {
	            if (this.input.selectionStart || this.input.selectionStart === 0) {
	                this.start = this.input.selectionStart;
	                this.end = this.input.selectionEnd;
	            }
	        }
	    }, {
	        key: "restore",
	        value: function restore() {
	            if (this.text != undefined && this.text != this.input.value) {
	                this.input.value = this.text;
	            }
	            this.setSelection();
	            this.input.scrollTop = this.scrollTop;
	        }
	    }, {
	        key: "getChunk",
	        value: function getChunk() {
	            var chunk = new _Chunk.Chunk();
	            chunk.before = _Utils.util.fixEolChars(this.text.substring(0, this.start));
	            chunk.startTag = "";
	            chunk.selection = _Utils.util.fixEolChars(this.text.substring(this.start, this.end));
	            chunk.endTag = "";
	            chunk.after = _Utils.util.fixEolChars(this.text.substring(this.end));
	            chunk.scrollTop = this.scrollTop;

	            return chunk;
	        }
	    }, {
	        key: "setChunk",
	        value: function setChunk(chunk) {
	            chunk.before = chunk.before + chunk.startTag;
	            chunk.after = chunk.endTag + chunk.after;

	            this.start = chunk.before.length;
	            this.end = chunk.before.length + chunk.selection.length;
	            this.text = chunk.before + chunk.selection + chunk.after;
	            this.scrollTop = chunk.scrollTop;
	        }
	    }]);

	    return TextAreaState;
	}();

	exports.TextAreaState = TextAreaState;

/***/ },

/***/ 33:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var util = function () {
	    function util() {
	        _classCallCheck(this, util);
	    }

	    _createClass(util, null, [{
	        key: "isVisible",


	        /**
	         * 判断元素的
	         * @param element
	         * @returns {*|jQuery}
	         */
	        value: function isVisible(element) {
	            return $(element).is(":visible");
	        }

	        /**
	         * 将"\r\n"或者"\r" 转化为"\n"
	         * @param text
	         * @returns string
	         */

	    }, {
	        key: "fixEolChars",
	        value: function fixEolChars(text) {
	            return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	        }

	        /**
	         * 给定一个正则表达式,增加前缀或者后缀,生成一个新的表达式返回
	         * @param regex
	         * @param pre
	         * @param post
	         * @returns {RegExp}
	         */

	    }, {
	        key: "extendRegExp",
	        value: function extendRegExp(regex, pre, post) {
	            if (pre === null || pre === undefined) {
	                pre = "";
	            }
	            if (post === null || post === undefined) {
	                post = "";
	            }

	            var pattern = regex.toString();
	            var flags = void 0;

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
	    }]);

	    return util;
	}();

	var position = function () {
	    function position() {
	        _classCallCheck(this, position);
	    }

	    _createClass(position, null, [{
	        key: "getTop",
	        value: function getTop(element) {
	            return $(element).offset().top;
	        }
	    }, {
	        key: "getHeight",
	        value: function getHeight(element) {
	            return $(element).outerHeight();
	        }
	    }, {
	        key: "getWidth",
	        value: function getWidth(element) {
	            return $(element).outerWidth();
	        }
	    }]);

	    return position;
	}();

	exports.util = util;
	exports.position = position;

/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Chunk = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(33);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 模块操作
	 */
	var Chunk = function () {
	    function Chunk() {
	        _classCallCheck(this, Chunk);
	    }

	    _createClass(Chunk, [{
	        key: "findTags",


	        /**
	         * 使用正则表达是,找到对应的标签
	         * @param startRegex    一个正则表达式去匹配开始的标签
	         * @param endRegex      一个正则表达式去匹配结束的标签
	         */
	        value: function findTags(startRegex, endRegex) {
	            var _this = this;

	            var regex = void 0;

	            if (startRegex) {
	                regex = _Utils.util.extendRegExp(startRegex, "", "$");

	                this.before = this.before.replace(regex, function (match) {
	                    _this.startTag = _this.startTag + match;
	                    return "";
	                });

	                regex = _Utils.util.extendRegExp(startRegex, "^", "");

	                this.selection = this.selection.replace(regex, function (match) {
	                    _this.startTag = _this.startTag + match;
	                    return "";
	                });
	            }

	            if (endRegex) {
	                regex = _Utils.util.extendRegExp(endRegex, "", "$");

	                this.selection = this.selection.replace(regex, function (match) {
	                    _this.endTag = match + _this.endTag;
	                    return "";
	                });

	                regex = _Utils.util.extendRegExp(endRegex, "^", "");

	                this.after = this.after.replace(regex, function (match) {
	                    _this.endTag = match + _this.endTag;
	                    return "";
	                });
	            }
	        }

	        /**
	         * 如果 参数为true,那么移除选择区域前后的空格
	         * 如果为false 空格就会转移到选择光标的前后
	         * @param remove
	         */

	    }, {
	        key: "trimWhitespace",
	        value: function trimWhitespace(remove) {
	            var _this2 = this;

	            var beforeReplacer = void 0,
	                afterReplacer = void 0;
	            if (remove) {
	                beforeReplacer = afterReplacer = "";
	            } else {
	                beforeReplacer = function beforeReplacer(s) {
	                    _this2.before += s;
	                    return "";
	                };
	                afterReplacer = function afterReplacer(s) {
	                    _this2.after = s + _this2.after;
	                    return "";
	                };
	            }

	            this.selection = this.selection.replace(/^(\s*)/, beforeReplacer).replace(/(\s*)$/, afterReplacer);
	        }
	    }, {
	        key: "skipLines",
	        value: function skipLines(nLinesBefore, nLinesAfter, findExtraNewlines) {
	            if (nLinesBefore === undefined) {
	                nLinesBefore = 1;
	            }

	            if (nLinesAfter === undefined) {
	                nLinesAfter = 1;
	            }

	            nLinesBefore++;
	            nLinesAfter++;

	            var regexText = void 0;
	            var replacementText = void 0;

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
	    }]);

	    return Chunk;
	}();

	exports.Chunk = Chunk;

/***/ },

/***/ 35:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Panel = function () {
	    _createClass(Panel, [{
	        key: "toolbar",
	        get: function get() {
	            return this._toolbar[0];
	        }
	    }, {
	        key: "input",
	        get: function get() {
	            return this._input[0];
	        }
	    }, {
	        key: "preview",
	        get: function get() {
	            return this._preview[0];
	        }
	    }]);

	    function Panel(id) {
	        _classCallCheck(this, Panel);

	        this.id = id;
	        this.draw();
	    }

	    /**
	     * 画出大致框架
	     */


	    _createClass(Panel, [{
	        key: "draw",
	        value: function draw() {
	            var panel = $("#" + this.id);
	            this._toolbar = $("<div id='wmd-button-bar' class='wmd-button-bar'></div>");
	            this._input = $("<textarea class='form-control wmd-input' id='wmd-input' placeholder='1. 测试阶段哟~~'></textarea>");
	            this._preview = $("<div id='wmd-preview' class='wmd-preview'></div>");

	            panel.append(this._toolbar).append(this._input).append(this._preview);
	        }
	    }]);

	    return Panel;
	}();

	exports.Panel = Panel;

/***/ },

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var fileUpload = __webpack_require__(37);

	var Dialog = function () {
	    function Dialog(uploadUrl) {
	        _classCallCheck(this, Dialog);

	        this.uploadUrl = uploadUrl;
	    }

	    _createClass(Dialog, [{
	        key: 'link',
	        value: function link(text, callback) {
	            var input = void 0,
	                dialog = void 0,
	                id = 'linkDialog';

	            var close = function close(isCancel) {
	                var text = input.value;

	                if (isCancel) {
	                    text = null;
	                } else {
	                    // 修复一些没呀协议头的地址
	                    text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
	                    if (!/^(?:https?|ftp):\/\//.test(text)) text = 'http://' + text;
	                }

	                dialog.modal('hide').remove();

	                callback(text);
	                return false;
	            };

	            // 创建一个输入地址的modal
	            var createLinkDialog = function createLinkDialog() {
	                dialog = $("<div></div>");
	                dialog.attr('id', id);
	                dialog.attr('class', "modal fade");

	                dialog.html('\n<div class="modal-dialog">\n    <div class="modal-content">\n        <div class="modal-header">\n            <button id="closeButton" type="button" data-dismiss="modal" class="close"><span>×</span></button>\n            <h4 class="modal-title">' + text + '</h4>\n        </div>\n        <div class="modal-body"><input id="linkInput" type="text" class="form-control" placeholder="输入连接地址"></div>\n        <div class="modal-footer">\n            <button id="linkCancelButton" type="button" class="btn btn-default">取消</button>\n            <button id="linkOkButton" type="button" class="btn btn-primary">确定</button>\n        </div>\n    </div>\n</div>\n');

	                $('body').append(dialog);

	                input = document.getElementById('linkInput');

	                var cancelButton = $('#linkCancelButton');
	                var okButton = $('#linkOkButton');

	                input.focus();

	                dialog.modal();

	                cancelButton.on("click", function () {
	                    return close(true);
	                });
	                okButton.on("click", function () {
	                    return close(false);
	                });
	            };

	            createLinkDialog();
	        }
	    }, {
	        key: 'image',
	        value: function image(text, callback) {
	            var _this = this;

	            var input = void 0,
	                dialog = void 0,
	                id = 'imageDialog';

	            var close = function close(isCancel) {
	                var text = input.value;

	                if (isCancel) {
	                    text = null;
	                } else {
	                    text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
	                    if (!/^(?:https?|ftp):\/\//.test(text)) text = 'http://' + text;
	                }

	                dialog.modal('hide').remove();

	                callback(text);
	                return false;
	            };

	            var createImageDialog = function createImageDialog() {
	                dialog = $("<div></div>");
	                dialog.attr('id', id);
	                dialog.attr('class', "modal fade");

	                dialog.html('\n<div class="modal-dialog">\n    <div class="modal-content">\n        <div class="modal-header">\n            <button id="closeButton" type="button" data-dismiss="modal" class="close"><span>×</span></button>\n            <h4 class="modal-title">' + text + '</h4></div>\n        <div class="modal-body">\n            <ul class="nav nav-tabs" role="tablist">\n                <li role="presentation" class="active"><a href="#localhost" aria-controls="localhost" role="tab"\n                                                          data-toggle="tab">本地上传</a></li>\n                <li role="presentation"><a href="#remote" aria-controls="remote" role="tab" data-toggle="tab">远程地址获取</a>\n                </li>\n            </ul>\n            <div class="tab-content">\n                <div role="tabpanel" class="tab-pane pt form-horizontal active" id="localhost">\n                    <div class="form-group fileinput-button">\n                        <input id="fileupload" type="file" name="wmd_file_upload">\n                        <div class="col-sm-8"><input type="text" id="fileName" class="form-control"\n                                                     placeholder="拖动图片到这里" readonly></div>\n                        <a href="javascript:;" class="btn col-sm-2 btn-default">选择图片</a></div>\n                </div>\n                <div role="tabpanel" class="tab-pane pt" id="remote">\n                    <input type="url" name="img" id="remotePicUrl" class="form-control text-28" placeholder="输入图片地址">\n                </div>\n            </div>\n        </div>\n        <div>\n            <div class="modal-footer" style="border-top: none;">\n                <button id="imageCancelButton" type="button" class="btn btn-default">取消</button>\n                <button id="imageOkButton" type="button" class="btn btn-primary">确定</button>\n            </div>\n        </div>\n    </div>\n</div>\n');

	                $('body').append(dialog);

	                input = document.getElementById('remotePicUrl');
	                var cancelButton = $('#imageCancelButton');
	                var okButton = $('#imageOkButton');

	                $('#' + id + ' a').click(function (e) {
	                    e.preventDefault();
	                    $(this).blur().tab('show');

	                    okButton.unbind();
	                    if ($(this).attr('aria-controls') == 'remote') {
	                        okButton.bind('click', function () {
	                            close(false);
	                        });
	                    }
	                });

	                fileUpload(function (file) {
	                    var upload = $('#fileupload').fileupload({
	                        url: _this.uploadUrl,
	                        dataType: 'json',
	                        dropZone: dialog,
	                        autoUpload: false,
	                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
	                        add: function add(e, data) {
	                            $('#imageOkButton').click(function () {
	                                data.submit();
	                            });
	                        },
	                        done: function done(e, data) {
	                            if (data.result.code == 1) {
	                                $('#remotePicUrl').val(data.result.url);
	                                close(false);
	                            }
	                        },
	                        drop: function drop(e, data) {
	                            $.each(data.files, function (index, file) {
	                                $("#fileName").val(file.name);
	                            });
	                        },
	                        change: function change(e, data) {
	                            $.each(data.files, function (index, file) {
	                                $("#fileName").val(file.name);
	                            });
	                        }
	                    });
	                });

	                dialog.modal();

	                input.focus();

	                cancelButton.on("click", function () {
	                    return close(true);
	                });
	            };

	            createImageDialog();
	        }
	    }]);

	    return Dialog;
	}();

	exports.Dialog = Dialog;

/***/ },

/***/ 37:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(cb) {
		__webpack_require__.e/* nsure */(3, function(require) {
			cb(__webpack_require__(38));
		});
	}

/***/ },

/***/ 40:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SETTINGS = { lineLength: 72 };

	/**
	 * 命令管理
	 */

	var CommandManager = function () {
	    function CommandManager(getString) {
	        _classCallCheck(this, CommandManager);

	        this.getString = getString;
	        // 匹配markdown前缀符号, 四个空格是代码, > 这个符号的是引用模块,等等
	        this.prefixes = "(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)";
	    }

	    /**
	     * 从选择的部分移除markdown的符号
	     * @param chunk
	     */


	    _createClass(CommandManager, [{
	        key: "unwrap",
	        value: function unwrap(chunk) {
	            var txt = new RegExp("([^\\n])\\n(?!(\\n|" + this.prefixes + "))", "g");
	            chunk.selection = chunk.selection.replace(txt, "$1 $2");
	        }
	    }, {
	        key: "wrap",
	        value: function wrap(chunk, length) {
	            this.unwrap(chunk);
	            var regex = new RegExp("(.{1," + length + "})( +|$\\n?)", "gm"),
	                that = this;

	            chunk.selection = chunk.selection.replace(regex, function (line, marked) {
	                if (new RegExp("^" + that.prefixes, "").test(line)) {
	                    return line;
	                }
	                return marked + "\n";
	            });

	            chunk.selection = chunk.selection.replace(/\s+$/, "");
	        }
	    }, {
	        key: "doBold",
	        value: function doBold(chunk, postProcessing) {
	            return this.doBorI(chunk, postProcessing, 2, this.getString("boldexample"));
	        }
	    }, {
	        key: "doItalic",
	        value: function doItalic(chunk, postProcessing) {
	            return this.doBorI(chunk, postProcessing, 1, this.getString("italicexample"));
	        }
	    }, {
	        key: "doBorI",
	        value: function doBorI(chunk, postProcessing, nStars, insertText) {
	            // Get rid of whitespace and fixup newlines.
	            chunk.trimWhitespace();
	            chunk.selection = chunk.selection.replace(/\n{2,}/g, "\n");

	            // 查看前后是否已经有markdown标记元素
	            var starsBefore = /(\**$)/.exec(chunk.before)[0];
	            var starsAfter = /(^\**)/.exec(chunk.after)[0];
	            var prevStars = Math.min(starsBefore.length, starsAfter.length);

	            // 如果该按钮是一个切换的功能, 则删除星号, 另一次点击则是添加 星号
	            if (prevStars >= nStars && (prevStars != 2 || nStars != 1)) {
	                chunk.before = chunk.before.replace(RegExp("[*]{" + nStars + "}$", ""), "");
	                chunk.after = chunk.after.replace(RegExp("^[*]{" + nStars + "}", ""), "");
	            } else if (!chunk.selection && starsAfter) {
	                // 这段代码不是必要的, 只不过为了清除一些垃圾的符号罢了
	                chunk.after = chunk.after.replace(/^([*_]*)/, "");
	                chunk.before = chunk.before.replace(/(\s?)$/, "");
	                var whitespace = RegExp.$1;
	                chunk.before = chunk.before + starsAfter + whitespace;
	            } else {
	                // 如果你没有选择任何文本, 点击该按钮之后,就会生成一个带有星号的文本
	                if (!chunk.selection && !starsAfter) {
	                    chunk.selection = insertText;
	                }

	                // 添加标记
	                var markup = nStars <= 1 ? "*" : "**";
	                chunk.before = chunk.before + markup;
	                chunk.after = markup + chunk.after;
	            }
	        }

	        /**
	         * 自动缩进功能
	         * @param chunk
	         * @param postProcessing
	         */

	    }, {
	        key: "doAutoIndent",
	        value: function doAutoIndent(chunk, postProcessing) {
	            var fakeSelection = false;

	            chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]*\n$/, "\n\n");
	            chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}>[ \t]*\n$/, "\n\n");
	            chunk.before = chunk.before.replace(/(\n|^)[ \t]+\n$/, "\n\n");

	            // 没有选择区域,光标不是在如下行的结束位置:
	            // 列表、代码、引用
	            // 那么将光标以后的部分当成是临时选择区域
	            if (!chunk.selection && !/^[ \t]*(?:\n|$)/.test(chunk.after)) {
	                chunk.after = chunk.after.replace(/^[^\n]*/, function (wholeMatch) {
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

	    }, {
	        key: "doIndent",
	        value: function doIndent(chunk, postProcessing) {
	            var regex = /(\n|^)([ ]{4,})(.*)$/;

	            if (regex.test(chunk.before)) chunk.before += "\n" + chunk.before.match(regex)[2];else chunk.before += "\n";
	        }

	        /**
	         * 引用模块
	         * @param chunk
	         * @param postProcessing
	         */

	    }, {
	        key: "doBlockQuote",
	        value: function doBlockQuote(chunk, postProcessing) {
	            chunk.selection = chunk.selection.replace(/^(\n*)([^\r]+?)(\n*)$/, function (totalMatch, newlinesBefore, text, newlinesAfter) {
	                chunk.before += newlinesBefore;
	                chunk.after = newlinesAfter + chunk.after;
	                return text;
	            });

	            chunk.before = chunk.before.replace(/(>[ \t]*)$/, function (totalMatch, blankLine) {
	                chunk.selection = blankLine + chunk.selection;
	                return "";
	            });

	            chunk.selection = chunk.selection.replace(/^(\s|>)+$/, "");
	            chunk.selection = chunk.selection || this.getString("quoteexample");

	            var match = "",
	                leftOver = "",
	                line = void 0;
	            if (chunk.before) {
	                var lines = chunk.before.replace(/\n$/, "").split("\n");
	                var inChain = false;
	                for (var i = 0; i < lines.length; i++) {
	                    var good = false;
	                    line = lines[i];
	                    inChain = inChain && line.length > 0; // c) any non-empty line continues the chain
	                    if (/^>/.test(line)) {
	                        // a)
	                        good = true;
	                        if (!inChain && line.length > 1) // c) any line that starts with ">" and has at least one more character starts the chain
	                            inChain = true;
	                    } else if (/^[ \t]*$/.test(line)) {
	                        // b)
	                        good = true;
	                    } else {
	                        good = inChain; // c) the line is not empty and does not start with ">", so it matches if and only if we're in the chain
	                    }
	                    if (good) {
	                        match += line + "\n";
	                    } else {
	                        leftOver += match + line;
	                        match = "\n";
	                    }
	                }
	                if (!/(^|\n)>/.test(match)) {
	                    // d)
	                    leftOver += match;
	                    match = "";
	                }
	            }

	            chunk.startTag = match;
	            chunk.before = leftOver;

	            if (chunk.after) {
	                chunk.after = chunk.after.replace(/^\n?/, "\n");
	            }

	            chunk.after = chunk.after.replace(/^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/, function (totalMatch) {
	                chunk.endTag = totalMatch;
	                return "";
	            });

	            var replaceBlanksInTags = function replaceBlanksInTags(useBracket) {

	                var replacement = useBracket ? "> " : "";

	                if (chunk.startTag) {
	                    chunk.startTag = chunk.startTag.replace(/\n((>|\s)*)\n$/, function (totalMatch, markdown) {
	                        return "\n" + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + "\n";
	                    });
	                }
	                if (chunk.endTag) {
	                    chunk.endTag = chunk.endTag.replace(/^\n((>|\s)*)\n/, function (totalMatch, markdown) {
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
	                chunk.selection = chunk.selection.replace(/^(> *)/, function (wholeMatch, blanks) {
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

	    }, {
	        key: "doCode",
	        value: function doCode(chunk, postProcessing) {
	            var hasTextBefore = /\S[ ]*$/.test(chunk.before);
	            var hasTextAfter = /^[ ]*\S/.test(chunk.after);

	            // 光标前后没有任何字符 使用四个空格匹配当前选择行或者多行
	            if (!hasTextAfter && !hasTextBefore || /\n/.test(chunk.selection)) {

	                chunk.before = chunk.before.replace(/[ ]{4}$/, function (totalMatch) {
	                    chunk.selection = totalMatch + chunk.selection;
	                    return "";
	                });

	                var nLinesBack = 1;
	                var nLinesForward = 1;

	                if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
	                    nLinesBack = 0;
	                }

	                if (/^\n(\t|[ ]{4,})/.test(chunk.after)) {
	                    nLinesForward = 0;
	                }

	                chunk.skipLines(nLinesBack, nLinesForward);

	                if (!chunk.selection) {
	                    // chunk.startTag = "```\n";
	                    // chunk.selection = this.getString("codeexample");
	                    // chunk.endTag = "\n```";
	                    chunk.startTag = "    ";
	                    chunk.selection = this.getString("codeexample");
	                } else {
	                    if (/^[ ]{0,3}\S/m.test(chunk.selection)) {
	                        if (/\n/.test(chunk.selection)) chunk.selection = chunk.selection.replace(/^/gm, "    ");else // if it's not multiline, do not select the four added spaces; this is more consistent with the doList behavior
	                            chunk.before += "    ";
	                    } else {
	                        chunk.selection = chunk.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t)/gm, "");
	                    }
	                }
	            } else {
	                // 使用 (`) 限定边界
	                chunk.trimWhitespace();
	                chunk.findTags(/`/, /`/);
	                if (!chunk.startTag && !chunk.endTag) {
	                    chunk.startTag = chunk.endTag = "`";
	                    if (!chunk.selection) {
	                        chunk.selection = this.getString("codeexample");
	                    }
	                } else if (chunk.endTag && !chunk.startTag) {
	                    chunk.before += chunk.endTag;
	                    chunk.endTag = "";
	                } else {
	                    chunk.startTag = chunk.endTag = "";
	                }
	            }
	        }
	    }, {
	        key: "doList",
	        value: function doList(chunk, postProcessing, isNumberedList) {
	            // 一般都是一样的, 除了一些特殊的开始和结束,可以使用正则表达式,能够看得更清楚些
	            var previousItemsRegex = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
	            var nextItemsRegex = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;

	            // 默认的符号是破折号,当然使用其他的也是可以的, 没有特定的html符号, 这仅仅是个markdown符号
	            var bullet = "-";

	            // 如果数字列表, 初始化数值
	            var num = 1;

	            // 获取列表前缀 - 例如:" 1. " 数字列表, " - " 普通列表
	            var getItemPrefix = function getItemPrefix() {
	                var prefix = void 0;
	                if (isNumberedList) {
	                    prefix = " " + num + ". ";
	                    num++;
	                } else {
	                    prefix = " " + bullet + " ";
	                }
	                return prefix;
	            };

	            // 修复一下列表的前缀
	            var getPrefixedItem = function getPrefixedItem(itemText) {
	                // 当调用自动缩进功能的时候, 数字表示被重置
	                if (isNumberedList === undefined) {
	                    isNumberedList = /^\s*\d/.test(itemText);
	                }

	                // 重新编号
	                itemText = itemText.replace(/^[ ]{0,3}([*+-]|\d+[.])\s/gm, function (_) {
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

	                var hasDigits = /\d+[.]/.test(chunk.startTag);
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

	            var nLinesUp = 1;

	            chunk.before = chunk.before.replace(previousItemsRegex, function (itemText) {
	                if (/^\s*([*+-])/.test(itemText)) {
	                    bullet = RegExp.$1;
	                }
	                nLinesUp = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
	                return getPrefixedItem(itemText);
	            });

	            if (!chunk.selection) {
	                chunk.selection = this.getString("litem");
	            }

	            var prefix = getItemPrefix();

	            var nLinesDown = 1;

	            chunk.after = chunk.after.replace(nextItemsRegex, function (itemText) {
	                nLinesDown = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
	                return getPrefixedItem(itemText);
	            });

	            chunk.trimWhitespace(true);
	            chunk.skipLines(nLinesUp, nLinesDown, true);
	            chunk.startTag = prefix;
	            var spaces = prefix.replace(/./g, " ");
	            this.wrap(chunk, SETTINGS.lineLength - spaces.length);
	            chunk.selection = chunk.selection.replace(/\n/g, "\n" + spaces);
	        }
	    }, {
	        key: "doHeading",
	        value: function doHeading(chunk, postProcessing) {
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
	            var headerLevel = 0;

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
	            var headerLevelToCreate = headerLevel == 0 ? 2 : headerLevel - 1;

	            if (headerLevelToCreate > 0) {
	                // 该功能只创建一级标题和二级标题
	                var headerChar = headerLevelToCreate >= 2 ? "-" : "=";
	                var len = chunk.selection.length;
	                if (len > SETTINGS.lineLength) {
	                    len = SETTINGS.lineLength;
	                }
	                chunk.endTag = "\n";
	                while (len--) {
	                    chunk.endTag += headerChar;
	                }
	            }
	        }
	    }, {
	        key: "doLinkOrImage",
	        value: function doLinkOrImage(chunk, postProcessing, isImage) {
	            var _this = this;

	            chunk.trimWhitespace();
	            chunk.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\[.*?\])?/);

	            if (chunk.endTag.length > 1 && chunk.startTag.length > 0) {
	                chunk.startTag = chunk.startTag.replace(/!?\[/, "");
	                chunk.endTag = "";
	                this.addLinkDef(chunk, null);
	            } else {
	                chunk.selection = chunk.startTag + chunk.selection + chunk.endTag;
	                chunk.startTag = chunk.endTag = "";

	                if (/\n\n/.test(chunk.selection)) {
	                    this.addLinkDef(chunk, null);
	                    return;
	                }

	                var linkEnteredCallback = function linkEnteredCallback(link) {
	                    if (link !== null) {
	                        chunk.selection = (" " + chunk.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, "$1\\").substr(1);

	                        var linkDef = " [999]: " + _this._properlyEncoded(link);

	                        var num = _this.addLinkDef(chunk, linkDef);
	                        chunk.startTag = isImage ? "![" : "[";
	                        chunk.endTag = "][" + num + "]";

	                        if (!chunk.selection) {
	                            if (isImage) {
	                                chunk.selection = _this.getString("imagedescription");
	                            } else {
	                                chunk.selection = _this.getString("linkdescription");
	                            }
	                        }
	                    }

	                    postProcessing();
	                };

	                if (isImage) {
	                    this.dialog.image(this.getString("imagedialog"), linkEnteredCallback);
	                } else {
	                    this.dialog.link(this.getString("linkdialog"), linkEnteredCallback);
	                }
	                return true;
	            }
	        }
	    }, {
	        key: "doHorizontalRule",
	        value: function doHorizontalRule(chunk, postProcessing) {
	            chunk.startTag = "----------\n";
	            chunk.selection = "";
	            chunk.skipLines(2, 1, true);
	        }
	    }, {
	        key: "doTab",
	        value: function doTab(chunk, postProcessing, isShift) {
	            var beforeRex = /.*$/;
	            var afterRex = /^.*/;
	            var process = function process(whole, $1, $2) {
	                if ($2.length < 4) {
	                    return $1;
	                } else {
	                    return $1 + $2.replace(/[ ]{4}/, "");
	                }
	            };

	            if (isShift) {
	                // 不是选择的多行
	                if (!/\n+/.test(chunk.selection)) {
	                    var regex = /(\n|^)([ ]+)$/;
	                    chunk.before = chunk.before.replace(regex, process);
	                } else {
	                    chunk.selection = chunk.before.match(beforeRex)[0] + chunk.selection + chunk.after.match(afterRex)[0];

	                    chunk.before = chunk.before.replace(beforeRex, "");
	                    chunk.after = chunk.after.replace(afterRex, "");

	                    var _regex = /(\n|^)([ ]+)/mg;

	                    chunk.selection = chunk.selection.replace(_regex, process);
	                }
	            } else {
	                // 不是选择的多行
	                if (!/\n+/.test(chunk.selection)) {
	                    chunk.startTag = "    ";
	                } else {
	                    chunk.selection = chunk.before.match(beforeRex)[0] + chunk.selection;
	                    chunk.before = chunk.before.replace(beforeRex, "");

	                    var _regex2 = /(^|\n)(.+)/mg;

	                    chunk.selection = chunk.selection.replace(_regex2, "$1    $2");
	                }
	            }
	        }
	    }, {
	        key: "_properlyEncoded",
	        value: function _properlyEncoded(linkdef) {
	            return linkdef.replace(/^\s*(.*?)(?:\s+"(.+)")?\s*$/, function (wholematch, link, title) {

	                var inQueryString = false;

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
	                            if (inQueryString) return "%20";
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
	    }, {
	        key: "addLinkDef",
	        value: function addLinkDef(chunk, linkDef) {
	            var refNumber = 0,
	                defsToAdd = {};
	            // 查找并删除之前的连接标记
	            chunk.before = this.stripLinkDefs(chunk.before, defsToAdd);
	            chunk.selection = this.stripLinkDefs(chunk.selection, defsToAdd);
	            chunk.after = this.stripLinkDefs(chunk.after, defsToAdd);

	            var defs = "";
	            var regex = /(\[)((?:\[[^\]]*\]|[^\[\]])*)(\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;

	            var complete = chunk.before + chunk.selection + chunk.after;

	            var fakedefs = "\n\n";

	            var skippedChars = 0;
	            var _uniquify = void 0;

	            var uniquified = complete.replace(regex, _uniquify = function uniquify(wholeMatch, before, inner, afterInner, id, end, offset) {
	                skippedChars += offset;
	                fakedefs += " [" + skippedChars + "]: " + skippedChars + "/unicorn\n";
	                skippedChars += before.length;
	                inner = inner.replace(regex, _uniquify);
	                skippedChars -= before.length;
	                var result = before + inner + afterInner + skippedChars + end;
	                skippedChars -= offset;
	                return result;
	            });

	            var addDefNumber = function addDefNumber(def) {
	                refNumber++;
	                def = def.replace(/^[ ]{0,3}\[(\d+)\]:/, "  [" + refNumber + "]:");
	                defs += "\n" + def;
	            };

	            var getLink = function getLink(wholeMatch, before, inner, afterInner, id, end, offset) {
	                skippedChars += offset + before.length;
	                inner = inner.replace(regex, getLink);
	                skippedChars -= offset + before.length;
	                if (defsToAdd[id]) {
	                    addDefNumber(defsToAdd[id]);
	                    return before + inner + afterInner + refNumber + end;
	                }
	                return wholeMatch;
	            };

	            var len = chunk.before.length;
	            chunk.before = chunk.before.replace(regex, getLink);
	            skippedChars += len;

	            len = chunk.selection.length;
	            if (linkDef) {
	                addDefNumber(linkDef);
	            } else {
	                chunk.selection = chunk.selection.replace(regex, getLink);
	            }
	            skippedChars += len;

	            var refOut = refNumber;

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
	    }, {
	        key: "stripLinkDefs",
	        value: function stripLinkDefs(text, defsToAdd) {
	            var regex = /^[ ]{0,3}\[(\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm;
	            text = text.replace(regex, function (totalMatch, id, link, newlines, title) {
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
	    }]);

	    return CommandManager;
	}();

	exports.CommandManager = CommandManager;

/***/ },

/***/ 41:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UndoManager = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _TextAreaState = __webpack_require__(32);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 操作管理, 计算redo或者undo
	 */
	var UndoManager = function () {

	    /**
	     * 操作管理类
	     */
	    function UndoManager(textArea) {
	        _classCallCheck(this, UndoManager);

	        this.input = textArea;
	        this.mode = 'none';
	        this.lastState = null;
	        this.undoStack = [];
	        this.stackPtr = 0;

	        this.setEventHandlers();
	        this.refreshState(true);
	        this.saveState();
	    }

	    _createClass(UndoManager, [{
	        key: "setMode",
	        value: function setMode(newMode, noSave) {
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
	    }, {
	        key: "setCommandMode",
	        value: function setCommandMode() {
	            var _this = this;

	            this.mode = "command";
	            this.saveState();
	            this.timer = setTimeout(function () {
	                return _this.refreshState();
	            }, 0);
	        }
	    }, {
	        key: "saveState",
	        value: function saveState() {
	            var currState = this.inputStateObj || new _TextAreaState.TextAreaState(this.input);

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
	    }, {
	        key: "refreshState",
	        value: function refreshState(isInitialState) {
	            this.inputStateObj = new _TextAreaState.TextAreaState(this.input, isInitialState);
	            this.timer = undefined;
	        }
	    }, {
	        key: "setEventHandlers",
	        value: function setEventHandlers() {
	            var _this2 = this;

	            $(this.input).on('keypress', function (event) {
	                if ((event.ctrlKey || event.metaKey) && !event.altKey && (event.keyCode == 89 || event.keyCode == 90)) {
	                    event.preventDefault();
	                }
	            });

	            var handlePaste = function handlePaste() {
	                if (_this2.inputStateObj && _this2.inputStateObj.text != _this2.input.value) {
	                    if (_this2.timer == undefined) {
	                        _this2.mode = "paste";
	                        _this2.saveState();
	                        _this2.refreshState();
	                    }
	                }
	            };

	            $(this.input).on("keydown", function (event) {
	                var handled = false;

	                if ((event.ctrlKey || event.metaKey) && !event.altKey) {

	                    var keyCodeChar = String.fromCharCode(event.keyCode);

	                    switch (keyCodeChar.toLowerCase()) {
	                        case "y":
	                            _this2.redo();
	                            handled = true;
	                            break;

	                        case "z":
	                            if (!event.shiftKey) {
	                                _this2.undo();
	                            } else {
	                                _this2.redo();
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
	            }).on("keydown", function (event) {
	                if (!event.ctrlKey && !event.metaKey) {

	                    var keyCode = event.keyCode;

	                    if (keyCode >= 33 && keyCode <= 40 || keyCode >= 63232 && keyCode <= 63235) {
	                        // 33 - 40: page up/dn and arrow keys
	                        // 63232 - 63235: page up/dn and arrow keys on safari
	                        _this2.setMode("moving");
	                    } else if (keyCode == 8 || keyCode == 46 || keyCode == 127) {
	                        // 8: backspace
	                        // 46: delete
	                        // 127: delete
	                        _this2.setMode("deleting");
	                    } else if (keyCode == 13) {
	                        // 13: Enter
	                        _this2.setMode("newlines");
	                    } else if (keyCode == 27) {
	                        // 27: escape
	                        _this2.setMode("escape");
	                    } else if ((keyCode < 16 || keyCode > 20) && keyCode != 91) {
	                        // 16-20 are shift, etc.
	                        // 91: left window key
	                        // I think this might be a little messed up since there are
	                        // a lot of nonprinting keys above 20.
	                        _this2.setMode("typing");
	                    }
	                }
	            }).on("mousedown", function () {
	                _this2.setMode("moving");
	            });

	            $(this.input).on("paste drop", handlePaste);
	        }
	    }, {
	        key: "undo",
	        value: function undo() {
	            if (this.canUndo()) {
	                if (this.lastState) {
	                    // What about setting state -1 to null or checking for undefined?
	                    this.lastState.restore();
	                    this.lastState = null;
	                } else {
	                    this.undoStack[this.stackPtr] = new _TextAreaState.TextAreaState(this.input);
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
	    }, {
	        key: "redo",
	        value: function redo() {
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

	    }, {
	        key: "canRedo",
	        value: function canRedo() {
	            if (this.undoStack[this.stackPtr + 1]) {
	                return true;
	            }
	            return false;
	        }

	        /**
	         * 能否撤销
	         * @returns {boolean}
	         */

	    }, {
	        key: "canUndo",
	        value: function canUndo() {
	            return this.stackPtr > 1;
	        }
	    }]);

	    return UndoManager;
	}();

	exports.UndoManager = UndoManager;

/***/ },

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Format = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _TextAreaState = __webpack_require__(32);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Format = function () {
	    function Format(input, converter) {
	        _classCallCheck(this, Format);

	        this.input = input;
	        this.converter = converter;
	    }

	    _createClass(Format, [{
	        key: "getHtml",
	        value: function getHtml() {
	            return this.converter.makeHtml(this.input.value);
	        }
	    }, {
	        key: "getPreviewHtml",
	        value: function getPreviewHtml() {
	            var text = this.insertCursor();

	            var html = this.converter.makeHtml(text);

	            return this.handlerCursor(html);
	        }

	        /**
	         * 插入光标
	         * @returns {*}
	         */

	    }, {
	        key: "insertCursor",
	        value: function insertCursor() {
	            var chunk = new _TextAreaState.TextAreaState(this.input, true).getChunk();
	            // 判断分割线
	            var line = chunk.before.match(/.*$/)[0] + chunk.after.match(/^.*/)[0];
	            if (line.length > 2 && !/[^-]+/.test(line)) {
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

	    }, {
	        key: "handlerCursor",
	        value: function handlerCursor(html) {
	            // 是否在标签内部
	            var regexp = new RegExp('(<[^>]*)(' + this.specialString + ')([^<]*>)');
	            if (regexp.test(html)) {
	                html = html.replace(regexp, "$2$1$3").replace(regexp, "$1$3");
	            }
	            // 如果跑到了h2中,应该是hr的
	            regexp = new RegExp('<h2>(' + this.specialString + ")</h2>");
	            if (regexp.test(html)) {
	                html = html.replace(regexp, "$1<hr/>");
	            }
	            if (html) html = html.replace(this.specialString, "<span class='cursor'></span>");

	            return html;
	        }
	    }]);

	    return Format;
	}();

	exports.Format = Format;

/***/ },

/***/ 43:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var hljs = __webpack_require__(44);
	var hljscss = __webpack_require__(213);
	var raphael = __webpack_require__(216);
	var flowchart = __webpack_require__(218);

	var PreviewManager = function () {
	    function PreviewManager(panel, format) {
	        var _this = this;

	        _classCallCheck(this, PreviewManager);

	        this.panel = panel;
	        this.format = format;
	        this.maxDelay = 3000;
	        this.specialString = "MDEditorSpecialString";

	        this.registerEvents(this.panel.input, function () {
	            return _this.applyTimeout();
	        });
	        this.makePreviewHtml();
	        this.panel.preview.scrollTop = 0;
	    }

	    _createClass(PreviewManager, [{
	        key: "registerEvents",
	        value: function registerEvents(input, listener) {
	            $(input).bind('input paste drop keypress keydown', listener);
	        }
	    }, {
	        key: "refresh",
	        value: function refresh(requiresRefresh) {
	            if (requiresRefresh) {
	                this.oldInputText = "";
	                this.makePreviewHtml();
	            } else {
	                this.applyTimeout();
	            }
	        }
	    }, {
	        key: "applyTimeout",
	        value: function applyTimeout() {
	            var _this2 = this;

	            if (this.timeout) {
	                clearTimeout(this.timeout);
	                this.timeout = undefined;
	            }

	            this.timeout = setTimeout(function () {
	                return _this2.makePreviewHtml();
	            }, this.elapsedTime);
	        }
	    }, {
	        key: "makePreviewHtml",
	        value: function makePreviewHtml() {
	            var text = this.panel.input.value;
	            if (text && text == this.oldInputText) {
	                return; // 文本没有变化,不进行下一步的操作
	            } else {
	                this.oldInputText = text;
	            }

	            var prevTime = new Date().getTime();

	            text = this.format.getPreviewHtml();

	            // 计算转换Html的时间, 这个时间用于时间监听的延迟时间
	            var currTime = new Date().getTime();
	            this.elapsedTime = currTime - prevTime;

	            $(this.panel.preview).html(text);

	            this.afterPreview();

	            this.setPreviewScrollTops();
	        }

	        /**
	         * 设置预览滚动
	         */

	    }, {
	        key: "setPreviewScrollTops",
	        value: function setPreviewScrollTops() {
	            var _this3 = this;

	            var cur = $('.cursor'),
	                code = cur.parent('code'),
	                pre = code.parent('pre');

	            if (cur.length == 0) {
	                return;
	            }

	            if (code.length == 1) {
	                this.panel.preview.scrollTop += pre.position().top;
	                pre.scrollTop((pre.height() - pre.innerHeight()) / 2 + pre.scrollTop() + cur.position().top);
	                return;
	            }

	            if (cur.parentsUntil('p').length != 0) {
	                cur.parent().addClass('diff');
	                if (this.t) clearTimeout(this.t);

	                this.t = setTimeout(function () {
	                    cur.parent().removeAttr("class");
	                }, 3000);
	            }

	            setTimeout(function () {
	                if (cur.position().top < _this3.panel.preview.clientHeight && cur.position().top > 0) {
	                    return;
	                }
	                _this3.panel.preview.scrollTop = _this3.panel.preview.scrollTop + cur.position().top;
	            }, 0);
	        }
	    }, {
	        key: "afterPreview",
	        value: function afterPreview() {
	            this.runHighlight();
	            this.runFlowchart();
	        }

	        /**
	         * 执行高亮
	         */

	    }, {
	        key: "runHighlight",
	        value: function runHighlight() {
	            if (this.highlight && $('code[class!=flow]').length) {
	                hljs(function (hljs) {
	                    hljscss(function () {});
	                    $('code').each(function (i, code) {
	                        hljs.highlightBlock(code);
	                    });
	                });
	            }
	        }

	        /**
	         * 执行flow
	         */

	    }, {
	        key: "runFlowchart",
	        value: function runFlowchart() {
	            if (this.flowchart && $("code.flow").length) {
	                $("code.flow").each(function (i, code) {
	                    var _this4 = this;

	                    flowchart(function () {
	                        $(_this4).parent('pre').css({ "overflow": "visible", "max-height": "none" });
	                        $(_this4).flowChart();
	                    });
	                });
	            }
	        }
	    }]);

	    return PreviewManager;
	}();

	exports.PreviewManager = PreviewManager;

/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(cb) {
		__webpack_require__.e/* nsure */(4, function(require) {
			cb(__webpack_require__(45));
		});
	}

/***/ },

/***/ 213:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(cb) {
		__webpack_require__.e/* nsure */(5, function(require) {
			cb(__webpack_require__(214));
		});
	}

/***/ },

/***/ 216:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(cb) {
		__webpack_require__.e/* nsure */(6, function(require) {
			cb(__webpack_require__(217));
		});
	}

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(cb) {
		__webpack_require__.e/* nsure */(7, function(require) {
			cb(__webpack_require__(219));
		});
	}

/***/ },

/***/ 234:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// Generated by CoffeeScript 1.10.0
	(function() {
	  var Parser,
	    slice = [].slice;

	  Parser = (function() {
	    var array_keys, array_values, htmlspecialchars, preg_quote, str_replace, trim, ucfirst;

	    ucfirst = function(str) {
	      return (str.charAt(0)).toUpperCase() + str.substring(1);
	    };

	    preg_quote = function(str) {
	      return str.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	    };

	    str_replace = function(search, replace, str) {
	      var i, j, l, len, len1, val;
	      if (search instanceof Array) {
	        if (replace instanceof Array) {
	          for (i = j = 0, len = search.length; j < len; i = ++j) {
	            val = search[i];
	            str = str_replace(val, replace[i], str);
	          }
	        } else {
	          for (l = 0, len1 = search.length; l < len1; l++) {
	            val = search[l];
	            str = str_replace(val, replace, str);
	          }
	        }
	      } else {
	        search = preg_quote(search);
	        str = str.replace(new RegExp(search, 'g'), replace);
	      }
	      return str;
	    };

	    htmlspecialchars = function(str) {
	      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
	    };

	    trim = function(str, ch) {
	      var c, i, j, ref, search;
	      if (ch == null) {
	        ch = null;
	      }
	      if (ch != null) {
	        search = '';
	        for (i = j = 0, ref = ch.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	          c = ch[i];
	          c = preg_quote(c);
	          search += c;
	        }
	        search = '[' + search + ']*';
	        return str.replace(new RegExp('^' + search), '').replace(new RegExp(search + '$'), '');
	      } else {
	        return str.replace(/^\s*/, '').replace(/\s*$/, '');
	      }
	    };

	    array_keys = function(arr) {
	      var _, j, k, len, result;
	      result = [];
	      if (arr instanceof Array) {
	        for (k = j = 0, len = arr.length; j < len; k = ++j) {
	          _ = arr[k];
	          result.push(k);
	        }
	      } else {
	        for (k in arr) {
	          result.push(k);
	        }
	      }
	      return result;
	    };

	    array_values = function(arr) {
	      var _, j, len, result, v;
	      result = [];
	      if (arr instanceof Array) {
	        for (j = 0, len = arr.length; j < len; j++) {
	          v = arr[j];
	          result.push(v);
	        }
	      } else {
	        for (_ in arr) {
	          v = arr[_];
	          result.push(v);
	        }
	      }
	      return result;
	    };

	    function Parser() {
	      this.commonWhiteList = 'kbd|b|i|strong|em|sup|sub|br|code|del|a|hr|small';
	      this.specialWhiteList = {
	        table: 'table|tbody|thead|tfoot|tr|td|th'
	      };
	      this.hooks = {};
	    }

	    Parser.prototype.makeHtml = function(text) {
	      var html;
	      this.footnotes = [];
	      this.definitions = {};
	      this.holders = {};
	      this.uniqid = (Math.ceil(Math.random() * 10000000)) + (Math.ceil(Math.random() * 10000000));
	      this.id = 0;
	      text = this.initText(text);
	      html = this.parse(text);
	      return this.makeFootnotes(html);
	    };

	    Parser.prototype.hook = function(type, cb) {
	      if (this.hooks[type] == null) {
	        this.hooks[type] = [];
	      }
	      return this.hooks[type].push(cb);
	    };

	    Parser.prototype.makeHolder = function(str) {
	      var key;
	      key = "|\r" + this.uniqid + this.id + "\r|";
	      this.id += 1;
	      this.holders[key] = str;
	      return key;
	    };

	    Parser.prototype.initText = function(text) {
	      return text.replace(/\t/g, '    ').replace(/\r/g, '');
	    };

	    Parser.prototype.makeFootnotes = function(html) {
	      var index, val;
	      if (this.footnotes.length > 0) {
	        html += '<div class="footnotes"><hr><ol>';
	        index = 1;
	        while (val = this.footnotes.shift()) {
	          if (typeof val === 'string') {
	            val += " <a href=\"#fnref-" + index + "\" class=\"footnote-backref\">&#8617;</a>";
	          } else {
	            val[val.length - 1] += " <a href=\"#fnref-" + index + "\" class=\"footnote-backref\">&#8617;</a>";
	            val = val.length > 1 ? this.parse(val.join("\n")) : this.parseInline(val[0]);
	          }
	          html += "<li id=\"fn-" + index + "\">" + val + "</li>";
	          index += 1;
	        }
	        html += '</ol></div>';
	      }
	      return html;
	    };

	    Parser.prototype.parse = function(text) {
	      var block, blocks, end, extract, html, j, len, lines, method, result, start, type, value;
	      lines = [];
	      blocks = this.parseBlock(text, lines);
	      html = '';
	      for (j = 0, len = blocks.length; j < len; j++) {
	        block = blocks[j];
	        type = block[0], start = block[1], end = block[2], value = block[3];
	        extract = lines.slice(start, end + 1);
	        method = 'parse' + ucfirst(type);
	        extract = this.call('before' + ucfirst(method), extract, value);
	        result = this[method](extract, value);
	        result = this.call('after' + ucfirst(method), result, value);
	        html += result;
	      }
	      return html;
	    };

	    Parser.prototype.call = function() {
	      var args, callback, j, len, ref, type, value;
	      type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	      value = args[0];
	      if (this.hooks[type] == null) {
	        return value;
	      }
	      ref = this.hooks[type];
	      for (j = 0, len = ref.length; j < len; j++) {
	        callback = ref[j];
	        value = callback.apply(this, args);
	        args[0] = value;
	      }
	      return value;
	    };

	    Parser.prototype.releaseHolder = function(text, clearHolders) {
	      var deep;
	      if (clearHolders == null) {
	        clearHolders = true;
	      }
	      deep = 0;
	      while ((text.indexOf("|\r")) >= 0 && deep < 10) {
	        text = str_replace(array_keys(this.holders), array_values(this.holders), text);
	        deep += 1;
	      }
	      if (clearHolders) {
	        this.holders = {};
	      }
	      return text;
	    };

	    Parser.prototype.parseInline = function(text, whiteList, clearHolders, enableAutoLink) {
	      if (whiteList == null) {
	        whiteList = '';
	      }
	      if (clearHolders == null) {
	        clearHolders = true;
	      }
	      if (enableAutoLink == null) {
	        enableAutoLink = true;
	      }
	      text = this.call('beforeParseInline', text);
	      text = text.replace(/(^|[^\\])(`+)(.+?)\2/mg, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return matches[1] + _this.makeHolder('<code>' + (htmlspecialchars(matches[3])) + '</code>');
	        };
	      })(this));
	      text = text.replace(/<(https?:\/\/.+)>/ig, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return _this.makeHolder("<a href=\"" + matches[1] + "\">" + matches[1] + "</a>");
	        };
	      })(this));
	      text = text.replace(/<(\/?)([a-z0-9-]+)(\s+[^>]*)?>/ig, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          if ((('|' + _this.commonWhiteList + '|' + whiteList + '|').indexOf('|' + matches[2].toLowerCase() + '|')) >= 0) {
	            return _this.makeHolder(matches[0]);
	          } else {
	            return htmlspecialchars(matches[0]);
	          }
	        };
	      })(this));
	      text = str_replace(['<', '>'], ['&lt;', '&gt;'], text);
	      text = text.replace(/\[\^((?:[^\]]|\]|\[)+?)\]/g, (function(_this) {
	        return function() {
	          var id, matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          id = _this.footnotes.indexOf(matches[1]);
	          if (id < 0) {
	            id = _this.footnotes.length + 1;
	            _this.footnotes.push(_this.parseInline(matches[1], '', false));
	          }
	          return _this.makeHolder("<sup id=\"fnref-" + id + "\"><a href=\"#fn-" + id + "\" class=\"footnote-ref\">" + id + "</a></sup>");
	        };
	      })(this));
	      text = text.replace(/!\[((?:[^\]]|\]|\[)*?)\]\(((?:[^\)]|\)|\()+?)\)/g, (function(_this) {
	        return function() {
	          var escaped, matches, url;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          escaped = _this.escapeBracket(matches[1]);
	          url = _this.escapeBracket(matches[2]);
	          return _this.makeHolder("<img src=\"" + url + "\" alt=\"" + escaped + "\" title=\"" + escaped + "\">");
	        };
	      })(this));
	      text = text.replace(/!\[((?:[^\]]|\]|\[)*?)\]\[((?:[^\]]|\]|\[)+?)\]/g, (function(_this) {
	        return function() {
	          var escaped, matches, result;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          escaped = _this.escapeBracket(matches[1]);
	          result = _this.definitions[matches[2]] != null ? "<img src=\"" + _this.definitions[matches[2]] + "\" alt=\"" + escaped + "\" title=\"" + escaped + "\">" : escaped;
	          return _this.makeHolder(result);
	        };
	      })(this));
	      text = text.replace(/\[((?:[^\]]|\]|\[)+?)\]\(((?:[^\)]|\)|\()+?)\)/g, (function(_this) {
	        return function() {
	          var escaped, matches, url;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          escaped = _this.parseInline(_this.escapeBracket(matches[1]), '', false, false);
	          url = _this.escapeBracket(matches[2]);
	          return _this.makeHolder("<a href=\"" + url + "\">" + escaped + "</a>");
	        };
	      })(this));
	      text = text.replace(/\[((?:[^\]]|\]|\[)+?)\]\[((?:[^\]]|\]|\[)+?)\]/g, (function(_this) {
	        return function() {
	          var escaped, matches, result;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          escaped = _this.parseInline(_this.escapeBracket(matches[1]), '', false, false);
	          result = _this.definitions[matches[2]] != null ? "<a href=\"" + _this.definitions[matches[2]] + "\">" + escaped + "</a>" : escaped;
	          return _this.makeHolder(result);
	        };
	      })(this));
	      text = text.replace(/\\(x80-xff|.)/g, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return _this.makeHolder(htmlspecialchars(matches[1]));
	        };
	      })(this));
	      text = this.parseInlineCallback(text);
	      text = text.replace(/<([_a-z0-9-\.\+]+@[^@]+\.[a-z]{2,})>/ig, '<a href="mailto:$1">$1</a>');
	      text = text.replace(/(^|[^\"])((http|https|ftp|mailto):[x80-xff_a-z0-9-\.\/%#@\?\+=~\|\,&\(\)]+)($|[^\"])/ig, '$1<a href="$2">$2</a>$4');
	      text = this.call('afterParseInlineBeforeRelease', text);
	      text = this.releaseHolder(text, clearHolders);
	      text = this.call('afterParseInline', text);
	      return text;
	    };

	    Parser.prototype.parseInlineCallback = function(text) {
	      text = text.replace(/(\*{3})(.+?)\1/g, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return '<strong><em>' + (_this.parseInlineCallback(matches[2])) + '</em></strong>';
	        };
	      })(this));
	      text = text.replace(/(\*{2})(.+?)\1/g, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return '<strong>' + (_this.parseInlineCallback(matches[2])) + '</strong>';
	        };
	      })(this));
	      text = text.replace(/(\*)(.+?)\1/g, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return '<em>' + (_this.parseInlineCallback(matches[2])) + '</em>';
	        };
	      })(this));
	      text = text.replace(/(\s+|^)(_{3})(.+?)\2(\s+|$)/g, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return matches[1] + '<strong><em>' + (_this.parseInlineCallback(matches[3])) + '</em></strong>' + matches[4];
	        };
	      })(this));
	      text = text.replace(/(\s+|^)(_{2})(.+?)\2(\s+|$)/g, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return matches[1] + '<strong>' + (_this.parseInlineCallback(matches[3])) + '</strong>' + matches[4];
	        };
	      })(this));
	      text = text.replace(/(\s+|^)(_)(.+?)\2(\s+|$)/g, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return matches[1] + '<em>' + (_this.parseInlineCallback(matches[3])) + '</em>' + matches[4];
	        };
	      })(this));
	      text = text.replace(/(~{2})(.+?)\1/, (function(_this) {
	        return function() {
	          var matches;
	          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return '<del>' + (_this.parseInlineCallback(matches[2])) + '</del>';
	        };
	      })(this));
	      return text;
	    };

	    Parser.prototype.parseBlock = function(text, lines) {
	      var align, aligns, block, emptyCount, head, isAfterList, j, key, l, len, len1, len2, line, m, matches, num, ref, row, rows, space, special, tag;
	      ref = text.split("\n");
	      for (j = 0, len = ref.length; j < len; j++) {
	        line = ref[j];
	        lines.push(line);
	      }
	      this.blocks = [];
	      this.current = 'normal';
	      this.pos = -1;
	      special = (array_keys(this.specialWhiteList)).join('|');
	      emptyCount = 0;
	      for (key = l = 0, len1 = lines.length; l < len1; key = ++l) {
	        line = lines[key];
	        block = this.getBlock();
	        if (block != null) {
	          block = block.slice(0);
	        }
	        if (!!(matches = line.match(/^(\s*)(~|`){3,}([^`~]*)$/i))) {
	          if (this.isBlock('code')) {
	            isAfterList = block[3][2];
	            if (isAfterList) {
	              this.combineBlock().setBlock(key);
	            } else {
	              (this.setBlock(key)).endBlock();
	            }
	          } else {
	            isAfterList = false;
	            if (this.isBlock('list')) {
	              space = block[3];
	              isAfterList = (space > 0 && matches[1].length >= space) || matches[1].length > space;
	            }
	            this.startBlock('code', key, [matches[1], matches[3], isAfterList]);
	          }
	          continue;
	        } else if (this.isBlock('code')) {
	          this.setBlock(key);
	          continue;
	        }
	        if (!!(matches = line.match(new RegExp("^\\s*<(" + special + ")(\\s+[^>]*)?>", 'i')))) {
	          tag = matches[1].toLowerCase();
	          if (!(this.isBlock('html', tag)) && !(this.isBlock('pre'))) {
	            this.startBlock('html', key, tag);
	          }
	          continue;
	        } else if (!!(matches = line.match(new RegExp("</(" + special + ")>\\s*$", 'i')))) {
	          tag = matches[1].toLowerCase();
	          if (this.isBlock('html', tag)) {
	            this.setBlock(key).endBlock();
	          }
	          continue;
	        } else if (this.isBlock('html')) {
	          this.setBlock(key);
	          continue;
	        }
	        switch (true) {
	          case !!(matches = line.match(/^(\s*)((?:[0-9a-z]+\.)|\-|\+|\*)\s+/)):
	            space = matches[1].length;
	            emptyCount = 0;
	            if (this.isBlock('list')) {
	              this.setBlock(key, space);
	            } else {
	              this.startBlock('list', key, space);
	            }
	            break;
	          case !!(line.match(/^ {4}/)):
	            emptyCount = 0;
	            if ((this.isBlock('pre')) || this.isBlock('list')) {
	              this.setBlock(key);
	            } else {
	              this.startBlock('pre', key);
	            }
	            break;
	          case !!(matches = line.match(/^\[\^((?:[^\]]|\]|\[)+?)\]:/)):
	            space = matches[0].length - 1;
	            this.startBlock('footnote', key, [space, matches[1]]);
	            break;
	          case !!(matches = line.match(/^\s*\[((?:[^\]]|\]|\[)+?)\]:\s*(.+)$/)):
	            this.definitions[matches[1]] = matches[2];
	            this.startBlock('definition', key).endBlock();
	            break;
	          case !!(line.match(/^\s*>/)):
	            if (this.isBlock('quote')) {
	              this.setBlock(key);
	            } else {
	              this.startBlock('quote', key);
	            }
	            break;
	          case !!(matches = line.match(/^((?:(?:(?:[ :]*\-[ :]*)+(?:\||\+))|(?:(?:\||\+)(?:[ :]*\-[ :]*)+)|(?:(?:[ :]*\-[ :]*)+(?:\||\+)(?:[ :]*\-[ :]*)+))+)$/)):
	            if (this.isBlock('normal')) {
	              head = 0;
	              if ((block == null) || block[0] !== 'normal' || lines[block[2]].match(/^\s*$/)) {
	                this.startBlock('table', key);
	              } else {
	                head = 1;
	                this.backBlock(1, 'table');
	              }
	              if (matches[1][0] === '|') {
	                matches[1] = matches[1].substring(1);
	                if (matches[1][matches[1].length - 1] === '|') {
	                  matches[1] = matches[1].substring(0, matches[1].length - 1);
	                }
	              }
	              rows = matches[1].split(/\+|\|/);
	              aligns = [];
	              for (m = 0, len2 = rows.length; m < len2; m++) {
	                row = rows[m];
	                align = 'none';
	                if (!!(matches = row.match(/^\s*(:?)\-+(:?)\s*$/))) {
	                  if (!!matches[1] && !!matches[2]) {
	                    align = 'center';
	                  } else if (!!matches[1]) {
	                    align = 'left';
	                  } else if (!!matches[2]) {
	                    align = 'right';
	                  }
	                }
	                aligns.push(align);
	              }
	              this.setBlock(key, [[head], aligns, head + 1]);
	            } else {
	              block[3][0].push(block[3][2]);
	              block[3][2] += 1;
	              this.setBlock(key, block[3]);
	            }
	            break;
	          case !!(matches = line.match(/^(#+)(.*)$/)):
	            num = Math.min(matches[1].length, 6);
	            this.startBlock('sh', key, num).endBlock();
	            break;
	          case !!(matches = line.match(/^\s*((=|-){2,})\s*$/)) && ((block != null) && block[0] === 'normal' && !lines[block[2]].match(/^\s*$/)):
	            if (this.isBlock('normal')) {
	              this.backBlock(1, 'mh', matches[1][0] === '=' ? 1 : 2).setBlock(key).endBlock();
	            } else {
	              this.startBlock('normal', key);
	            }
	            break;
	          case !!(line.match(/^[-\*]{3,}\s*$/)):
	            this.startBlock('hr', key).endBlock();
	            break;
	          default:
	            if (this.isBlock('list')) {
	              if (line.match(/^(\s*)/)) {
	                if (emptyCount > 0) {
	                  this.startBlock('normal', key);
	                } else {
	                  this.setBlock(key);
	                }
	                emptyCount += 1;
	              } else if (emptyCount === 0) {
	                this.setBlock(key);
	              } else {
	                this.startBlock('normal', key);
	              }
	            } else if (this.isBlock('footnote')) {
	              matches = line.match(/^(\s*)/);
	              if (matches[1].length >= block[3][0]) {
	                this.setBlock(key);
	              } else {
	                startBlock('normal', key);
	              }
	            } else if (this.isBlock('table')) {
	              if (0 <= line.indexOf('|')) {
	                block[3][2] += 1;
	                this.setBlock(key, block[3]);
	              } else {
	                this.startBlock('normal', key);
	              }
	            } else if (this.isBlock('pre')) {
	              if (line.match(/^\s*$/)) {
	                if (emptyCount > 0) {
	                  this.startBlock('normal', key);
	                } else {
	                  this.setBlock(key);
	                }
	                emptyCount += 1;
	              } else {
	                this.startBlock('normal', key);
	              }
	            } else if (this.isBlock('quote')) {
	              if (line.match(/^(\s*)/)) {
	                if (emptyCount > 0) {
	                  this.startBlock('normal', key);
	                } else {
	                  this.setBlock(key);
	                }
	                emptyCount += 1;
	              } else if (emptyCount === 0) {
	                this.setBlock(key);
	              } else {
	                this.startBlock('normal', key);
	              }
	            } else {
	              if ((block == null) || block[0] !== 'normal') {
	                this.startBlock('normal', key);
	              } else {
	                this.setBlock(key);
	              }
	            }
	        }
	      }
	      return this.optimizeBlocks(this.blocks, lines);
	    };

	    Parser.prototype.optimizeBlocks = function(_blocks, _lines) {
	      var block, blocks, from, isEmpty, j, key, len, lines, nextBlock, prevBlock, to, type, types;
	      blocks = _blocks.slice(0);
	      lines = _lines.slice(0);
	      blocks = this.call('beforeOptimizeBlocks', blocks, lines);
	      for (key = j = 0, len = blocks.length; j < len; key = ++j) {
	        block = blocks[key];
	        prevBlock = blocks[key - 1] != null ? blocks[key - 1] : null;
	        nextBlock = blocks[key + 1] != null ? blocks[key + 1] : null;
	        type = block[0], from = block[1], to = block[2];
	        if ('pre' === type) {
	          isEmpty = lines.reduce(function(result, line) {
	            return (line.match(/^\s*$/)) && result;
	          }, true);
	          if (isEmpty) {
	            block[0] = type = 'normal';
	          }
	        }
	        if ('normal' === type) {
	          types = ['list', 'quote'];
	          if (from === to && (lines[from].match(/^\s*$/)) && (prevBlock != null) && (nextBlock != null)) {
	            if (prevBlock[0] === nextBlock[0] && (types.indexOf(prevBlock[0])) >= 0) {
	              blocks[key - 1] = [prevBlock[0], prevBlock[1], nextBlock[2], null];
	              blocks.splice(key, 2);
	            }
	          }
	        }
	      }
	      return this.call('afterOptimizeBlocks', blocks, lines);
	    };

	    Parser.prototype.parseCode = function(lines, parts) {
	      var blank, count, lang, rel, str;
	      blank = parts[0], lang = parts[1];
	      lang = trim(lang);
	      count = blank.length;
	      if (!lang.match(/^[_a-z0-9-\+\#\:\.]+$/i)) {
	        lang = null;
	      } else {
	        parts = lang.split(':');
	        if (parts.length > 1) {
	          lang = parts[0], rel = parts[1];
	          lang = trim(lang);
	          rel = trim(rel);
	        }
	      }
	      lines = lines.slice(1, -1).map(function(line) {
	        return line.replace(new RegExp("/^[ ]{" + count + "}/"), '');
	      });
	      str = lines.join("\n");
	      if (str.match(/^\s*$/)) {
	        return '';
	      } else {
	        return '<pre><code' + (!!lang ? " class=\"" + lang + "\"" : '') + (!!rel ? " rel=\"" + rel + "\"" : '') + '>' + (htmlspecialchars(str)) + '</code></pre>';
	      }
	    };

	    Parser.prototype.parsePre = function(lines) {
	      var str;
	      lines = lines.map(function(line) {
	        return htmlspecialchars(line.substring(4));
	      });
	      str = lines.join("\n");
	      if (str.match(/^\s*$/)) {
	        return '';
	      } else {
	        return '<pre><code>' + str + '</code></pre>';
	      }
	    };

	    Parser.prototype.parseSh = function(lines, num) {
	      var line;
	      line = this.parseInline(trim(lines[0], '# '));
	      if (line.match(/^\s*$/)) {
	        return '';
	      } else {
	        return "<h" + num + ">" + line + "</h" + num + ">";
	      }
	    };

	    Parser.prototype.parseMh = function(lines, num) {
	      return this.parseSh(lines, num);
	    };

	    Parser.prototype.parseQuote = function(lines) {
	      var str;
	      lines = lines.map(function(line) {
	        return line.replace(/^\s*> ?/, '');
	      });
	      str = lines.join("\n");
	      if (str.match(/^\s*$/)) {
	        return '';
	      } else {
	        return '<blockquote>' + (this.parse(str)) + '</blockquote>';
	      }
	    };

	    Parser.prototype.parseList = function(lines) {
	      var found, html, j, key, l, lastType, leftLines, len, len1, len2, line, m, matches, minSpace, row, rows, secondMinSpace, space, text, type;
	      html = '';
	      minSpace = 99999;
	      rows = [];
	      for (key = j = 0, len = lines.length; j < len; key = ++j) {
	        line = lines[key];
	        if (matches = line.match(/^(\s*)((?:[0-9a-z]+\.?)|\-|\+|\*)(\s+)(.*)$/)) {
	          space = matches[1].length;
	          type = 0 <= '+-*'.indexOf(matches[2]) ? 'ul' : 'ol';
	          minSpace = Math.min(space, minSpace);
	          rows.push([space, type, line, matches[4]]);
	        } else {
	          rows.push(line);
	        }
	      }
	      found = false;
	      secondMinSpace = 99999;
	      for (l = 0, len1 = rows.length; l < len1; l++) {
	        row = rows[l];
	        if (row instanceof Array && row[0] !== minSpace) {
	          secondMinSpace = Math.min(secondMinSpace, row[0]);
	          found = true;
	        }
	      }
	      secondMinSpace = found ? secondMinSpace : minSpace;
	      lastType = '';
	      leftLines = [];
	      for (m = 0, len2 = rows.length; m < len2; m++) {
	        row = rows[m];
	        if (row instanceof Array) {
	          space = row[0], type = row[1], line = row[2], text = row[3];
	          if (space !== minSpace) {
	            leftLines.push(line.replace(new RegExp("^\\s{" + secondMinSpace + "}"), ''));
	          } else {
	            if (leftLines.length > 0) {
	              html += '<li>' + (this.parse(leftLines.join("\n"))) + '</li>';
	            }
	            if (lastType !== type) {
	              if (!!lastType) {
	                html += "</" + lastType + ">";
	              }
	              html += "<" + type + ">";
	            }
	            leftLines = [text];
	            lastType = type;
	          }
	        } else {
	          leftLines.push(row.replace(new RegExp("^\\s{" + secondMinSpace + "}"), ''));
	        }
	      }
	      if (leftLines.length > 0) {
	        html += '<li>' + (this.parse(leftLines.join("\n"))) + ("</li></" + lastType + ">");
	      }
	      return html;
	    };

	    Parser.prototype.parseTable = function(lines, value) {
	      var aligns, body, column, columns, head, html, ignores, j, key, l, last, len, len1, line, num, output, row, rows, tag, text;
	      ignores = value[0], aligns = value[1];
	      head = ignores.length > 0;
	      html = '<table>';
	      body = null;
	      output = false;
	      for (key = j = 0, len = lines.length; j < len; key = ++j) {
	        line = lines[key];
	        if (0 <= ignores.indexOf(key)) {
	          if (head && output) {
	            head = false;
	            body = true;
	          }
	          continue;
	        }
	        line = trim(line);
	        output = true;
	        if (line[0] === '|') {
	          line = line.substring(1);
	          if (line[line.length - 1] === '|') {
	            line = line.substring(0, line.length - 1);
	          }
	        }
	        rows = line.split('|').map(function(row) {
	          if (row.match(/^\s+$/)) {
	            return '';
	          } else {
	            return trim(row);
	          }
	        });
	        columns = {};
	        last = -1;
	        for (l = 0, len1 = rows.length; l < len1; l++) {
	          row = rows[l];
	          if (row.length > 0) {
	            last += 1;
	            columns[last] = [(columns[last] != null ? columns[last][0] + 1 : 1), row];
	          } else if (columns[last] != null) {
	            columns[last][0] += 1;
	          } else {
	            columns[0] = [1, row];
	          }
	        }
	        if (head) {
	          html += '<thead>';
	        } else if (body) {
	          html += '<tbody>';
	        }
	        html += '<tr>';
	        for (key in columns) {
	          column = columns[key];
	          num = column[0], text = column[1];
	          tag = head ? 'th' : 'td';
	          html += "<" + tag;
	          if (num > 1) {
	            html += " colspan=\"" + num + "\"";
	          }
	          if ((aligns[key] != null) && aligns[key] !== 'none') {
	            html += " align=\"" + aligns[key] + "\"";
	          }
	          html += '>' + (this.parseInline(text)) + ("</" + tag + ">");
	        }
	        html += '</tr>';
	        if (head) {
	          html += '</thead>';
	        } else if (body) {
	          body = false;
	        }
	      }
	      if (body !== null) {
	        html += '</tbody>';
	      }
	      return html += '</table>';
	    };

	    Parser.prototype.parseHr = function() {
	      return '<hr>';
	    };

	    Parser.prototype.parseNormal = function(lines) {
	      var str;
	      lines = lines.map((function(_this) {
	        return function(line) {
	          return _this.parseInline(line);
	        };
	      })(this));
	      str = trim(lines.join("\n"));
	      str = str.replace(/(\n\s*){2,}/g, '</p><p>');
	      str = str.replace(/\n/g, '<br>');
	      if (str.match(/^\s*$/)) {
	        return '';
	      } else {
	        return "<p>" + str + "</p>";
	      }
	    };

	    Parser.prototype.parseFootnote = function(lines, value) {
	      var index, note, space;
	      space = value[0], note = value[1];
	      index = this.footnotes.indexOf(note);
	      if (index >= 0) {
	        lines = lines.slice(0);
	        lines[0] = lines[0].replace(/^\[\^((?:[^\]]|\]|\[)+?)\]:/, '');
	        this.footnotes[index] = lines;
	      }
	      return '';
	    };

	    Parser.prototype.parseDefinition = function() {
	      return '';
	    };

	    Parser.prototype.parseHtml = function(lines, type) {
	      lines = lines.map((function(_this) {
	        return function(line) {
	          return _this.parseInline(line, _this.specialWhiteList[type] != null ? _this.specialWhiteList[type] : '');
	        };
	      })(this));
	      return lines.join("\n");
	    };

	    Parser.prototype.escapeBracket = function(str) {
	      return str_replace(['\\[', '\\]', '\\(', '\\)'], ['[', ']', '(', ')'], str);
	    };

	    Parser.prototype.startBlock = function(type, start, value) {
	      if (value == null) {
	        value = null;
	      }
	      this.pos += 1;
	      this.current = type;
	      this.blocks.push([type, start, start, value]);
	      return this;
	    };

	    Parser.prototype.endBlock = function() {
	      this.current = 'normal';
	      return this;
	    };

	    Parser.prototype.isBlock = function(type, value) {
	      if (value == null) {
	        value = null;
	      }
	      return this.current === type && (null === value ? true : this.blocks[this.pos][3] === value);
	    };

	    Parser.prototype.getBlock = function() {
	      if (this.blocks[this.pos] != null) {
	        return this.blocks[this.pos];
	      } else {
	        return null;
	      }
	    };

	    Parser.prototype.setBlock = function(to, value) {
	      if (to == null) {
	        to = null;
	      }
	      if (value == null) {
	        value = null;
	      }
	      if (to !== null) {
	        this.blocks[this.pos][2] = to;
	      }
	      if (value !== null) {
	        this.blocks[this.pos][3] = value;
	      }
	      return this;
	    };

	    Parser.prototype.backBlock = function(step, type, value) {
	      var item, last;
	      if (value == null) {
	        value = null;
	      }
	      if (this.pos < 0) {
	        return this.startBlock(type, 0, value);
	      }
	      last = this.blocks[this.pos][2];
	      this.blocks[this.pos][2] = last - step;
	      item = [type, last - step + 1, last, value];
	      if (this.blocks[this.pos][1] <= this.blocks[this.pos][2]) {
	        this.pos += 1;
	        this.blocks.push(item);
	      } else {
	        this.blocks[this.pos] = item;
	      }
	      this.current = type;
	      return this;
	    };

	    Parser.prototype.combineBlock = function() {
	      var current, prev;
	      if (this.pos < 1) {
	        return this;
	      }
	      prev = this.blocks[this.pos - 1].slice(0);
	      current = this.blocks[this.pos].slice(0);
	      prev[2] = current[2];
	      this.blocks[this.pos - 1] = prev;
	      this.current = prev[0];
	      this.blocks = this.blocks.slice(0, -1);
	      this.pos -= 1;
	      return this;
	    };

	    return Parser;

	  })();

	  if (typeof module !== "undefined" && module !== null) {
	    module.exports = Parser;
	  } else if (typeof window !== "undefined" && window !== null) {
	    window.HyperDown = Parser;
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(235)(module)))

/***/ },

/***/ 235:
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }

});