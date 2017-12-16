//
//  SessionManager.h
//  Infindi
//
//  Created by Brendan McNamara on 12/13/17.

#import <Foundation/Foundation.h>

@interface SessionManager : NSObject

@property (nonatomic, readonly) BOOL hasOpenSession;

+ (SessionManager *)sharedInstance;

- (void)startSessionWithToken:(NSString *)idToken;

- (void)endSession;

- (void)endSessionIfExists;

@end
