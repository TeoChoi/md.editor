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

        this.draw();
    }

    /**
     * 画出大致框架
     */
    draw() {
        let panel = $("#" + this.id);
        this._toolbar = $("<div id='wmd-button-bar' class='wmd-button-bar'></div>");
        this._input = $("<textarea class='form-control wmd-input' id='wmd-input' placeholder='" + this.placeholder + "'></textarea>");
        this._input.css({"height": this.height});

        if (!this.enablePreview) {
            this._input.css({'width': '100%'});
        }

        panel.append(this._toolbar).append(this._input);

        if (this.enablePreview) {
            this._preview = $("<div id='wmd-preview' class='wmd-preview'></div>");
            panel.append(this._preview);
        }
    }
}

export {Panel}