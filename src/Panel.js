class Panel {
    get toolbar() {
        return this._toolbar[0];
    }

    get input() {
        return this._input[0];
    }

    get preview() {
        return this._preview[0];
    }

    constructor(id) {
        this.id = id;
        this.draw();
    }

    /**
     * 画出大致框架
     */
    draw() {
        let panel = $("#" + this.id);
        this._toolbar = $("<div id='wmd-button-bar' class='wmd-button-bar'></div>");
        this._input = $("<textarea class='form-control wmd-input' id='wmd-input' placeholder='1. 测试阶段哟~~'></textarea>");
        this._preview = $("<div id='wmd-preview' class='wmd-preview'></div>");

        panel.append(this._toolbar).append(this._input).append(this._preview);
    }
}

export {Panel}