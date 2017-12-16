//
//  PlaidLinkManager.h
//  Infindi
//
//  Created by Brendan McNamara on 12/16/17.

#import <UIKit/UIKit.h>
#import <LinkKit/LinkKit.h>

typedef void (^ PlaidLinkCompletionBlock)(NSError *, NSString *, NSDictionary<NSString *, id> *);
typedef void (^ PlaidLinkAvailabilityBlock)(BOOL isLinkAvailable);

typedef enum {
  PlaidLinkAvailabilityUnknown,
  PlaidLinkAvailabilityYes,
  PlaidLinkAvailabilityNo,
} PlaidLinkAvailability;

@interface PlaidLinkManager : NSObject <PLKPlaidLinkViewDelegate>

+ (PlaidLinkManager *)sharedInstance;

- (void)initializeWithContainingController: (UIViewController *)containingController;

- (void)checkLinkAvailability: (PlaidLinkAvailabilityBlock)isLinkAvailable;

- (void)showPlaidLink: (PlaidLinkCompletionBlock)completionBlock;

- (void)hidePlaidLink;

@end
