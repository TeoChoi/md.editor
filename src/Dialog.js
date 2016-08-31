let fileUpload = require('bundle?lazy!jquery.fileupload');

class Dialog {
    constructor(uploadUrl) {
        this.uploadUrl = uploadUrl;
    }

    link(text, callback) {
        let input, dialog, id = 'linkDialog';

        let close = (isCancel) => {
            let text = input.value;

            if (isCancel) {
                text = null;
            } else {
                // 修复一些没呀协议头的地址
                text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
                if (!/^(?:https?|ftp):\/\//.test(text))
                    text = 'http://' + text;
            }

            dialog.modal('hide').remove()

            callback(text);
            return false;
        };


        // 创建一个输入地址的modal
        let createLinkDialog = () => {
            dialog = $("<div></div>");
            dialog.attr('id', id);
            dialog.attr('class', "modal fade");

            dialog.html(`
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button id="closeButton" type="button" data-dismiss="modal" class="close"><span>×</span></button>
            <h4 class="modal-title">${text}</h4>
        </div>
        <div class="modal-body"><input id="linkInput" type="text" class="form-control" placeholder="输入连接地址"></div>
        <div class="modal-footer">
            <button id="linkCancelButton" type="button" class="btn btn-default">取消</button>
            <button id="linkOkButton" type="button" class="btn btn-primary">确定</button>
        </div>
    </div>
</div>
`);

            $('body').append(dialog);

            input = document.getElementById('linkInput');

            let cancelButton = $('#linkCancelButton');
            let okButton = $('#linkOkButton');

            input.focus();

            dialog.modal();

            cancelButton.on("click", () => {
                return close(true);
            });
            okButton.on("click", () => {
                return close(false);
            });
        };

        createLinkDialog();
    }

    image(text, callback) {

        let input, dialog, id = 'imageDialog';

        let close = (isCancel) => {
            let text = input.value;

            if (isCancel) {
                text = null;
            } else {
                text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
                if (!/^(?:https?|ftp):\/\//.test(text))
                    text = 'http://' + text;
            }

            dialog.modal('hide').remove();

            callback(text);
            return false;
        };

        let createImageDialog = () => {
            dialog = $("<div></div>");
            dialog.attr('id', id);
            dialog.attr('class', "modal fade");

            dialog.html(`
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button id="closeButton" type="button" data-dismiss="modal" class="close"><span>×</span></button>
            <h4 class="modal-title">${text}</h4></div>
        <div class="modal-body">
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#localhost" aria-controls="localhost" role="tab"
                                                          data-toggle="tab">本地上传</a></li>
                <li role="presentation"><a href="#remote" aria-controls="remote" role="tab" data-toggle="tab">远程地址获取</a>
                </li>
            </ul>
            <div class="tab-content">
                <div role="tabpanel" class="tab-pane pt form-horizontal active" id="localhost">
                    <div class="form-group fileinput-button">
                        <input id="fileupload" type="file" name="wmd_file_upload">
                        <div class="col-sm-8"><input type="text" id="fileName" class="form-control"
                                                     placeholder="拖动图片到这里" readonly></div>
                        <a href="javascript:;" class="btn col-sm-2 btn-default">选择图片</a></div>
                </div>
                <div role="tabpanel" class="tab-pane pt" id="remote">
                    <input type="url" name="img" id="remotePicUrl" class="form-control text-28" placeholder="输入图片地址">
                </div>
            </div>
        </div>
        <div>
            <div class="modal-footer" style="border-top: none;">
                <button id="imageCancelButton" type="button" class="btn btn-default">取消</button>
                <button id="imageOkButton" type="button" class="btn btn-primary">确定</button>
            </div>
        </div>
    </div>
</div>
`);

            $('body').append(dialog);

            input = document.getElementById('remotePicUrl');
            let cancelButton = $('#imageCancelButton');
            let okButton = $('#imageOkButton');

            $('#' + id + ' a').click(function (e) {
                e.preventDefault()
                $(this).blur().tab('show')

                okButton.unbind();
                if ($(this).attr('aria-controls') == 'remote') {
                    okButton.bind('click', function () {
                        close(false)
                    })
                }
            });

            fileUpload((file) => {
                let upload = $('#fileupload').fileupload({
                    url: this.uploadUrl,
                    dataType: 'json',
                    dropZone: dialog,
                    autoUpload: false,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    add: function (e, data) {
                        $('#imageOkButton').click(function () {
                            data.submit();
                        });
                    },
                    done: function (e, data) {
                        if (data.result.code == 1) {
                            $('#remotePicUrl').val(data.result.url);
                            close(false);
                        }
                    },
                    drop: function (e, data) {
                        $.each(data.files, function (index, file) {
                            $("#fileName").val(file.name)
                        });
                    },
                    change: function (e, data) {
                        $.each(data.files, function (index, file) {
                            $("#fileName").val(file.name)
                        });
                    }
                });
            });

            dialog.modal();

            input.focus();

            cancelButton.on("click", () => {
                return close(true);
            });
        };

        createImageDialog();
    }
}
export {Dialog}