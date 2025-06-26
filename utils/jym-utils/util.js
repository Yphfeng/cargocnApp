const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

var {
  login
} = require("@/config/api.js");

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};
/**
 * 封封微信的的request
 */


function getRequest(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    uni.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}


function postRequest(url, data = {}, method = "POST") {
	
  return new Promise(function (resolve, reject) {
    uni.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token')
		// 'Authorization': 'eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSMjS3sDS0NDQwMbJU0lEqLU4t8kxRsjI2tLDUUcrJT8_MC6ksSFWysjAx0FFKrShQsjI0MzKzNDY0NbWsBQAWsNJLRAAAAA.2YUaiLVuWkI4sJB0mecxA03yoVBZYQdLu1Nd2tjOT28'
      },
      success: function (res) {
		  // console.log(55555555, url, res)
        uni.hideLoading(); // console.log('url', url, res.data)

        if (res.statusCode == 200) {
          if (res.data.retCode == '401') {
			  console.log('401加油么401111');
            // uni.clearStorage();
          } else {
            resolve(res.data);

            if (url == login) {
              uni.setStorage({
                data: res.data.rspBody.attrs.driverVerify,
                key: 'driverVerify'
              });
              uni.setStorage({
                key: 'driverInfo',
                data: res.data.rspBody
              });
              uni.setStorage({
                key: 'token',
                data: res.data.rspBody.attrs.token
              });
            }
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        uni.hideLoading();
        reject(err);
        console.log("failed");
      }
    });
  });
} //并发请求


function postRequestAll(requests) {
  let promiseList = [];

  for (let i = 0; i < requests.length; i++) {
    let opt = requests[i];
    promiseList.push(postRequest(opt.url, opt.data));
  }

  var ret = Promise.all(promiseList);
  ret.then(e => {
    let needLogin = false;
    needLogin = e.some(v => {
      return v.statusCode === 200 && res.data.retCode == '401';
    });

    if (needLogin) {
      uni.showModal({
        title: "当前为未登录状态，请登录后操作,跳转登录页？",
        // content:"跳转登录页？",
        icon: 'none',

        success(res) {
          if (res.confirm) {
            uni.reLaunch({
              url: '/login/pages/login/login'
            });
          }
        }

      });
    }
  });
  return ret;
}

function showErrorToast(msg) {
  console.log(msg);
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  });
} //角度转换为弧度


function toRadians(degree) {
  return degree * Math.PI / 180;
}

function getDistance(lat1, long1, lat2, long2) {
  //计算坐标点之间的距离
  // 地球的半径（单位：公里）
  var R = 6371; //角度转换为弧度

  var deltaLat = toRadians(lat2 - lat1);
  var deltaLong = toRadians(long2 - long1);
  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2); //计算过程

  var h = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2); //求距离

  var d = 2 * R * Math.asin(Math.sqrt(h));
  return d;
}

module.exports = {
  formatTime: formatTime,
  getRequest,
  postRequest,
  showErrorToast,
  getDistance,
  postRequestAll
};