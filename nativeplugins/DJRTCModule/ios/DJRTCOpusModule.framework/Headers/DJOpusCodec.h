//
//  DJOpusCodec.h
//  DJRTCOpusModule
//
//  Created by admin on 2022/1/4.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DJOpusCodec : NSObject

- (void)opusInit;

- (NSData *)encode:(NSData *)data;

- (NSData *)decode:(NSData *)data;

- (void)destroy;

@end

NS_ASSUME_NONNULL_END
