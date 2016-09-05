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
        let panel = $("#" + this.id);
        let toolbar = $("<div id='wmd-tool-bar' class='wmd-tool-bar'></div>");
        this._toolbar = $("<div class='wmd-button-row'></div>");

        this._input = $("<textarea class='form-control wmd-input' id='wmd-input' placeholder='" + this.placeholder + "'></textarea>");
        this.editor = $("<div class='wmd-editor'></div>").append(this._input)
        if (this.height)
            this.editor.css({"height": "calc(" +this.height+ " - 31px)"});

        if (!this.enablePreview) {
            this.editor.css({'width': '100%'});
        }

        panel.append(toolbar.append(this._toolbar)).append(this.editor.append(this._input));

        if (this.enablePreview) {
            this._preview = $("<div id='wmd-preview' class='wmd-preview'><div class='preview'></div></div>");
            panel.append(this._preview);
        }
    }

    setMode(mode) {
        $("#" + this.id).removeClass("viewMode").removeClass("editMode").removeClass("liveMode").addClass(mode);
        this.mode = mode;
    }

    makeFull(ok) {
        if (ok) {
            this.editor.css('height', $(window).height() - $(this.toolbar).outerHeight());
            $("#" + this.id).addClass("fullMode");
            this.isFull = true;
        } else {
            this.editor.css('height', "calc(" +this.height+ " - 31px)");
            $("#" + this.id).removeClass("fullMode");
            this.isFull = false;
        }
    }
}

export {Panel}