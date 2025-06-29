function withData(param){
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start,end){
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function getMonthDay(year,month){
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;
 
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNewDateArry(){
  // 当前时间的处理 年月日时分秒
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
      mont = withData(newDate.getMonth() + 1),
      date = withData(newDate.getDate()),
      hour = withData(newDate.getHours()),
      minu = withData(newDate.getMinutes());
      // seco = withData(newDate.getSeconds());
 
  return [year, mont, date, hour, minu];
}
function dateTimePicker(startYear,endYear,date, datt) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[],[],[],[],[]];
  var start = startYear || 1978;
  var end = endYear || 2100;
  var nowDate = datt;
 //处理传过来的字符串转化为数组
 let dataArr = date.split(" ")[0].split('/')
 let time = date.split(" ")[1].split(':')
  // 默认开始显示数据 如果把自定义值传过来的话就使用自定义时间 否则用当前时间  ...dataArr数组解构
  var defaultDate = date ? [...dataArr, ...time] : getNewDateArry();
  console.log(nowDate, date, defaultDate, 'aaaa');
  // 处理联动列表数据
  dateTimeArray[0] = getLoopArray(start,end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  // dateTimeArray[2] = getMonthDay(1, 31);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);
	  // dateTimeArray[5] = getLoopArray(0, 59);
 //遍历dateTimeArray数组
  dateTimeArray.forEach((current,index) =>
  //匹配defaultDate[index]值在current数组中的位置
    dateTime.push(current.indexOf(defaultDate[index]))
  );
 
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}

//当前日期
function getNowDate(dat) {
	var date = new Date();
	if (dat) {
		date = new Date(dat);
	}
	
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
	var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
	// 获取完整的年月日 时分秒，以及默认显示的数组
	
	let arr = date.getFullYear() + '/' + month + '/' + day + ' ' + hour + ':' + minutes + ':' + second;
	return arr;
	
}


module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  getNowDate: getNowDate,
  getLoopArray: getLoopArray,
}