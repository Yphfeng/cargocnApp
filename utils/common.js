function noMultipleClicks(methods, info) {
     // methods是需要点击后需要执行的函数， info是点击需要传的参数
     let that = this;
	 console.log("执行",	 that.noClick);
     if (that.noClick) {
         // 第一次点击
         that.noClick= false;
         if(info && info !== '') {
             // info是执行函数需要传的参数
             methods(info);
         } else {
             methods();
         }
         setTimeout(()=> {
             that.noClick= true;
         }, 1000)
     } else {
         // 这里是重复点击的判断
     }
 }

 
 
 //导出
 export default {
     noMultipleClicks,//禁止多次点击
 }