# Quality Assurance

**We need to maintain a high quality of usability for this app. This document outlines
manual testing steps to make sure everything is working as expected.**

## Authentication

**Login Existing User**
- Test Steps:
  - Start from the login page
  - Put in the credentials for the public test account:
    - email: infindi.testing@gmail.com
    - password: public_password2
  - Hit Login
- Expected Result:
  - Should see loading page, followed by the the account of the logged-in user

**Logout from Account**
- Test Steps:
  - Start from logged-in account
  - Click on the top-left nav button
  - In the left side pane, click sign out
- Expected Result:
  - Should be navigated back to the login page of the user
 
 ## Accounts Screen
 
 **User with no provider links or accounts will see the null-state page**
 - Test Steps:
   - Start from a logged-out account
   - In the backend repository, run the script to delete all user data:
     - `node bin/delete-all-user-data userID=<userID>`
     - **NOTE: Make sure you know what you are doing, this permanantely deletes user data**
   - Login with the user that had his / her data wiped clean
   - Wait for everything to load
 - Expected Result:
   - Should see the null-state page after logging in

**Accounts list auto-updates with changes to accounts**
- Test steps:
  - Start from a logged-in account on the Accounts screen
  - In the backend repository, run the script to delete one of the links from the user:
    - `node bin/delete-account-link accountLinkID=<accountLinkID>`
    - **NOTE: Make sure you know what you are doing, this permanantely deletes user data**
  - Wait for the script to finish running
- Expected Result:
  - Should see the screen auto-update to reflect the deleted data
  - Make sure the net worth and the net value of each section reflects the fact that some accounts were removed
  - Try running this script when there is only 1 account link and when there is more than one account link. This will test both conditions of whether we are deleting the last account link or if there are still account links left in the list.

 ## Provider Search
 
 **View a Dropdown of all the Providers**
 - Test Steps:
   - Start from logged-in account
   - Click on the "ADD ACCOUNT" button on the bottom
 - Expected Result:
   - Navigates to the provider list screen
   - Once the loading is done, should see a list of provider to login with
   - Test with admin account and non-admin account:
     - Admin accounts have a "Test Login" option on the top of the list
     - Non-Admin accounts do not have a "Test Login" option in the list

**Filter Providers Using Fuzzy Search**
- Test Steps:
  - Start from logged-in account
  - Click on the "ADD ACCOUNT" button on the bottom
  - Select the search bar and type something in it
- Expected Result:
  - Expected to see the search shrink to providers relevant to the text search

**Provider Search is Maintained During Page Switches**
- Test Steps:
  - Start from logged-in account
  - Click on the "ADD ACCOUNT" button on the bottom
  - Select the search bar and type something in it
  - Click the back button on the top left to return to the home page
  - Click on the "ADD ACCOUNT" button again
- Expected Result:
  - The text that was entered in the provider is remembered after enginering the page
  - The list of providers is relevant to the text search
  
## Provider Linking

 **Successful Link with a Yodlee Provider**
 - Test Steps:
   - Start from logging-in account
   - Click on the "ADD ACCOUNT" button
   - Select a provider from the dropdown list (other than "Test Login")
   - Enter the login information for the provider
 - Expected Result:
   - *TODO*
 - Additional Notes:
   - Try performing links under the following conditions:
     - Link a provider that has already been linked for the user
     - Link a provider for the first time
     - Link a provider when the user has no providers that have yet been linked
 
 ## Admin Features
 
**The Admin Pane Icon shows for admin users**
  - Test Steps:
    - Start with logged-out account
    - Log in with admin credentials
  - Expected Result:
    - There should be a button on the top right of the home screen containing admin-specific options

**The Admin Pane Icon does not show for public users**
  - Test Steps:
    - Start with logged-out account
    - Log in with public (non-admin) credentials
  - Expected Result:
    - There should be no button on the top right for admin options
   
