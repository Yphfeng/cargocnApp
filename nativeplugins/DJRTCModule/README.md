/**
 全局事件
 */

/// 发送 本地 candidate
/// eventName sendCandidateEvent
/// params { "candidate" : "", "sdpMLineIndex" : "", "sdpMid" : "" }


/// 添加 stream
/// eventName addStreamEvent
/// params { "userId" : "", "audioTrack" : audioTrackObj }


/// 移除 stream
/// eventName removeStreamEvent
/// params { "userId" : "", "audioTrack" : audioTrackObj }


/// Connection 状态改变通知
/// eventName changeConnectionStateEvent
/// change Connection State
/// params { "userId" : "", "state" : state }


/// Ice Connection 状态改变通知
/// eventName changeIceConnectionStateEvent
/// change Connection State
/// params { "userId" : "", "state" : state }



/**
 插件方法
 */

/// 初始化
- (void)initialize;

/// 创建 peerConnection
/// @param userId String
/// @return RTCPeerConnection
- (RTCPeerConnection *)createPeerConnection:(NSString *)userId;


/// 发送 offer
/// @param userId String
/// @param callback {
// "result" : "0", // 0 成功 1失败
// "msg" : "success",
// "data" :  {"sdp" : "", "type" : ""}
// }
- (void)offer:(NSString *)userId callback:(UniModuleKeepAliveCallback)callback;


/// 发送 answer
/// @param userId String
/// @param callback {
// "result" : "0", // 0 成功 1失败
// "msg" : "success",
// "data" :  {"sdp" : "", "type" : ""}
// }
- (void)answer:(NSString *)userId callback:(UniModuleKeepAliveCallback)callback;


/// 设置远程 SDP
/// @param options { "userId" : "",  "sdp" : "", "type" : "" }
/// @param callback {
// "result" : "0", // 0 成功 1失败
// "msg" : "success",
// "data" :  {}
// }
- (void)setRemoteSdp:(NSDictionary *)options callback:(UniModuleKeepAliveCallback)callback;


/// 发送远程 Candidate
/// @param options { "userId" : "",  "candidate" : "", "sdpMLineIndex" : "", "sdpMid" : "" }
/// @param callback {
// "result" : "0", // 0 成功 1失败
// "msg" : "success",
// "data" :  {}
// }
- (void)setRemoteCandidate:(NSDictionary *)options callback:(UniModuleKeepAliveCallback)callback;

/// 打开麦克风
- (void)speakerOff;

/// 关闭麦克风
- (void)speakerOn;





**
 全局事件
 */

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
/// @param options { "userId" : "自己的userId",  "roomId" : "房间Id" }
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