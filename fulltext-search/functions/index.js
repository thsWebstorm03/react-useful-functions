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

const functions = require('firebase-functions');

// Authenticate to Algolia Database.
// TODO: Make sure you add your Algolia Key and Secret into the env.json file.
const algoliasearch = require('algoliasearch');
const client = algoliasearch(functions.env.get('algolia.key'), functions.env.get('algolia.secret'));
const index = client.initIndex('users');

// Updates the search index when new blog entries are created or updated.
exports.indexentry = functions.database().path('/blog-posts/$blogid').on('value', event => {
  const firebaseObject = event.data.val();
  firebaseObject.objectID = event.data.key;

  return index.saveObject(firebaseObject).then(
      () => functions.app.database().ref(Firebase.ServerValue.TIMESTAMP));
});

// Starts a search query whenever a query is requested (by adding one to the `/search/queries`
// element. Search results are then written under `/search/results`.
exports.searchentry = functions.database().path('/search/queries/$queryid').on('value', event => {
  const query = event.data.val().query;
  const key = event.data.key;

  return index.search(query).then(content => {
    const updates = {
      '/last_query': Firebase.ServerValue.TIMESTAMP
    };
    updates[`/search/results/${key}`] = content;
    return functions.app.database().ref().update(updates);
  });
});
