/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const wipeout = require('./wipeout');

/**
* Deletes data in the Realtime Datastore when the accounts are deleted.
* Log into RTDB after successful deletion.
*
* @parm {functions.CloudFunction} event User delete event.
*/
exports.cleanupUserData = functions.auth.user().onDelete(event => {
  try {
    return wipeout.deleteUser(event.data).then(() => {
      return wipeout.writeLog(event.data);
    });
  } catch (err) {
    console.err('Failed to delete user data.' + err);
  }
});

