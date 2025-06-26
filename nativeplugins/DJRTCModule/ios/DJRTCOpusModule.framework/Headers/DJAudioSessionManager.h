//
//  DJAudioSessionManager.h
//  DJRTCOpusModule
//
//  Created by admin on 2022/1/7.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DJAudioSessionManager : NSObject

+ (instancetype)shareInstance;

- (void)setAudioSessionCategoryRecord;
- (void)setAudioSessionCategoryPlayback;

@end

NS_ASSUME_NONNULL_END
