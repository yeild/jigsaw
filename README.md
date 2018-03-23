# jigsaw
canvas滑动验证码

## [演示地址](https://yeild.github.io/jigsaw/demo.html)

### 用法：
1. 引入jigsaw.js 和 jigsaw.css

2. 
```
jigsaw.init(element[, success][, fail])
```

jigsaw.init接收三个参数，第一个参数为页面元素，最小宽度、高度分别为310、155, position值应为relative, absolute, fixed. 第二和第三个参数分别为验证成功和失败的回调函数。

### 特性：

1. 图片由 https://picsum.photos/ 随机产生，然后使用canvas裁剪生成。

2. 使用了ES6语法，建议使用现代浏览器体验。

### TODO:
* 给滑块边缘加上边框以保证可见度
