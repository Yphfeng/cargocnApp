//
//  DKSimplePingAdapter.h
//  Demo
//
//  Created by admin on 2022/3/24.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class DKSimplePingAdapter;

@protocol DKSimplePingAdapterDelegate <NSObject>

- (void)pingAdapterDidSendPing:(DKSimplePingAdapter *)adapter;
- (void)pingAdapterDidReceivePong:(DKSimplePingAdapter *)adapter;
- (void)pingAdapter:(DKSimplePingAdapter *)adapter didFailPingWithError:(NSError *)error;

@end

@interface DKSimplePingAdapter : NSObject

@property (nonatomic) id <DKSimplePingAdapterDelegate> delegate;

- (void)startPingWithHost:(NSString *)host;
- (void)startPingWithHost:(NSString *)host timeout:(NSTimeInterval)timeout;
- (void)stopPinging;

@end

NS_ASSUME_NONNULL_END
