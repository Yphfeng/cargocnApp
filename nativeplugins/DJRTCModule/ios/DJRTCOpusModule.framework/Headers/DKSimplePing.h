//
//  DKSimplePing.h
//  Demo
//
//  Created by admin on 2022/3/24.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DKSimplePing : NSObject

+ (void)pingWithHost:(NSString *)host
          completion:(void (^)(double elapsedTime, NSError *error))completionBlock;

+ (void)pingWithHost:(NSString *)host
             timeout:(NSTimeInterval)timeout
          completion:(void (^)(double elapsedTime, NSError *error))completionBlock;

@end

NS_ASSUME_NONNULL_END
