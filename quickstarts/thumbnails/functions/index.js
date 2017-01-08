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
 * See the License for t`he specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// [START import]
const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const exec = require('child-process-promise').exec;
// [END import]

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
// [START generateThumbnailTrigger]
exports.generateThumbnail = functions.storage().onChange(event => {
// [END generateThumbnailTrigger]
  // [START eventAttributes]
  const fileBucket = event.bucket; // The Storage Bucket that contains the file.
  const filePath = event.path; // File path in the bucket.
  const contentType = event.contentType; // File Content Type.
  const resourceState = event.resourceState; // The resourceState is 'exists' or 'not_exits' (for file/folder deletions).
  const lastUpdated = event.updated; // Timestamp of the last file update.
  const fileSize = event.size; // Size of the file in Bytes.
  const md5Hash = event.md5Hash; // MD5 Hash of the file.
  const crc32c = event.crc32c; // CRC32C Hash of the file.
  // [END eventAttributes]

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Get the file name.
  const fileName = filePath.split('/').pop();
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.');
    return null;
  }

  // Exit if this is a move or deletion event.
  if (resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return null;
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);
  const tempLocalFilePath = `/tmp/${fileName}`;
  return bucket.file(filePath).download({
    destination: tempLocalFilePath
  }).then(() => {
    console.log('Image downloaded locally to', tempLocalFilePath);
    // Generate a thumbnail using ImageMagick.
    return exec(`convert "${tempLocalFilePath}" -thumbnail '200x200>' "${tempLocalFilePath}"`).then(() => {
      console.log('Thumbnail created at', tempLocalFilePath);
      // We add a 'thumb_' prefix to thumbnails. That's where we'll upload the thumbnail.
      const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, `$1thumb_$2`);
      // Uploading the Thumbnail.
      return bucket.upload(tempLocalFilePath, {
        destination: thumbFilePath
      });
    });
  });
  // [END thumbnailGeneration]
});
// [END generateThumbnail]
