//
//  PlaidLinkModule.m
//  Infindi
//
//  Created by Brendan McNamara on 12/16/17.

#import "EnvironmentModule.h"

#import "Environment.h"

@implementation EnvironmentModule

RCT_EXPORT_MODULE(Environment);

RCT_EXPORT_METHOD(fetchVariables: (RCTResponseSenderBlock)callback) {
  NSDictionary *envVars = [[Environment sharedInstance] variables];
  callback(@[envVars]);
}

@end
