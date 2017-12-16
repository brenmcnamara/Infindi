//
//  PlaidLinkManager.m
//  Infindi
//
//  Created by Brendan McNamara on 12/16/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "PlaidLinkManager.h"

@interface PlaidLinkManager()

@property (nonatomic, strong) PLKPlaidLinkViewController *linkController;
@property (nonatomic, copy) PlaidLinkCompletionBlock completionBlock;

@end

@implementation PlaidLinkManager

+ (id)sharedInstance {
  static id instance = nil;
  if (instance == nil) {
    instance = [[PlaidLinkManager alloc] init];
  }
  return instance;
}

- (PLKPlaidLinkViewController *)linkController {
  if (_linkController == nil) {
    _linkController = [[PLKPlaidLinkViewController alloc] initWithDelegate: self];
  }
  return _linkController;
}

- (void)showPlaidLink: (PlaidLinkCompletionBlock)completionBlock {
  NSAssert(self.containingController != nil, @"Cannot show plaid link without containing controller");
  self.completionBlock = completionBlock;
  [self.containingController presentViewController: self.linkController animated: YES completion: nil];
}

- (void)hidePlaidLink {
  self.completionBlock = nil;
  [self.linkController dismissViewControllerAnimated: YES completion: nil];
}

#pragma mark - PLKPlaidLinkViewDelegate

- (void)linkViewController:(PLKPlaidLinkViewController *)linkViewController
 didSucceedWithPublicToken:(NSString *)publicToken
                  metadata:(NSDictionary<NSString *,id> *)metadata {
  NSAssert(self.completionBlock != nil, @"Completion block cannot be nil");
  self.completionBlock(nil, publicToken, metadata);
}

- (void)linkViewController:(PLKPlaidLinkViewController *)linkViewController
          didExitWithError:(NSError *)error
                  metadata:(NSDictionary<NSString *,id> *)metadata {
  NSAssert(self.completionBlock != nil, @"Completion block cannot be nil");
  self.completionBlock(error, nil, metadata);
}

@end
