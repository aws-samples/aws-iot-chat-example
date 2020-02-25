/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as iot from '../helpers/aws-iot';
import { success, failure } from '../helpers/response';

export const POLICY_NAME = 'IotChatPublicReceivePolicy';

/**
 * Attach a policy to the Cognito Identity to allow it to receive messages from all public rooms
 */
export const main = async (event, context, callback) => {
  const principal = event.requestContext.identity.cognitoIdentityId;

  try {
    await iot.attachPrincipalPolicy(POLICY_NAME, principal);
    callback(null, success({ status: true }));
  } catch (e) {
      console.log(e);
      callback(null, failure({ status: false, error: e }));
  }
};
