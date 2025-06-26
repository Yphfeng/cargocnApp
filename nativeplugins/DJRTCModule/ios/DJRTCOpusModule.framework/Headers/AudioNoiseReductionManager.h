//
//  AudioNoiseReductionManager.h
//  AudioqueuePlay
//
//  Created by admin on 2022/4/8.
//  Copyright © 2022 yjl. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface AudioNoiseReductionManager : NSObject
+ (instancetype)sharedInstance;
/**
 消噪

 @param buffer PCM原始数据
 @param length PCM数据长度
 @param fs 采样率
 @param quality 消噪质量(0,1,2,3)，0质量最差，3质量最好
 */
+ (void)denoise:(char *)buffer length:(NSUInteger)length fs:(NSUInteger)fs quality:(int)quality;
@end

NS_ASSUME_NONNULL_END
