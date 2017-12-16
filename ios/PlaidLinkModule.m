//
//  PlaidLinkModule.m
//  Infindi
//
//  Created by Brendan McNamara on 12/16/17.

#import "PlaidLinkModule.h"
#import "PlaidLinkManager.h"

@implementation PlaidLinkModule

RCT_EXPORT_MODULE(PlaidLink);

RCT_EXPORT_METHOD(show: (RCTResponseSenderBlock) callback) {
  [[PlaidLinkManager sharedInstance] showPlaidLink:^(NSError *error, NSString *publicToken, NSDictionary<NSString *,id> *metadata) {
    NSDictionary *payload = nil;
    if (error) {
      payload = @{
        @"type": @"LINK_FAILED",
        @"error": [error localizedDescription],
      };
    } else if (!error && publicToken) {
      payload = @{
        @"type": @"LINK_SUCCESS",
        @"publicToken": publicToken,
        @"metadata": metadata
      };
    } else {
      payload = @{
        @"type": @"LINK_QUIT"
      };
    }
    callback(@[payload]);
  }];
}

RCT_EXPORT_METHOD(hide) {
  [[PlaidLinkManager sharedInstance] hidePlaidLink];
}

RCT_EXPORT_METHOD(checkAvailability: (RCTResponseSenderBlock) callback) {
  [[PlaidLinkManager sharedInstance] checkLinkAvailability:^(BOOL isLinkAvailable) {
    callback(@[[NSNumber numberWithBool: isLinkAvailable]]);
  }];
}

@end
