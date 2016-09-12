# md.editor
markdown 富文本编辑器 用于网站开发

# 说明
该编辑器, 使用了google的开源代码`pagedown`,以及segmentfault的开源代码`HyperDown`，代码使用ES6重构了pagedown的代码,构建工具,使用了webpack,
该编辑器除了正常的markdown标记外,增加了代码高亮(依赖:`highlight.js`),流程图(依赖`flowchart.js`)

## 下载

```shell
npm install md.editor
```
或者,直接在本页面下载包, 然后进入文件夹,执行`npm install`下载依赖

## 使用
### 1. 直接使用
* 在页面中直接使用编译好的文件,例如:
```html
<script type="text/javascript" src="/dist/global.js"></script>
```

* 在页面中添加编辑器元素
```html
<textarea id="md-text">
</textarea>
```

* 在尾部添加
```html
<script type="text/javascript" src="/dist/index.js"></script>
<script type="text/javascript" src="/dist/css/global.css.js"></script>
```

### 2. webpack使用
项目中直接引入
```javascript
var MdEditor = requre("md.editor");

var editor = new MdEditor(options);

editor.run();
```

## options 选项：

* options.converter
 默认值：new Hyperdown (默认是segmentfault官方解析器) 也可以是其他地方的解析器，不过必须提供makeHtml()方法
* options.placeholder 
 默认值："" 在编辑器内部展示的placeholder内容
* options.enablePreview
 默认值： true，是否启用预览
* options.height
 默认值："400px" , 编辑器的高度
* options.uploadUrl
 上传图片的路径
* options.highlight
 默认值： false, 是否启用高亮
* options.flowchart
 默认值是： false，是否启用流程图解析

