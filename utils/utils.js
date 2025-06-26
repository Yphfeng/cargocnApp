//手机号校验
export const checkPhone = function(val) {
	return /^1[0-9]{10}$/.test(val)
}

//函数防抖

export const debounce = (func, wait, immediate, that) => {
    let timer;
    return function() {
      let context = that,
          args = arguments;
        console.log('请求防抖')   
      if (timer) clearTimeout(timer);
      if (immediate) {
        let callNow = !timer;
        timer = setTimeout(() => {
          timer =null;
        }, wait);
        if (callNow) func.apply(context, args);
      }else {
        timer  = setTimeout(() => {
          func.apply(context, args);
        }, wait)
      }
    }
}


//函数节流
export const throttle = (func, wait, type) => {
  if (type === 1) {
    let previous = 0;
  }else if (type === 2) {
    let timeout;
  }
  return function() {
    let context =this;
    let args = arguments;
    if (type === 1) {
        let now = Date.now();
 
        if (now - previous > wait) {
          func.apply(context, args);
          previous = now;
        }
    }else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout =null;
          func.apply(context, args)
        }, wait)
      }
    }
  }
}

//过滤表情包特殊字符
export const filterEnmo = (val) => {
	var reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
	if(val.match(reg)) {
		val = val.replace(reg, '');
	}
	return val;
}

