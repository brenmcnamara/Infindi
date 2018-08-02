# Quality Assurance

**We need to maintain a high quality of usability for this app. This document outlines
manual testing steps to make sure everything is working as expected.**

## Test Cases

### Authentication

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
 
 ### Provider Search
 
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
  
### Provider Linking

 **Successful Link with a Yodlee Provider**
 - Test Steps:
   - Start from logging-in account
   - Click on the "ADD ACCOUNT" button
   - Select a provider from the dropdown list (other than "Test Login")
   - Enter the login information for the provider
 - Expected Result:
   - *TODO*
   
