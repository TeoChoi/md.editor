class Panel {
    get toolbar() {
        return this._toolbar[0];
    }

    get input() {
        return this._input[0];
    }

    get preview() {
        if (this.enablePreview) {
            return this._preview[0];
        }
        return null;
    }

    constructor(id, options) {
        this.id = id;

        this.height = options.height;
        this.enablePreview = options.enablePreview;
        this.placeholder = options.placeholder;

        this.mode = "liveMode";// "viewMode", "editMode"
        this.isFull = false;

        this.draw();

        this.setMode(this.mode);
    }

    /**
     * 画出大致框架
     */
    draw() {
        // let panel = $("#" + this.id);
        this.panel = $("<div class='wmd-panel'></div>");
        let toolbar = $("<div id='wmd-tool-bar' class='wmd-tool-bar'></div>");
        this._toolbar = $("<div class='wmd-button-row'></div>");

        this._input = $("#" + this.id).addClass("form-control wmd-input");

        let editor = $("<div class='wmd-editor'></div>");

        if (this.height) {
            this.panel.css({"height": this.height});
        }

        if (!this.enablePreview) {
            editor.css({'width': '100%'});
        }

        this.panel.insertBefore(this._input);

        this.panel.append(toolbar.append(this._toolbar)).append(editor.append(this._input));

        if (this.enablePreview) {
            this._preview = $("<div id='wmd-preview' class='wmd-preview'><div class='preview'></div></div>");
            this.panel.append(this._preview);
        }
    }

    setMode(mode) {
        this.panel.removeClass("viewMode").removeClass("editMode").removeClass("liveMode").addClass(mode);
        this.mode = mode;
    }

    makeFull(ok) {
        if (ok) {
            this.panel.css('height', $(window).height());
            this.panel.addClass("fullMode");
            this.isFull = true;
        } else {
            this.panel.css('height', this.height);
            this.panel.removeClass("fullMode");
            this.isFull = false;
        }
    }
}

export {Panel}