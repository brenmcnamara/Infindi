//
//  Environment.h
//  Infindi
//
//  Created by Brendan McNamara on 12/14/17.

#import <Foundation/Foundation.h>

@interface Environment : NSObject

+ (Environment *)sharedInstance;

- (NSDictionary *)variables;

- (NSString *)hostname;

@end
