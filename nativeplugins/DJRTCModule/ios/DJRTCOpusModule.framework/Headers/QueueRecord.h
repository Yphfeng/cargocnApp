//
//  QueueRecord.h
//  AudioqueuePlay
//
//  Created by admin on 2021/12/29.
//  Copyright © 2021 yjl. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface QueueRecord : NSObject

@property (nonatomic, copy)void (^recordBack)(NSData *data);

- (void)startRecord;

- (void)endRecord;

- (void)resetRecord;

@end

NS_ASSUME_NONNULL_END
