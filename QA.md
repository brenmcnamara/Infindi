# Quality Assurance

**We need to maintain a high quality of usability for this app. This document outlines
manual testing steps to make sure everything is working as expected.**

## Home Page

#### "No Thanks" on the First Action Item

*NOTE: Please make sure there is at least 3 action items on the home page for this test*

- Steps:
  - On the home page, select "No Thanks" on the first action item in the list
- Expected Result:
  - Action items should shift to their expected locations (make sure animation is there)
  - The new first action item should be white and should be in the exact same position as the
    action item that was removed

#### "No Thanks" on the Last Action Item

*NOTE: Please make sure there is at least 3 action items on the home page for this test*

- Steps:
  - On the home page, select "No Thanks" on the last action item in the list
- Expected Result:
  - Action items should pop to their expected locations (this currently has no animation)
  - The new last action item should be white and should be in the exact same position as the
    action item that was removed
  
#### "No Thanks" on an Action Item that is Neither First nor Last

*NOTE: Please make sure there are at least 3 action items on the home page for this test*

- Steps:
  - On the home page, select "No Thanks" on an action item that is neither first nor last
- Expected Result:
  - Action items should shift into place (make sure animation is present)
  - The new action item in the middle should be white and should be in the exact same position
    as the action item that was removed

#### "See Details" on an Action Item

*NOTE: Please make sure there are at least 3 action items on the home page for this test*

- Steps:
  - On the home page, click "See Details" on an action item
- Expected Result:
  - The action item card should animate into a full action item component
  - The animation should look as if it is expanding out from the card you clicked on
  - *NOTE:* Please try doing this for an action item card that is first in the list, last in the
    list and somewhere in the middle. Make sure that it appears as though the action item is
    expanding from the card correctly
  

## Offline Mode

#### No Internet Connection While Logged Out

- Steps:
  - Logout of your account
  - Disconnect your phone from the internet
- Expected Result:
  - You should see a full page message indicating that the user must connect to the
    internet before continuing in the app

#### No Internet Connection While Logged In

- Steps:
  - Login to an account
  - Disconnect your phone from the internet
- Expected Result:
  - You should see a small banner indicating that you must connect to the internet
    before continuing in the app
  

## General

#### Transition Quickly from Available Cash Information Popup Back to Account Page

- Steps:
  - Click the information icon near 'AVAILABLE CASH' 
  - Double-click anywhere on the screen
- Expected Result:
  - No crash and the information popup fades away
  
