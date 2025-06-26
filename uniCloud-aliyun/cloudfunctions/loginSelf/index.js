// 云函数验证签名，此示例中以接受GET请求为例作演示
const crypto = require('crypto')
exports.main = async function (event){

  const secret = 'fee7763818280c28b9f52c05117d4570' // 自己的密钥不要直接使用示例值，且注意不要泄露
  const hmac = crypto.createHmac('sha256', secret);
  
  let params = event.queryStringParameters;
  console.log(params, '参数', event)
  const sign = params.sign
  delete params.sign
  const signStr = Object.keys(params).sort().map(key => {
    return `${key}=${params[key]}`
  }).join('&')

  hmac.update(signStr);
  
  if(sign!==hmac.digest('hex')){
    throw new Error('非法访问')
  }

  const {
    access_token,
    openid
  } = params
  const res = await uniCloud.getPhoneNumber({
      provider: 'univerify',
    appid: '__UNI__EBABD02', // DCloud appid，不同于callFunction方式调用，使用云函数Url化需要传递DCloud appid参数
      apiKey: '27d288a529169d6e295d5b8a415bda83', // 在开发者中心开通服务并获取apiKey
      apiSecret: 'fee7763818280c28b9f52c05117d4570', // 在开发者中心开通服务并获取apiSecret
      access_token: access_token,
      openid: openid
  })
  // 返回手机号给自己服务器
  return res;
}