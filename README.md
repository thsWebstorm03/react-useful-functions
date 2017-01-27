# Firebase SDK for Cloud Functions Samples Library

This repository contains a collection of samples showcasing some typical uses of Cloud Functions using the Firebase SDK for CLoud Functions.


## Prerequisites

To learn how to get started with the Firebase SDKL for Cloud Functions try the quickstart samples and have a look at [the documentation](https://firebase.google.com/preview/functions/).


## Use Cases and Samples

This repository contains the following samples:

### [Quickstart: Realtime Database trigger](/quickstarts/uppercase)

This quickstart sample demonstrates using **Cloud Functions** with a **Firebase Realtime Database** trigger. The function will uppercase messages written to the datastore.

### [Quickstart: HTTPS trigger](/quickstarts/time)

This quickstart sample demonstrates using **Cloud Functions** triggered by **HTTPS requests**. The function will return the current server time and allows for date time formatting.

### [Quickstart: Firebase Storage Trigger](/quickstarts/thumbnails)

This quickstart sample demonstrates using **Cloud Functions** triggered by **Firebase Storage events**. The function will generate a thumbnail of uploaded images.

### [Send FCM notifications](fcm-notifications)

This sample demonstrates how to send a Firebase Cloud Messaging (FCM) notification from a Realtime Database triggered Function when users get new followers. The sample also features a Web UI to experience the FCM notification.

### [Authorize with LinkedIn](/linkedin-auth)

Demonstrates how to authorize with a 3rd party sign-in mechanism (LinkedIn in this case), create a Firebase custom auth token, update the user's profile and authorize Firebase.

Uses an HTTP trigger.

### [Authorize with Instagram](/instagram-auth)

Demonstrates how to authorize with a 3rd party sign-in mechanism (Instagram in this case), create a Firebase custom auth token, update the user's profile and authorize Firebase.

Uses an HTTP trigger.

### [Automatically Convert Images](/convert-images)

Demonstrates how to automatically convert images that are uploaded to Firebase Storage to JPEG using ImageMagick.

Uses a Firebase Storage trigger.

### [Automatically Generate Thumbnails](/generate-thumbnail)

Demonstrates how to automatically generate a thumbnail for images that are uploaded to Firebase Storage.

Uses a Firebase Storage trigger.

### [Automatically Moderate Images](/moderate-images)

Demonstrates how to automatically moderate offensive images that are uploaded to Firebase Storage by using the Google Cloud Vision API to detect offensive images and ImageMagick to blur these images.

Uses a Firebase Storage trigger.

### [Extract Image Metadata](/exif-images)

Demonstrates how to automatically extract image's metadata using ImageMagick for images that are uploaded to Firebase Storage.

Uses a Firebase Storage trigger.

### [Text Moderation](/text-moderation)

How to moderate user input text for bad words. For example this can be used to moderate usernames, chat or forum messages.

Uses an Realtime Database trigger.

### [Email Confirmation](/email-confirmation)

Sends email confirmation after users subscribed to a mailing list.

Uses an Realtime Database trigger.

### [LastModified Firebase Database tracking](/lastmodified-tracking)

Tracking when the Firebase Database (or a subset) was last modified.

Uses an Realtime Database trigger.

### [Webhook upon Database writes](/minimal-webhook)

Writing to the Database triggers a request to a callback URL (a Webhook). The content of the modified Data is sent to the Webhook.

Uses an Realtime Database trigger.

### [Firebase Database Child Nodes Count](/child-count)

Keeps track of the number of child nodes of a Firebase Database element allowing clients to filter or order results using the child count.
This can be useful to keep tack of the number of "likes" or "followers" of a somethings shares through social media.

Uses an Realtime Database trigger.

### [Automatic message translation](/message-translation)

Integrates the Google Translate API to perform automatic text translation across any number of languages. Language codes can be stored in Firebase for on the fly changes.

Uses an Realtime Database trigger.

### [Limit number of child nodes](/limit-children)

Make sure to keep the number of child nodes below a certain threshold. For instance this can be useful to limit the number of lines of logs or chat history below a given number.

Uses an Realtime Database trigger.

### [Import Data to Big Query](/bigquery-import)

Copies Firebase Database elements into BigQuery automatically. This can be useful for instance for further logs analysis.

Uses an Realtime Database trigger.

### [Full-text search via Algolia](/fulltext-search)

Enable full-text search on firebase database elements by using an Algolia hosted search service.

Uses an Realtime Database trigger.

### [User Data Cleanup](/user-data-cleanup)

Deletes all associated user data that's on the Realtime database when a user deletes his Firebase account.

Uses an Auth trigger.

### [Welcome Email](/new-user-email)

Sends a Welcome email when a user signs-in for the first time.

Uses an Auth trigger.

### [Delete Inactive Users Accounts Cron](/delete-unused-accounts-cron)

Periodically deletes the accounts of users who have not signed in the last month.

Uses an HTTPS trigger.


## Contributing

We'd love that you contribute to the project. Before doing so please read our [Contributor guide](CONTRIBUTING.md).


## License

© Google, 2015. Licensed under an [Apache-2](LICENSE) license.
