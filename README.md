#Node Combo
`node-combo` 首先是一个静态的资源服务器，可以用来处理客户端对静态资源如图片，js，css等得相应请求，并返回结果，处理相应的请求头，并对资源进行缓存一类的基本功能，全部用node实现。
  
其次，node-combo v0.0.2 完成对js和css文件的combo请求处理，用以减少http请求数量。
  
## API
  
### 引入
把文件下到module目录，然后修改`./lib/config.js`里的配置端口，在apache或者nginx下配置好端口和映射，配置好静态文件目录。
  
在你的sever启动里增加如下代码：
  
``` js
var combo=require('node-combo');
combo.run();
``` 
### Combo格式
  
使用正常的请求就直接输入相应匹配到的url就好了，如果请求combo文件，格式如下:
  
``` html
<script src="http://example.com/directory/??1.js,2.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js?t=1234567.js"></script>
```
  
``` html
<link href="http://example.com/css/?1.css,2.css,3.css" rel="stylesheet" type="text/css">
<link href="http://example.com/css/?1.css,/root.css,3.css?t=1234567.css" rel="stylesheet" type="text/css">
```
  
### 图片Combo格式

可以合并不同类型的图片，生成一张宽度为最大一张宽度，高度自行计算的PNG图片，适合做css的雪碧图用,格式如下:
  
``` html
<img src="http://example.com/image/??1.jpg,2.jpg" />
<img src="http://example.com/image/??1.jpg,2.png,3.gif" />
```
  
## TODO
  
1. <del>处理针对图片的需求，比如合并多图的请求，完成css雪碧图等。</del>
  
2.  图片大小格式智能控制。
  
3.  增加一些简单的标签机制，在css和js文件中进行预处理。
  
4.  增加对lesscss的自动解析与处理。
  
5.  计划增加对coffeejs的自动解析与处理。
  
6.  绘制资源目录的关系图，代码统计之类的功能。