//日期时间处理
export const DateAdd = (strInterval, Number) => {
    var dtTmp = new Date();
    switch (strInterval) {
        case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}
export const GetDateStr = (AddDayCount) => {

    var ddd = DateAdd('d', AddDayCount);//三天后 
    var y = ddd.getFullYear();
    var m = ddd.getMonth() + 1;//获取当前月 
	m = m < 10 ? '0' + m : m;
    var d = ddd.getDate();
	d = d < 10 ? '0' + d : d;
    return y + "-" + m + "-" + d;
}

//判断日期相差多少天
export const  getDaysBetween = (dateString1,dateString2) =>{
   var  startDate = Date.parse(dateString1);
   var  endDate = Date.parse(dateString2);
   var days=(endDate - startDate)/(1*24*60*60*1000);
   console.log(days, 'aaasas');
   return  days;
}

//计算日期之间的时间差
export const getTimeDiffBetween = (dateString1, dateString2) => {
	var  startDate = Date.parse(dateString1);
	var  endDate = Date.parse(dateString2);
	var years = (endDate - startDate)/(1*24*60*60*1000);
	
}

//日期格式化
export const dateFormat = (fmt, date) => {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}


//货源首页发布时间处理
export const showPushDt = (date) => {
	var dateS = date.replace(/-/g, "/");
	var dateStmp = Date.parse(new Date(dateS));
	var nowStmp = Date.parse(new Date());
	var period = nowStmp - dateStmp;
	var yearLevelValue = 365 * 24 * 60 * 60 * 1000;
	var monthLevelValue = 30 * 24 * 60 * 60 * 1000;
	var dayLevelValue = 24 * 60 * 60 * 1000;
	var hourLevelValue = 60 * 60 * 1000;
	var minuteLevelValue = 60 * 1000;
	var secondLevelValue = 1000;
	 
	function getDifference(period) {
		/*******计算出时间差中的年、月、日、天、时、分、秒*******/
		var year = parseInt(getYear(period));
		var month = parseInt(getMonth(period - year * yearLevelValue));
		var day = parseInt(getDay(period - year * yearLevelValue - month * monthLevelValue));
		var hour = parseInt(getHour(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue));
		var minute = parseInt(getMinute(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue));
		var second = parseInt(getSecond(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue - minute * minuteLevelValue));
		var result = "";
		// console.log(year, month, day, hour, minute, second);
		if (year != 0) {
			result =  year + '年前';
		} else if (month != 0){
			result = month + '月前';
		} else if (day != 0) {
			// if (day < 3) {
			// 	result = day + "天前";
			// } else {
			// 	result = "1天前";
			// }
			result = day + "天前";
		} else if (hour != 0) {
			result = hour + "小时前"
		} else if (minute != 0) {
			result = minute + "分钟前"
		} else {
			result = '刚刚'
		}
		function getYear(period) {
			//Math.floor()
			return Math.floor(parseInt(period) / yearLevelValue);
		}
		function getMonth(period) {
			return Math.floor(parseInt(period) / monthLevelValue);
		}
		function getDay(period) {
			return Math.floor(parseInt(period) / dayLevelValue);
		}
		function getHour(period) {
			return Math.floor(parseInt(period) / hourLevelValue);
		}
		function getMinute(period) {
			return Math.floor(parseInt(period) / minuteLevelValue);
		}
		function getSecond(period) {
			return Math.floor(parseInt(period) / secondLevelValue);
		}
		
		return result;
	}
	return getDifference(period);
}

//北斗定位在线时间
export const findBeidouDateDesc = (date) => {
	var dateS = date.replace(/-/g, "/");
	var dateStmp = Date.parse(new Date(dateS));
	var nowStmp = Date.parse(new Date());
	var period = nowStmp - dateStmp;
	var yearLevelValue = 365 * 24 * 60 * 60 * 1000;
	var monthLevelValue = 30 * 24 * 60 * 60 * 1000;
	var dayLevelValue = 24 * 60 * 60 * 1000;
	var hourLevelValue = 60 * 60 * 1000;
	var minuteLevelValue = 60 * 1000;
	var secondLevelValue = 1000;
	 
	function getDifference(period) {
		/*******计算出时间差中的年、月、日、天、时、分、秒*******/
		var year = parseInt(getYear(period));
		var month = parseInt(getMonth(period - year * yearLevelValue));
		var day = parseInt(getDay(period - year * yearLevelValue - month * monthLevelValue));
		var hour = parseInt(getHour(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue));
		var minute = parseInt(getMinute(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue));
		var second = parseInt(getSecond(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue - minute * minuteLevelValue));
		var result = "";
		// console.log(year, month, day, hour, minute, second);
		if (year != 0) {
			result =  "1天前";
		} else if (month != 0){
			result = "1天前";
		} else if (day != 0) {
			// if (day < 3) {
			// 	result = day + "天前";
			// } else {
			// 	result = "1天前";
			// }
			result = "1天前";
		} else if (hour != 0) {
			result = hour + "小时前"
		} else if (minute != 0) {
			result = minute + "分钟前"
		} else {
			result = '刚刚'
		}
		function getYear(period) {
			//Math.floor()
			return Math.floor(parseInt(period) / yearLevelValue);
		}
		function getMonth(period) {
			return Math.floor(parseInt(period) / monthLevelValue);
		}
		function getDay(period) {
			return Math.floor(parseInt(period) / dayLevelValue);
		}
		function getHour(period) {
			return Math.floor(parseInt(period) / hourLevelValue);
		}
		function getMinute(period) {
			return Math.floor(parseInt(period) / minuteLevelValue);
		}
		function getSecond(period) {
			return Math.floor(parseInt(period) / secondLevelValue);
		}
		
		return result;
	}
	return getDifference(period);
}

export const findFleetDateDesc = (date) => {
	var dateS = date.replace(/-/g, "/");
	var dateStmp = Date.parse(new Date(dateS));
	var nowStmp = Date.parse(new Date());
	var period = nowStmp - dateStmp;
	var yearLevelValue = 365 * 24 * 60 * 60 * 1000;
	var monthLevelValue = 30 * 24 * 60 * 60 * 1000;
	var dayLevelValue = 24 * 60 * 60 * 1000;
	var hourLevelValue = 60 * 60 * 1000;
	var minuteLevelValue = 60 * 1000;
	var secondLevelValue = 1000;
	 
	function getDifference(period) {
		/*******计算出时间差中的年、月、日、天、时、分、秒*******/
		var year = parseInt(getYear(period));
		var month = parseInt(getMonth(period - year * yearLevelValue));
		var day = parseInt(getDay(period - year * yearLevelValue - month * monthLevelValue));
		var hour = parseInt(getHour(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue));
		var minute = parseInt(getMinute(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue));
		var second = parseInt(getSecond(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue - minute * minuteLevelValue));
		var result = "";
		// console.log(year, month, day, hour, minute, second);
		if (year != 0) {
			result =  "3天以前在线";
		} else if (month != 0){
			result = "3天以前在线";
		} else if (day != 0) {
			if (day < 3) {
				result = day + "天前在线";
			} else {
				result = "3天以前在线";
			}
		} else if (hour != 0) {
			result = hour + "小时前在线"
		} else if (minute != 0) {
			result = minute + "分钟前在线"
		} else {
			result = '刚刚'
		}
		function getYear(period) {
			//Math.floor()
			return Math.floor(parseInt(period) / yearLevelValue);
		}
		function getMonth(period) {
			return Math.floor(parseInt(period) / monthLevelValue);
		}
		function getDay(period) {
			return Math.floor(parseInt(period) / dayLevelValue);
		}
		function getHour(period) {
			return Math.floor(parseInt(period) / hourLevelValue);
		}
		function getMinute(period) {
			return Math.floor(parseInt(period) / minuteLevelValue);
		}
		function getSecond(period) {
			return Math.floor(parseInt(period) / secondLevelValue);
		}
		
		return result;
	}
	return getDifference(period);
}



export const findDateDesc = (date) => {
	var dateS = date.replace(/-/g, "/");
	var dateStmp = Date.parse(new Date(dateS));
	var nowStmp = Date.parse(new Date());
	var period = nowStmp - dateStmp;
	var yearLevelValue = 365 * 24 * 60 * 60 * 1000;
	var monthLevelValue = 30 * 24 * 60 * 60 * 1000;
	var dayLevelValue = 24 * 60 * 60 * 1000;
	var hourLevelValue = 60 * 60 * 1000;
	var minuteLevelValue = 60 * 1000;
	var secondLevelValue = 1000;
	 
	function getDifference(period) {
		/*******计算出时间差中的年、月、日、天、时、分、秒*******/
		var year = parseInt(getYear(period));
		var month = parseInt(getMonth(period - year * yearLevelValue));
		var day = parseInt(getDay(period - year * yearLevelValue - month * monthLevelValue));
		var hour = parseInt(getHour(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue));
		var minute = parseInt(getMinute(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue));
		var second = parseInt(getSecond(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue - minute * minuteLevelValue));
		var result = "";
		// console.log(year, month, day, hour, minute, second);
		if (year != 0) {
			result =  year + "年前在线";
		} else if (month != 0){
			result = month + "月前在线";
		} else if (day != 0) {
			result = day + "天前在线";
		} else if (hour != 0) {
			result = hour + "小时前在线"
		} else if (minute != 0) {
			result = minute + "分钟前在线"
		} else {
			result = '刚刚'
		}
		function getYear(period) {
			//Math.floor()
			return Math.floor(parseInt(period) / yearLevelValue);
		}
		function getMonth(period) {
			return Math.floor(parseInt(period) / monthLevelValue);
		}
		function getDay(period) {
			return Math.floor(parseInt(period) / dayLevelValue);
		}
		function getHour(period) {
			return Math.floor(parseInt(period) / hourLevelValue);
		}
		function getMinute(period) {
			return Math.floor(parseInt(period) / minuteLevelValue);
		}
		function getSecond(period) {
			return Math.floor(parseInt(period) / secondLevelValue);
		}
		
		return result;
	}
	return getDifference(period);
}


export const fun_date = (num) => { 
    var date1 = new Date();
    //今天时间
    var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
    console.log(time1);
    var date2 = new Date(date1);
     date2.setDate(date1.getDate() + num);
     //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
     var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate(); 
    console.log(time2);
    return time2;
}

//同步延时
var timeout = null;
export const  resolveAfter2Seconds = (seconds) => {
	if (!seconds) {
		seconds = 2000
	}
	return new Promise(resolve => {
		timeout && clearTimeout(timeout);
		timeout = setTimeout(() => {
			resolve();
		}, seconds);
	});
}


//过滤空的对象属性值的属性
export const removeProperty = (obj) => {
  Object.keys(obj).forEach(item => {
    if (obj[item] === '' || obj[item] === undefined || obj[item] === null || obj[item] === 'null') delete obj[item]
  })
  return obj
}

export const debounce1 =(fn) => {
	let timeout = null; // 创建一个标记用来存放定时器的返回值
	return function () {
		clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
		timeout = setTimeout(() => {
			// 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的
			// interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
			fn.apply(this, arguments);
		}, 500);
	};
}

export const showCargoUnit = (cargoUnit) => {
	if (!cargoUnit) return "吨"
	if (cargoUnit == 1) {
		return "件" 
	} else if (cargoUnit == 2) {
		return "吨" 
	} else if (cargoUnit == 3) {
		return "立方米" 
	} else if (cargoUnit == 4) {
		return "车" 
	} else {
		return "吨" 
	}
}

//存储权限判断
export const savePower = (callback) => {
	if(plus.os.name === "Android"){
		console.log("权限", plus.navigator.checkPermission('android.permission.READ_EXTERNAL_STORAGE'))
		//判断权限是否获取到
		if(plus.navigator.checkPermission('android.permission.READ_EXTERNAL_STORAGE') === 'undetermined'){
			//未授权
			uni.showModal({
				title: '为了从相册读取/写入图片，需获取您的存储权限',
				success: function(res) {
					if (res.confirm) {
						callback();
					}
				}
			})
		}else{
			//已授权
			callback();
		}
	}else if(plus.os.name === "iOS"){
		// 对于iOS，通常在info.plist中配置好权限后，无需特别检查，因为系统会自动处理权限请求。
		callback()
	}
	
 }
 //相机/存储权限
 export const caramePower = (callback) => {
 	if(plus.os.name === "Android"){
		console.log("权限", plus.navigator.checkPermission('android.permission.CAMERA'))
 		//判断权限是否获取到
 		if(plus.navigator.checkPermission('android.permission.CAMERA') === 'undetermined' || plus.navigator.checkPermission('android.permission.READ_EXTERNAL_STORAGE') === 'undetermined'){
 			//未授权
 			uni.showModal({
 				title: '为了拍摄照片和从相册读取照片，需获取相机权限和存储权限',
 				success: function(res) {
 					if (res.confirm) {
 						callback();
 					}
 				}
 			})
 		}else{
 			//已授权
 			callback();
 		}
 	}else if(plus.os.name === "iOS"){
 		// 对于iOS，通常在info.plist中配置好权限后，无需特别检查，因为系统会自动处理权限请求。
 		callback()
 	}
 	
  }