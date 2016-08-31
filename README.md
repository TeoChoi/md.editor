# md.editor
markdown 富文本编辑器 用于网站开发

# 说明
该编辑器, 使用了google的开源代码`pagedown`,以及segmentfault的开源代码`HyperDown`，而且我不是前端人，所以，没有使用任何的构建工具，所以代码看起来修改的有些乱，或者说，层次感可能不分明

该编辑器使用条件限制比较多,暂时只支持了基本的功能

1. 粗体
2. 斜体
3. 链接地址
4. 引用
5. 代码
6. 图片地址
7. 项目列表
8. 分割线
9. 撤销
10. 恢复操作

## 下载

```shell
npm install md.editor
```

## 使用
1. 在页面中直接使用编译好的文件,例如:
```html
<script type="text/javascript" src="/dist/global.js"></script>
```

2. 在页面中添加编辑器元素
```html
<div class="wmd-panel" id="wmd-panel">
</div>
```

3. 在尾部添加
```html
<script type="text/javascript" src="/dist/index.js"></script>
<script type="text/javascript" src="/dist/css/global.css.js"></script>
```

