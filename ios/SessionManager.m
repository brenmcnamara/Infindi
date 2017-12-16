//
//  SessionManager.m
//  Infindi
//
//  Created by Brendan McNamara on 12/13/17.

#import <UIKit/UIKit.h>

#import "SessionManager.h"
#import "Environment.h"

@interface SessionManager()

@property (nonatomic, copy) NSString *sessionID;
@property (nonatomic, copy) NSString *idToken;
@property (nonatomic, strong) NSTimer *heartbeatTimer;
@property (nonatomic, strong) NSURLSession *session;

- (void)heartbeat;

@end

@implementation SessionManager

@synthesize hasOpenSession = _hasOpenSession;

+ (SessionManager *)sharedInstance {
  static SessionManager *sharedInstance = nil;
  
  if (sharedInstance == nil) {
    sharedInstance = [[SessionManager alloc] init];
  }
  
  return sharedInstance;
}

- (void)startSessionWithToken:(NSString *)idToken {
  NSAssert(self.sessionID == nil, @"Cannot start session with sessionID existing");

  self.idToken = idToken;

  NSString *urlPath = [[[Environment sharedInstance] hostname] stringByAppendingString:@"/session/start"];
  NSURL *url = [[NSURL alloc] initWithString:urlPath];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];

  // SET BODY
  // TODO: There is definitely a better way to do this. Should probably find some json library to encode this
  // for me.
  NSMutableString *body = [[NSMutableString alloc] init];
  [body appendString: @"{"];
  [body appendString: @"\"device\": {"];
  [body appendFormat: @"\"appBuildNumber\": %@,", [[NSBundle mainBundle] objectForInfoDictionaryKey: @"CFBundleVersion"]];
  [body appendFormat: @"\"appVersion\": \"%@\",", [[NSBundle mainBundle] objectForInfoDictionaryKey: @"CFBundleShortVersionString"]];
  [body appendFormat: @"\"bundleIdentifier\": \"%@\",", [NSBundle mainBundle].bundleIdentifier];
  [body appendFormat: @"\"deviceID\": \"%@\",", [UIDevice currentDevice].identifierForVendor];
  [body appendFormat: @"\"osVersion\": \"%@\"", [UIDevice currentDevice].systemVersion];
  [body appendString: @"}"];
  [body appendString: @"}"];
  
  request.HTTPBody = [body dataUsingEncoding: NSASCIIStringEncoding];

  // SET HEADERS
  [request setValue:@"application/json" forHTTPHeaderField: @"Content-Type"];
  [request setValue:[NSString stringWithFormat: @"%lu", body.length] forHTTPHeaderField: @"Content-Length"];
  [request setValue:idToken forHTTPHeaderField: @"Authorization"];

  request.HTTPMethod = @"POST";

  __weak SessionManager *weakSelf = self;

  NSURLSession *session = [NSURLSession sharedSession];
  
  
  NSURLSessionDataTask *task = [session dataTaskWithRequest:request
                                          completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
                                            [weakSelf handleStartSessionWithData: data response: response error: error];
                                          }];
  [task resume];
}

- (void)endSession {
  NSAssert(self.sessionID != nil, @"endSession cannot be called with nil sessionID");
  NSString *urlPath = [[[Environment sharedInstance] hostname] stringByAppendingFormat: @"/session/end/%@", self.sessionID];
  NSURL *url = [[NSURL alloc] initWithString: urlPath];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL: url];
  
  request.HTTPBody = [@"{}" dataUsingEncoding: NSASCIIStringEncoding];
  
  [request setValue: @"application/json" forHTTPHeaderField: @"Content-Type"];
  [request setValue: @"2" forHTTPHeaderField: @"Content-Length"];
  [request setValue: self.idToken forHTTPHeaderField: @"Authorization"];
  
  request.HTTPMethod = @"POST";
  
  [[[NSURLSession sharedSession] dataTaskWithRequest: request] resume];
  
  if (self.heartbeatTimer) {
    [self.heartbeatTimer invalidate];
    self.heartbeatTimer = nil;
  }
}

- (void)endSessionIfExists {
  if (self.sessionID) {
    [self endSession];
  }
}

- (void)heartbeat {
  if (self.sessionID == nil) {
    return;
  }
  NSString *urlPath = [[[Environment sharedInstance] hostname] stringByAppendingFormat: @"/session/heartbeat/%@", self.sessionID];
  NSURL *url = [[NSURL alloc] initWithString: urlPath];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL: url];
  
  request.HTTPBody = [@"{}" dataUsingEncoding: NSASCIIStringEncoding];

  [request setValue: @"application/json" forHTTPHeaderField: @"Content-Type"];
  [request setValue: @"2" forHTTPHeaderField: @"Content-Length"];
  [request setValue: self.idToken forHTTPHeaderField: @"Authorization"];

  request.HTTPMethod = @"POST";

  [[[NSURLSession sharedSession] dataTaskWithRequest: request] resume];
}

#pragma mark - Callbacks

- (void)handleStartSessionWithData: (NSData *)data response:(NSURLResponse *)response error:(NSError *)error {
  if (error != nil) {
    [self startSessionDidFailWithErrorCode:@"infindi/local-error"
                                  errorMessage: [error localizedDescription]];
    return;
  }
  
  NSError *jsonError = nil;
  NSDictionary *json = [NSJSONSerialization JSONObjectWithData: data
                                                       options: kNilOptions
                                                         error: &jsonError];
  if (jsonError != nil) {
    [self startSessionDidFailWithErrorCode:@"infindi/local-error"
                                  errorMessage:@"Failed to parse json response"];
    return;
  }
  
  NSInteger status = [(NSHTTPURLResponse *)response statusCode];
  if (status >= 400) {
    [self startSessionDidFailWithErrorCode: [json objectForKey: @"errorCode"]
                                  errorMessage: [json objectForKey: @"errorMessage"]];
    return;
  }
  
  NSDictionary *jsonData = [json objectForKey: @"data"];
  if (jsonData == nil) {
    [self startSessionDidFailWithErrorCode: @"infindi/local-error"
                              errorMessage: @"JSON response missing \"data\" field"];
    return;
  }

  NSString *sessionID = [jsonData objectForKey: @"refID"];
  if (sessionID == nil) {
    [self startSessionDidFailWithErrorCode: @"infindi/local-error"
                              errorMessage: @"JSON response missing \"data.refID\" field"];
    return;
  }

  [self startSessionDidSucceedWithID: sessionID];
}

- (void)startSessionDidSucceedWithID:(NSString *)sessionID {
  NSAssert(self.sessionID == nil, @"Cannot start a session when sessionID is not nil");
  self.sessionID = sessionID;
  __weak SessionManager *weakSelf = self;
  self.heartbeatTimer = [NSTimer timerWithTimeInterval: 45.0 repeats: YES block: ^(NSTimer * _Nonnull timer) {
    [weakSelf heartbeat];
  }];
  // TODO: Please make sure this is not going to block UI operations and updates. Worried that
  // this is running on the main thread.
  [[NSRunLoop mainRunLoop] addTimer: self.heartbeatTimer forMode: NSRunLoopCommonModes];
}

- (void)startSessionDidFailWithErrorCode:(NSString *)errorCode errorMessage:(NSString *)errorMessage {
  // TODO: For now, we will just leave failed sessions alone. Should track this, so we can eventually use these
  // sessions to track metrics and maintain security.
  NSLog(@"STARTING SESSION FAILED WITH ERROR CODE: %@", errorCode);
}

- (void)endSessionInProgress {
  self.sessionID = nil;
  self.idToken = nil;
}

@end
