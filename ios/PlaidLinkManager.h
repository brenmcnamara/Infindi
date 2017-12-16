//
//  PlaidLinkManager.h
//  Infindi
//
//  Created by Brendan McNamara on 12/16/17.

#import <UIKit/UIKit.h>
#import <LinkKit/LinkKit.h>

typedef void (^ PlaidLinkCompletionBlock)(NSError *, NSString *, NSDictionary<NSString *, id> *);

@interface PlaidLinkManager : NSObject <PLKPlaidLinkViewDelegate>

@property (nonatomic, weak) UIViewController *containingController;

+ (PlaidLinkManager *)sharedInstance;

- (void)showPlaidLink: (PlaidLinkCompletionBlock)completionBlock;

- (void)hidePlaidLink;

@end
