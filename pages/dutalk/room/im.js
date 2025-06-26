import { SERVER_URL,SING_URL } from "../index/config/index.js";
import makeData from '../index/https/index.js';
// import { getMessageByUId } from '@rongcloud/imlib-uni';

export default function(addReceiveMessageListener,self,divheight){
	let globalEvent = uni.requireNativePlugin('globalEvent');
	console.log('-----------------im------------------------');
	// addTypingStatusListener(listener: (result: UniListenerResult<TypingStatus>) => void)
	addReceiveMessageListener((e)=>{
		console.log(e,'----------容云监听------------');
		try{
			let res = e.data.message.content;
			let key = null;
			let data = null;
			let msguid =res.messageUId;
			// console.log(typeof res.content,JSON.parse(res.content),'-------');
			let ext = {roomid:-1};
			let content = JSON.parse(res.content);
			if(res&&content){
				if(content.name){
					key = content.name.split('MSG:')[1];
				}
				if(content){
					data = content;
				}
				// console.log(key);
			}
			if(data&&data.ext){
				ext = JSON.parse(data.ext);
			}
			console.log(data,res,self.info.roomid,key,'融云消息状态变化---------------------------------------------');
			
			switch (key) {
			  case 'join':
				  console.log('加入房间');
				  if(self.msg_list.length >= Math.ceil(divheight/50)){
					  self.msg_list.splice(0,1);
				  }
			      self.msg_list.push({t:data.userInfo.nickName,status:1});
				  // console.log();
				  console.log(divheight,'-------------------加入房间---------------------------');
				  if((data.userInfo.id == self.info.id) ){console.log('----------不在同一个房间 return----------',);return}
				  console.log(data.userInfo.id,'《《《进入-------');
				 
			    break;
			  case 'quit':
			    if(data.userInfo.id == self.speakerid){
			      self.speaking_timeout&&clearInterval(self.speaking_timeout);
				  self.isothersepak = false;
				  self.speaking_timeout = null;
				  self.isspeak = false;
				  self.sepakendaction();
			      
			    }//如果推出用户是当前说话的用户 取消演讲头像
			    // self.onlineusers();
			    break;
			  case 'TotalCount':
			    console.log(data,'--');
			    self.avatar_list = data.topUsers?data.topUsers:self.avatar_list;
				self.totalCount = data.totalCount;
				// self.avatar_list =   [{
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }, {
				// 	"avatar": "https://yogo-file.obs.cn-east-3.myhuaweicloud.com/home/img/20211207_7BC13DBB94F844F3846DE3C9243AD498.jpg",
				// 	"id": "73006D2639E048AF99E6B63A122D7374",
				// 	"nickName": "大奖iPhoneXR24EEC78B-FBD1-4709-A9AA-F6C65A9F03BC"
				// }];//
			    break;
			  case 'speak':
			    self.speaking_timeout&&clearInterval(self.speaking_timeout);
			    function sbSpeak(){
				  self.speakavatar = data.userInfo.avatar;
				  self.speaknickname = data.userInfo.nickName;
				  self.speakerid = data.userInfo.id;
				  console.log(data.userInfo.id,self.info.id,'id');
				  self.isothersepak = ((data.userInfo.id == self.info.id)?false:true);
				  self.isspeak = true;
				  if(self.isothersepak){
					  self.records.playOn(()=>{});
					  console.log('公放打开');
				  }else{
					  self.records.playOff(()=>{});
					  console.log('公放关闭');
				  }
				  self.need_end_count = self.need_end_count + 1;
				  
				  let currrentPage = getCurrentPages()[getCurrentPages().length - 1].route;
			    }
			    sbSpeak();
			    break;
			  case 'speakEnd':
			    // clearInterval(self.speaking_timeout);
				self.isothersepak = false;
				self.isspeak = false;
				self.speaking_timeout = null;
				self.records.playOff(()=>{
					console.log('----');
				});
			    break;
			  case 'chatMute':
			  
			    break;
			  case 'roleChange':
			    
			    break;
			  case 'chatBlock':
			
			    break;
			  default:
			    break;
			}
		}catch(e){
			//TODO handle the exception
		}
		
		
	});
	return;
}