# Quality Assurance

**We need to maintain a high quality of usability for this app. This document outlines
manual testing steps to make sure everything is working as expected.**

## Test Cases

**Login Existing User**
- Test Steps:
  - Start from the login page
  - Put in the credentials for the public test account:
    - email: infindi.testing@gmail.co
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
