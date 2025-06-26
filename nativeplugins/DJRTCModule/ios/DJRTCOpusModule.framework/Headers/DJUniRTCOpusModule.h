//
//  DJUniRTCOpusModule.h
//  DJRTCOpusModule
//
//  Created by admin on 2022/1/4.
//

#import <Foundation/Foundation.h>
#import "DCUniModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface DJUniRTCOpusModule : DCUniModule

/**
 全局事件
 */

/// 弱网检测
/// eventName weakNetworkTip
/// params {}

/// socket 连接成功
/// eventName socketConnectSuccess
/// params { @"result" : @"0", @"msg" : @"success", @"data" : @{} }

/// socket 连接失败或者断开
/// eventName socketConnectFailure
/// params { @"result" : @"1", @"msg" : @"socket connect failure", @"data" : @{} }


/**
 插件方法
 */

/// 初始化
/// @param options { "userId" : "自己的userId",  "roomId" : "房间Id", "host" : "ip地址", "port": "端口号" }
/// @param callback {
//      "result" : "0", // 0 成功 1失败
//      "msg" : "success",
//      "data" :  {}
// }
- (void)initialize:(NSDictionary *)options callback:(UniModuleKeepAliveCallback)callback;

/// 打开麦克风
- (void)microphoneOn:(UniModuleKeepAliveCallback)callback;

/// 关闭麦克风
- (void)microphoneOff:(UniModuleKeepAliveCallback)callback;

/// 开始播放
- (void)playOn:(UniModuleKeepAliveCallback)callback;

/// 停止播放
- (void)playOff:(UniModuleKeepAliveCallback)callback;

/// 退出房间
- (void)exitRoom:(UniModuleKeepAliveCallback)callback;

@end

NS_ASSUME_NONNULL_END
