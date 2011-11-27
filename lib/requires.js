/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111126
 * @desprition 全局的requires
 */
(function(ex){
  if(ex){
    var requireList=['path','fs','util','http','url','events','querystring','net','os','vm','assert'],
        len=requireList.length;
    requireList.forEach(function(val){
      if(require(val)){
        ex[val]=require(val);
      }
    });
  }
})(exports);
