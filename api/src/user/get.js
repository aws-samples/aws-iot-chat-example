/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as dynamodb from '../helpers/dynamodb';
import { success, failure, notFound } from '../helpers/response';

export const USER_NOT_FOUND = 'User not found.';

/**
 * Query user by their CognitoId
 */
export const main = async (event, context, callback) => {
  const { pathParameters } = event;
  const params = {
    TableName: 'IotChatUsers',
    Key: {
      identityId: decodeURIComponent(pathParameters.identityId),
    },
  };

  try {
    const result = await dynamodb.call('get', params);
    if (result.Item) {
      callback(null, success(result.Item));
    } else {
      callback(null, notFound({ status: false, error: USER_NOT_FOUND }));
    }
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
