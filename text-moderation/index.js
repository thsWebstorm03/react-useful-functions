/**
 * Copyright 2015 Google Inc. All Rights Reserved.
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

var Firebase = require('firebase');
var env = require('./env');
var ref = new Firebase(env.get('firebase.database.url'));
var stringUtils = require('./moderation-string-utils.js');
stringUtils.loadModerationStringUtils();

// Moderates messages by lowering all uppercase messages and removing swearwords.
exports.moderator = function(context, data) {

  // Authorize to the Firebase Database with admin rights.
  ref.authWithCustomToken(env.get('firebase.database.secret'), function(error) {
    if (error) {
      context.done(error);
    } else {
      console.log("Authorized successfully with admin rights");

      // Read the Firebase DB entry that triggered the function.
      console.log('Loading firebase path: ' + env.get('firebase.database.url') + data.path);
      var messageFirebaseDbRef = ref.child(data.path);
      messageFirebaseDbRef.once('value', function(messageData) {

        // Retrieved the message values.
        console.log('Retrieved message content: ' + JSON.stringify(messageData.val()));
        var messageEntryData = messageData.val();

        // Run moderation checks on on the message and moderate if needed.
        var moderatedMessage = moderateMessage(messageEntryData.text, context, messageFirebaseDbRef);

        // If message has just been moderated we update the Firebase DB.
        if (messageEntryData.text != moderatedMessage) {
          console.log('Message has been moderated. Saving to DB: ' + moderatedMessage);
          messageFirebaseDbRef.update({text: moderatedMessage, sanitized: true},
            context.done);
        } else {
          console.log('Marking message as sanitized. Saving to DB: ' + moderatedMessage);
          messageFirebaseDbRef.update({sanitized: true}, context.done);
        }

      // If reading the Firebase DB failed.
      }, context.done);
    }
  });
};

// Moderates the given message if needed.
function moderateMessage(message) {

  // Moderate if the user is Yelling.
  if (message.isYelling()) {
    console.log('User is yelling. moderating...');
    message = message.capitalizeSentence();
  }

  // Moderate if the user uses SwearWords.
  if (message.containsSwearwords()) {
    console.log('User is swearing. moderating...');
    message = message.moderateSwearwords();
  }

  return message;
}
