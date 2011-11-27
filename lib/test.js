var res=require('./requires.js');

test.on('five',function(){
  res.util.log('fired five!!');
});

var test={
  run:function(){
    var i=0;
    for(i=0;i<10;i++){
      res.util.log(i);
      if(i===5){
        test.listeners('five');
      }
    }
  }
}
