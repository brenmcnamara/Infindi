/**
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "Environment.h"
#import "PlaidLinkManager.h"
#import "SessionManager.h"

@interface AppDelegate()

@property (nonatomic, assign) BOOL isLoggedIn;

- (void)authStateDidChange:(FIRUser *)user;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef DEBUG
  NSString *serviceInfoPath = [[NSBundle mainBundle] pathForResource: @"GoogleService-Info-debug" ofType: @"plist"];
#else
  NSString *serviceInfoPath = [[NSBundle mainBundle] pathForResource: @"GoogleService-Info" ofType: @"plist"];
#endif
 
  FIROptions *options = [[FIROptions alloc] initWithContentsOfFile: serviceInfoPath];
  [FIRApp configureWithOptions: options];

  __weak AppDelegate *weakSelf = self;
  [[FIRAuth auth] addAuthStateDidChangeListener:^(FIRAuth * _Nonnull auth, FIRUser * _Nullable user) {
    [weakSelf authStateDidChange:user];
  }];

  NSURL *jsCodeLocation;
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Infindi"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;

  [[PlaidLinkManager sharedInstance] initializeWithContainingController: rootViewController];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = rootViewController;  
  self.window.backgroundColor = [UIColor whiteColor];
  [self.window makeKeyAndVisible];

  return YES;
}

- (void)applicationWillTerminate:(UIApplication *)application {
  [[SessionManager sharedInstance] endSessionIfExists];
}

- (void)authStateDidChange:(FIRUser *)user {
  if (user != nil && !self.isLoggedIn) {
    self.isLoggedIn = YES;
    [user getIDTokenWithCompletion:^(NSString * _Nullable token, NSError * _Nullable error) {
      if (error != nil) {
        NSLog(@"FAILED TO FETCH ID TOKEN %@", [error localizedDescription]);
      } else {
        [[SessionManager sharedInstance] startSessionWithToken: token];
      }
    }];
  } else if (user == nil && self.isLoggedIn) {
    self.isLoggedIn = NO;
    [[SessionManager sharedInstance] endSessionIfExists];
  }
}

@end
