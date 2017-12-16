//
//  Environment.h
//  Infindi
//
//  Created by Brendan McNamara on 12/14/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Environment : NSObject

+ (Environment *)sharedInstance;

- (NSDictionary *)variables;

- (NSString *)hostname;

@end
