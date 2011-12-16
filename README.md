#Node Combo
`node-combo` 是一个静态的资源服务器，可以用来处理客户端对静态资源如图片，js，css，img等得相应请求，并对其增加一些增加前端开发效率的特性。
  
## API
  
### Import 

把文件下到module目录，然后修改`./lib/config.js`里的配置端口，在apache或者nginx下配置好端口和映射，配置好静态文件目录。
  
在你的sever启动里增加如下代码：
  
``` js
var combo=require('node-combo');
combo.run();
``` 
### Js,Css Combo
  
``` html
<script src="http://example.com/directory/??1.js,2.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js?t=1234567.js"></script>
```
  
``` html
<link href="http://example.com/css/?1.css,2.css,3.css" rel="stylesheet" type="text/css">
<link href="http://example.com/css/?1.css,/root.css,3.css?t=1234567.css" rel="stylesheet" type="text/css">
```
  
### Img Combo
  
``` html
<img src="http://example.com/image/??1.jpg,2.jpg" />
<img src="http://example.com/image/??1.jpg,2.png,3.gif" />
```
  
### Img Resize

``` html
<img src="http://example.com/image/1.jpg_50x50.jpg" />
<img src="http://example.com/image/1.jpg_30x30.jpg" />
```
  
### Static Template
  
test.css 可以引入多个js文件，比如nodeImport(./json1.js,./json2.js)
  
``` css
//nodeImport(./json.js)  
/**  
 * @author {#name#} {#email#}  
 * @version {#version#}  
 * @description test for {#common#}  
 */  
 body{
     font-size:{#fontSize#};
 }
```
  
json.js 引入的文件
  
``` javascript
{
    "name":"xiaojue",
    "email":"designsor@gmail.com"
    "version":function(){
        return new Date().valueOf();
    }()
}
```
  
NodeCommon.js 可以配置的当前目录通用模板文件
  
``` javascript
{
    "common":"node combo static template",
    "fontSize":"12px"
}
```

Putout:

``` css
//nodeImport(./json.js)
/**
 * @author xiaojue designsor@gmail.com
 * @version 1324005628274
 * @description test for node combo static template
 */
 body{
     font-size:12px;
 }
```
  
javascript的处理方法和css一样，使用`{##}`占位符。
  
## TODO
  
1. <del>处理针对图片的需求，比如合并多图的请求，完成css雪碧图等。[20111201]</del>
  
2. <del>图片大小控制。[20111201]</del>
  
3. <del>增加一些简单的标签机制，在css和js文件中进行预处理。[20111201]</del>
  
4.  增加对lesscss的自动解析与处理。[20111201]
  
5.  计划增加对coffeejs的自动解析与处理。[20111201]
  
6.  绘制资源目录的关系图，代码统计之类的功能。[20111201]
  
7.  图片combo+自定义尺寸的支持。[20111207] 
