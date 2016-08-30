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

var functions = require('firebase-functions');

// Keeps track of the length of the 'likes' child list in a separate attribute.
exports.countlikes = functions.database().path('/posts/$postid/likes').on('value', event => {
  return event.adminRef.parent().child('likes_count').set(event.data.numChildren());
});
