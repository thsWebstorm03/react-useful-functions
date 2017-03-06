# Send Firebase Cloud Messaging notifications for new followers.

This sample demonstrates how to send a Firebase Cloud Messaging (FCM) notification from a Realtime Database triggered Function. The sample also features a Web UI to experience the FCM notification.


## Functions Code

See file [functions/index.js](functions/index.js) for the code.

Sending the notification is done using the [Firebase Admin SDK](https://www.npmjs.com/package/firebase-admin). The Web client writes the individual device tokens to the realtime database which the Function uses to send the notification.

The dependencies are listed in [functions/package.json](functions/package.json).


## Sample Database Structure

Users sign into the app and are requested to enable notifications on their browsers. If they successfully enable notifications the device token is saved into the datastore under `/users/$uid/notificationTokens`.:

```
/functions-project-12345
    /users
        /Uid-12345
            displayName: "Bob Dole"
            /notificationTokens
                1234567890: true
            photoURL: "https://lh3.googleusercontent.com/..."

```

If a user starts following another user we'll write to `/followers/$followedUid/$followerUid`:

```
/functions-project-12345
    /followers
        /followedUid-12345
            followerUid-67890: true
    /users
        /Uid-12345
            displayName: "Bob Dole"
            /notificationTokens
                1234567890: true
            photoURL: "https://lh3.googleusercontent.com/..."

```


## Trigger rules

The function triggers every time the value of a follow flag changes at `/followers/$followedUid/$followerUid`.


## Deploy and test

This sample comes with a web-based UI for testing the function. To test it out:

 - Create a Firebase Project using the [Firebase Developer Console](https://console.firebase.google.com)
 - Enable **Google Provider** in the [Auth section](https://console.firebase.google.com/project/_/authentication/providers)
 - Import and configure Firebase in `public/index.html` where the `TODO` is located
 - Install the required dependencies by running `npm install` in the `functions` directory
 - Deploy your project using `firebase deploy`
 - Open the app and start following a user, this will send a notification to him.
