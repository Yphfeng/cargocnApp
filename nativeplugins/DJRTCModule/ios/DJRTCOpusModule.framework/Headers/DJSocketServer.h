//
//  DJSocketServer.h
//  DJRTCOpusModule
//
//  Created by admin on 2022/1/4.
//

#import <Foundation/Foundation.h>

//static NSString * const kSocketHost = @"192.168.62.135";         // 开发环境
//static NSString * const kSocketHost = @"192.168.6.162";        // 测试环境
//static NSString * const kSocketHost = @"talk-api.omwchat.com"; // 测试环境
//static NSString * const kSocketPort = @"7777";

NS_ASSUME_NONNULL_BEGIN

@class DJSocketServer;

@protocol DJSocketServerDelegate <NSObject>

- (void)didConnectionSuccess:(DJSocketServer *)sock;

- (void)didConnectionFailure:(DJSocketServer *)sock;

- (void)socket:(DJSocketServer *)sock didReceiveData:(NSData *)data;

@end

@interface DJSocketServer : NSObject

@property (nonatomic, weak) id <DJSocketServerDelegate> delegate;

@property (nonatomic, assign, readonly) BOOL isConnect;

- (instancetype)initWithUserId:(NSString *)userId roomId:(NSString *)roomId;

- (void)connectToHost:(NSString *)host onPort:(NSString *)port;

- (void)disconnect;

- (void)sendAudio:(NSData *)data length:(int)len;


// 发送业务消息

// 加入房间消息
- (void)sendJoinRoom;

// 发送语音消息
- (void)sendAudio:(NSData *)data;

// 开启心跳包
- (void)startPingHeart;

// 停止心跳包
- (void)stopPingHeart;

@end

NS_ASSUME_NONNULL_END
