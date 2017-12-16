//
//  Environment.m
//  Infindi
//
//  Created by Brendan McNamara on 12/14/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "Environment.h"

@implementation Environment

+ (Environment *)sharedInstance {
  static Environment *instance;
  if (instance == nil) {
    instance = [[Environment alloc] init];
  }
  return instance;
}

- (NSDictionary *)variables {
  NSString *path = [[NSBundle mainBundle] pathForResource: @"Infindi-Env" ofType: @"plist"];
  return [[NSDictionary alloc] initWithContentsOfFile: path];
}

-(NSString *)hostname {
  return [[self variables] objectForKey:@"hostname"];
}

@end