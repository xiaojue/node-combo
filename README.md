#Node Combo
`node-combo` 首先是一个静态的资源服务器，可以用来处理客户端对静态资源如图片，js，css等得相应请求，并返回结果，处理相应的请求头，并对资源进行缓存一类的基本功能，全部用node实现。
  
其次，node-combo v1.0.1 完成对js和css文件的combo请求处理，用以减少http请求数量。
  
## API

使用正常的请求就直接输入相应匹配到的url就好了，如果请求combo文件，格式如下:
  
``` html
<script src="http://example.com/directory/??1.js,2.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js?t=1234567.js"></script>
```
  
## TODO
  
1.  处理针对图片的需求，比如合并多图的请求。
  
2.  增加css雪碧图的自动处理与图片合并。
    
3.  增加一些简单的标签机制，在css和js文件中进行预处理。
  
4.  增加对lesscss的自动解析与处理。
  
5.  计划增加对coffeejs的自动解析与处理。
  
6.  绘制资源目录的关系图，代码统计之类的功能。
