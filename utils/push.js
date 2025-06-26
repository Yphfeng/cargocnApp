
function getAllMessage () {
  return plus.push.getAllMessage();
}

function changeBadge (number) {
  const messages = this.getAllMessage();
  // plus.runtime.setBadgeNumber(0);
  // plus.runtime.setBadgeNumber(number || messages.length);
}
/**
   * @param {string} content 消息内容
   * @param {Object} payload 消息承载的数据
   * @param {Object} options 消息配置
   * @param {Boolean} isChange 创建消息后是否更新BadgeNumber
   * @example 
   * 	this.$push.create("点击查看消息内容>>", {url: "/pages/xxxx/xxx"}, {
      delay: 3,
      title: "您有3条新的消息",
    });
   */
function create (content, payload = {}, options, isChange) {
  plus.push.createMessage(...arguments);
  const delay = options.delay ? (~~options.delay * 1000) : 0;
  setTimeout(() => {
    isChange && this.changeBadge();
  }, delay)
}
/**
* @param {number} message 
* @description 
* 		- 传入message时，删除消息列表中的message；
*      - 不传参数：则全部清空
*/
function remove (message, isChange) {
  message ? plus.push.remove(message) : plus.push.clear();
  isChange && this.changeBadge();
}

/**
 * @description 需要在App.vue中onLaunch中调用
 */
function init () {
  plus.push.setAutoNotification(true); // setAutoNotification 默认就是true
  plus.push.addEventListener("click", (message) => {
    let { url } = message.payload;
    if (url) {
      uni.navigateTo({
        url,
        success: () => { }, // 可以根据需求删除消息 this.remove(message);
        complete: () => { } // 可以根据需求删除消息 this.remove(message);
      });
    }
  })
}
const pushMethods = {
  init: init,
  remove: remove,
  create: create,
  getAllMessage: getAllMessage,
  changeBadge: changeBadge
}
export default pushMethods