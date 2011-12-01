#Node Combo
`node-combo` 首先是一个静态的资源服务器，处理客户端相应请求，并返回结果，处理相应请求头，对资源进行缓存一类的基本功能，已经用node在某一个端口实现。
  
其次，node-combo v1.0.1 完成对js和css文件的combo请求处理，用以减少http请求数量。
  
## API

使用正常的请求就直接输入相应匹配到的url就好了，如果请求combo文件，格式如下:
  
``` html
<script src="http://example.com/directory/??1.js,2.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js"></script>
<script src="http://example.com/directory/??1.js,/root.js,3.js?t=1234567.js"></script>
```
