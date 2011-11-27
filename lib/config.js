/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111126
 * @desprition 配置默认config文件
 */
(function(ex){
  if(ex){
    var configure={
      host:'node.designsor.com',
      prot:'3333',
      src:'/home/xiaojue/cdn/',
      debug:true
    };
    ex.config=configure;
  }
})(exports);
