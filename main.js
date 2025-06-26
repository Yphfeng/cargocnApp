import Vue from 'vue'
import App from './App'
import GoEasy from "./js_sdk/GoEasy-IM/goeasy-2.2.4.min";
import push from '@/utils/push.js'
import common from "@/utils/common.js";
Vue.prototype.$noMultipleClicks = common.noMultipleClicks;
	
Vue.config.productionTip = false
//引入vuex
import store from './store/index'

App.mpType = 'app'

const goEasy = GoEasy.getInstance({
	host:"hangzhou.goeasy.io",//应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
	appkey:"BC-5b30b2fd34634342a01dd3186eae6047",	// common key,
    modules:["im", 'pubsub'],
	// true表示支持通知栏提醒，false则表示不需要通知栏提醒
    allowNotification:true //仅有效于app,小程序和H5将会被自动忽略

});
Vue.prototype.GoEasy = GoEasy;
Vue.prototype.goEasy = goEasy;
Vue.prototype.$push = push;


const app = new Vue({
    ...App,
	store
})
app.$mount()
