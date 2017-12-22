//
//  PlaidLinkManager.m
//  Infindi
//
//  Created by Brendan McNamara on 12/16/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "PlaidLinkManager.h"

#import "Environment.h"

@interface PlaidLinkManager()

@property (nonatomic, assign) PlaidLinkAvailability availability;
@property (nonatomic, copy) PlaidLinkAvailabilityBlock availabilityBlock;
@property (nonatomic, strong) PLKPlaidLinkViewController *linkController;
@property (nonatomic, copy) PlaidLinkCompletionBlock completionBlock;
@property (nonatomic, strong) UIViewController *containingController;

@end

@implementation PlaidLinkManager

+ (PlaidLinkManager *)sharedInstance {
  static id instance = nil;
  if (instance == nil) {
    instance = [[PlaidLinkManager alloc] init];
  }
  return instance;
}

- (void)initializeWithContainingController:(UIViewController *)containingController {
  self.containingController = containingController;

  if (![[Environment sharedInstance] allowPlaidLink]) {
    self.availability = PlaidLinkAvailabilityNo;
    if (self.availabilityBlock) {
      self.availabilityBlock(NO);
    }
    return;
  }

  [PLKPlaidLink setupWithSharedConfiguration:^(BOOL success, NSError * _Nullable error) {
    self.availability = success && error == nil
      ? PlaidLinkAvailabilityYes
      : PlaidLinkAvailabilityNo;
    if (self.availabilityBlock) {
      self.availabilityBlock(self.availability == PlaidLinkAvailabilityYes);
      self.availabilityBlock = nil;
    }
  }];
}

- (PLKPlaidLinkViewController *)linkController {
  if (_linkController == nil) {
    _linkController = [[PLKPlaidLinkViewController alloc] initWithDelegate: self];
  }
  return _linkController;
}

- (void)showPlaidLink: (PlaidLinkCompletionBlock)completionBlock {
  NSAssert(self.containingController != nil, @"Cannot show plaid link without containing controller");
  NSAssert(self.availability != PlaidLinkAvailabilityNo, @"Cannot show plaid link when link is not available");
  self.completionBlock = completionBlock;
  [self.containingController presentViewController: self.linkController animated: YES completion: nil];
}

- (void)hidePlaidLink {
  NSAssert(self.availability != PlaidLinkAvailabilityNo, @"Cannot hide plaid link when link is not available");
  self.completionBlock = nil;
  [self.linkController dismissViewControllerAnimated: YES completion:^{
    self.linkController = nil;
  }];
}

- (void)checkLinkAvailability: (PlaidLinkAvailabilityBlock)availabilityBlock {
  if (self.availability == PlaidLinkAvailabilityUnknown) {
    self.availabilityBlock = availabilityBlock;
    return;
  }
  availabilityBlock(self.availability == PlaidLinkAvailabilityYes);
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
