/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// [START all]
// [START import]
const functions = require('firebase-functions');
// [END import]

// [START addMessage]
// Take the text parameter passed to this HTTP end-point and insert it into the
// Realtime Database under the path /messages/:pushId/original
// [START addMessageTrigger]
exports.addMessage = functions.https().onRequest((request, response) => {
// [END addMessageTrigger]
  // Grab the text parameter.
  const original = request.query.text;
  // Push it into the Realtime Database then send a response
  functions.app.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    response.redirect(303, snapshot.ref);
  });
});
// [END addMessage]

// [START makeUppercase]
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercased version of the message to to /messages/:pushId/uppercased
// [START makeUppercaseTrigger]
exports.makeUppercase = functions.database().path('/messages/{pushId}/original')
    .onWrite(event => {
// [END makeUppercaseTrigger]
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log('Uppercasing', event.params.pushId, original);
      const uppercased = original.toUpperCase();
      // Asynchronous Firebase Functions such as database listeners expect the callback
      // function to return either a Promise, Object or null.
      // Setting an "uppercased" sibling in the Realtime Database returns a Promise.
      return event.data.ref.parent.child('uppercased').set(uppercased);
    });
// [END makeUppercase]
// [END all]
