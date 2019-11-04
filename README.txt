=====================================================================
George Brown College               |          Fullstack Development 2
November 2019 - Final Project      |      Andrew Starling | 100191710
=====================================================================
                        'Client Management System'
=====================================================================
The application can be launched at:

https://fs2-final-project-68e14.web.app

The 'Sign In' screen will appear.

Enter Username(Google email address) and Password.
2 test Google accounts have been created as system users in Firebase:

email: fullstackdevone@gmail.com	password: xyz0987@
email: fullstackdevtwo@gmail.com	password: dcba4321!

Use either of these accounts to sign in to the Client Management System.
The main screen for interacting with the database will appear.

Records are retrieved from Firebase. Query key is the UID associated 
with the Google user account. A snapshot of the database is returned
that matches the user's UID.

Clicking on a highlighted client name on the left side of the screen
displays an associated Client Details box to the right.

Clicking on the pencil/scissors icons, allows for the editing/deletion
of the particular client record.

Hovering over the buttons at the top of the screen allows for adding a
new client record, showing the user's Email address (Username) and UID,
and an About button that shows a short bio.

* Please note: Some error checking has been included in the application.
If the app was going into production and had to be bulletproof, I would
make error checking more robust. For example: checking for existence of
mandatory fields, pattern checking on fields like phone, email, birthdate,
and warnings on number of characters entered for the client name.





