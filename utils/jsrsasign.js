const {KJUR, hextob64} = require('jsrsasign');

const HashMap = {
    SHA256withRSA: 'SHA256withRSA',
    SHA1withRSA: 'SHA1withRSA'
}

const PEM_BEGIN = '-----BEGIN PRIVATE KEY-----\n';
const PEM_END = '\n-----END PRIVATE KEY-----';

/**
 * rsa签名参考：https://www.jianshu.com/p/145eab95322c
 */
exports.SignUtil = {
    /**
     * rsa签名
     * @param content 签名内容
     * @param privateKey 私钥，PKCS#1
     * @param hash hash算法，SHA256withRSA，SHA1withRSA
     * @returns 返回签名字符串，base64
     */
    rsaSign: function (content, privateKey, hash) {
        privateKey = this._formatKey(privateKey)
        // 创建 Signature 对象
        const signature = new KJUR.crypto.Signature({
            alg: hash,
            //!这里指定 私钥 pem!
            prvkeypem: privateKey
        })
        signature.updateString(content)
        const signData = signature.sign()
        // 将内容转成base64
        return hextob64(signData)
    },
    _formatKey: function (key) {
        if (!key.startsWith(PEM_BEGIN)) {
            key = PEM_BEGIN + key
        }
        if (!key.endsWith(PEM_END)) {
            key = key + PEM_END
        }
        return key
    }
}