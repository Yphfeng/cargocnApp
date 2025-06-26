//
//  QueuePlayer.h
//  audioqueue 录音
//
//  Created by Hellen Yang on 2017/7/19.
//  Copyright © 2017年 yjl. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface QueuePlayer : NSObject

- (void)playWithData:(NSData *)data;

- (void)startPlay;

- (void)stopPlay;

- (void)resetPlay;

@end
