//
//  QueueConfig.h
//  AudioqueuePlay
//
//  Created by admin on 2021/12/29.
//  Copyright © 2021 yjl. All rights reserved.
//

#import <Foundation/Foundation.h>

#define QUEUE_BUFFER_SIZE   3     // 队列缓冲个数
#define MIN_SIZE_PER_FRAME  3840  // 每帧最小数据长度
#define kSampleRate         8000  // 采样率
#define kChannels           1     // 声道数
#define kBits               16    // 位数
//#define kDefaultBufferDurationSeconds 0.24 // 调整这个值使得录音的缓冲区大小为960, 实际会小于或等于960, 需要处理小于960的情况
