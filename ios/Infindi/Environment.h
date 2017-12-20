//
//  Environment.h
//  Infindi
//
//  Created by Brendan McNamara on 12/14/17.

#import <Foundation/Foundation.h>

@interface Environment : NSObject

@property (nonatomic, readonly) NSString *hostname;
@property (nonatomic, readonly) BOOL allowPlaidLink;

+ (Environment *)sharedInstance;

- (NSDictionary *)variables;

@end
