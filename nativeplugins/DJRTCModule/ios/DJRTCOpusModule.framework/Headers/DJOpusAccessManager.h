//
//  DJOpusAccessManager.h
//  DJRTCOpusModule
//
//  Created by admin on 2022/1/4.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DJOpusAccessManager : NSObject

// 请求权限
+ (void)accessCameraWithCallback:(void(^)(BOOL access))callback;

+ (void)accessMicrophoneWithCallback:(void(^)(BOOL access))callback;

@end

NS_ASSUME_NONNULL_END
