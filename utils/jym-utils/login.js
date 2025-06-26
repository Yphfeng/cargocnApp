var util = require("./util.js");

var api = require("../config/api.js");

function Login(phone, password, flag) {
  var parm = {
    mobile: phone,
    password: password,
    loginType: "840"
  };
  console.log("datadatadatadatadatadata", parm);
  util.postRequest(api.login, parm).then(function (res) {
    if (res.retCode == "0000000") {
      console.log("res.rspBody.attrs.token", res.rspBody);

      if (res.rspBody.attrs.userCarType == "2" && res.rspBody.attrs.driverVerify == "0") {
        if (res.rspBody.attrs.remindStatus == 0) {
          uni.showModal({
            title: '温馨提示',
            cancelText: '暂不认证',
            confirmText: '去认证',
            content: "为让您有更好的操作体验，建议您进行个人认证。若暂不认证，您后续可在[我的]--[实名认证]中完成认证。",
            success: function (res) {
              if (res.confirm) {
                uni.navigateTo({
                  url: '../../../pages/login/userVerify/userVerify'
                });
              } else {
                uni.switchTab({
                  url: '../../../pages/oilstation/oilstationIndex/oilstationIndex'
                });
              }
            }
          });
        } else {
          if (flag == 1) {
            uni.switchTab({
              url: '../../../pages/oilstation/oilstationIndex/oilstationIndex'
            });
          } else {
            uni.navigateTo({
              url: '../../../pages/my/oilcardPage/oilcardPage'
            });
          }
        }
      } else {
        console.log("res.rspBody.attrs.driverVerify", res.rspBody.attrs);

        if (res.rspBody.attrs.driverVerify == "1") {
          if (res.rspBody.attrs.vehicleVerify == "1" || res.rspBody.attrs.userCarType == "2") {
            if (flag == 1) {} else {
              uni.navigateTo({
                url: '../../../pages/my/oilcardPage/oilcardPage'
              });
            }
          } else {
            uni.showModal({
              title: '提示',
              content: '当前司机未认证车辆',
              showCancel: false,
              success: function () {
                uni.navigateTo({
                  url: '../../../pages/login/carVerify/carVerify?flag=0'
                });
              }
            });
          }
        } else {
          uni.showModal({
            title: '提示',
            content: '当前司机未认证,请先去认证',
            showCancel: false,
            success: function () {
              uni.redirectTo({
                url: '../../../pages/login/userVerify/userVerify'
              });
            }
          });
        }
      }

      uni.setStorage({
        key: 'phone',
        data: parm.mobile
      });
      uni.setStorage({
        key: 'testCode',
        data: parm.password
      });
      uni.setStorage({
        key: 'driverStatus',
        data: res.rspBody.attrs.driverVerify
      });
      uni.setStorage({
        key: 'carStatus',
        data: res.rspBody.attrs.vehicleVerify
      });
      uni.setStorage({
        key: 'isBindWx',
        data: res.rspBody.attrs.isBindWx
      });
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
    } else {
      uni.showModal({
        title: '提示',
        content: res.retDesc,
        showCancel: false
      });
    }
  });
}

module.exports = {
  Login
};