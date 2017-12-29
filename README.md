# Infindi

## Deploy App to Test Flight And Apple Store

Before you start, make sure you have the correct provisioning profiles and credentials downloaded onto
your machine.

***NOTE: Unless your name is Brendan McNamara, you should probably not be doing this.***

#### 1. Clone and setup the repo
  - You should be doing this even if you have a local copy of the repo. We want to make sure that
    the build on master works out-of-the-box and that you don't have any local state that is not
    being saved.

```
git clone <url>
cd Infindi
yarn
```

#### 2. Build the project on an actual device
  - We want to make sure the project is working in debug mode before trying production mode.
  - Plug in your device into your computer
  - Open xcode
  - On the top left, switch the device to your physical device
  - Build and Run (cmd + R)
  - play around with the app for a moment to make sure everything is working

#### 3. Switch the scheme to "Release"
  - In Xcode, on the top menu bar, Product -> Scheme -> Edit Scheme...
  - In the left pane, select run
  - Under build configuration, select "Release"
  - Hit "close"
  
#### 4. Disable HTTP non-secure requests
  - HTTP communication is allowed in debug for "localhost" so that we can package the JS and send
    it to the device for hot reloading on devices. We don't want plain HTTP communication in
    production due to security (and apple will not allow us to submit apps that use plain HTTP)
  - In the project tree on the left, go to Infindi -> Info.plist
  - In the plist, open "App Transport Security Settings" -> "Exception Domains" -> "localhost"
  - Change "NSExceptionAllowsInsecureHTTPLoads" to "NO"

#### 5. Increment the version number
  - In Xcode, under the project tree on the left pane, click on the Project
  - Under the list of targets, select "Infindi"
  - Under the "General" tab and "Identity" section, increment *both* the version number and build number

#### 6. Clean and Archive the project
  - In Xcode, cmd + shift + k
  - Then, in the Xcode top menu, select "Product" -> "Archive"
  - NOTE: This will take a very long time. Compiling code for production is a long process
  - While this is hapenning, it is a good idea to run `git diff` in the git repo to make sure you did not
    accidentally introduce any unintended changes

```
git diff --name-only
```

You should see the following files:

```
ios/Infindi.xcodeproj/xcshareddata/xcschemes/Infindi.xcscheme
ios/Infindi/Info.plist
```

#### 7. Send the archive to the apple store
  - NOTE: If you are deploying only to test flight, you should still do this step. Don't worry, it won't
    actually put the app on the app store
  - Once archiving is done, it should automatically open the organizer. If it doesn't, you can get to it
    in the Xcode top menu: Window -> Organizer
  - Select the build you just archived
  - In the right pane, there is an option to "Upload to App Store...". Click on that
  - If it asks for credentials, you can get them from the Google Drive Infindi folder
  - Make sure checkboxes for "Include bitcode for iOS content" and
    "Upload your App's symbols to receive symbolicated reports from Apple" are both selected, hit "Next"
  - Select the correct provisioning profile and certificate: "iOS Distribution" and "App Store Findi Provisioning"
  - Select "Upload"

#### 8. Save the build
  - We keep copies of all our builds in the GDrive folder
  - In the organizer, select "export"
  - This will put you through the same flow as in step 8 when uploading to the App Store. Answer the questions the same
  - Name the ipa file that is exported using the following convention: "com.findi.main-<version number>"
  - Put it in the "IPA Files" folder of the GDrive

#### 9. You will receive an email notifying if the build was successful or not
  - If not, please make the necessary fixes or reach out to someone if you do not know how to fix the issue
  - Note that it may take a while for test flight to review and accept the beta. This email could take a while to show

#### 10. In Test Flight, under the new build, go through the compliance steps
  - We do not use encryption

#### 11. Undo steps 4 and 5
  - We want our local repo to be configured for debug, not release

#### 12. Commit and push the new version and build number

#### 13. Happy Dance!
