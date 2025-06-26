export default class RY {
  constructor(im){
    // 添加事件监听
    this.im = im;
    const app = getApp();
    im.watch({
      // 监听会话列表变更事件
      conversation (event) {
        // 假定存在 getExistedConversationList 方法，以获取当前已存在的会话列表数据
        const conversationList = getExistedConversationList&&getExistedConversationList()
        // 发生变更的会话列表
        const updatedConversationList = event.updatedConversationList;
        // 通过 im.Conversation.merge 计算最新的会话列表
        const latestConversationList = im.Conversation.merge({ conversationList, updatedConversationList })
      },
      // 监听消息通知
      message (event) {
        // 新接收到的消息内容
        // console.log(app);
        const message = event.message;
        app.globalData.imMessage = message;
        // console.log(message,'<<<< im 状态');
      },
      // 监听 IM 连接状态变化
      status (event) {
        console.log('connection status:', event.status);
      },
      // 监听聊天室 KV 数据变更
      chatroom (event) {
        /**
         * 聊天室 KV 存储数据更新
         * @example
         * [
         *  {
         *    "key": "name",
         *    "value": "我是小融融",
         *    "timestamp": 1597591258338, 
         *    "chatroomId": "z002", 
         *    "type": 1 // 1: 更新（ 含:修改和新增 ）、2: 删除
         *  },
         * ]
         */
        const updatedEntries = event.updatedEntries
      },
      expansion (event) {
        /**
         * 更新的消息拓展数据
         * @example {
         *    expansion: { key: 'value' },      // 设置或更新的扩展值
         *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
         * }
         */
        const updatedExpansion = event.updatedExpansion;
        /**
         * 删除的消息拓展数据
         * @example {
         *    deletedKeys: ['key1', 'key2'],    // 设置或更新的扩展值
         *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
         * }
         */
        const deletedExpansion = event.deletedExpansion;
      }
    });
  }
  connect(token,roomid){
    let self = this;
    return new Promise((resolve,reject)=>{
      self.im.connect({ token:token}).then(user => {
        console.log('链接成功, 链接用户 id 为: ', user.id);
        // uni.setStorageSync('redirect_url', null);
        resolve(user)
      }).catch(error => {
        console.log('链接失败1: ', error.code, error.msg);
        if(getCurrentPages()[getCurrentPages().length - 1].route == 'pages/voroom/voroom'){
          // uni.reLaunch({url:'/pages/voroom/voroom?roomid='+roomid});
        }
        reject(error);
      });
    });
  }
  reconnect(roomid){
    let self = this;
    return new Promise((resolve,reject)=>{
      self.im.reconnect().then(user => {
        console.log('重新链接成功, 链接用户 id 为: ', user.id);
        // uni.setStorageSync('redirect_url', null);
        resolve(user)
      }).catch(error => {
        console.log('链接失败2: ', error.code, error.msg);
        if(getCurrentPages()[getCurrentPages().length - 1].route == 'pages/voroom/voroom'){
          // uni.reLaunch({url:'/pages/voroom/voroom?roomid='+roomid});
        }
        reject(error);
      });
    });
  }
  quit(e){
    this.im.disconnect().then(() => console.log('断开链接成功'));
  }
}