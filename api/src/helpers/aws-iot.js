/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import { IoTClient, AttachPolicyCommand, CreatePolicyCommand } from '@aws-sdk/client-iot';

const iotClient = new IoTClient({ region: process.env.AWS_REGION });

export const attachPrincipalPolicy = (policyName, target) => {
  return iotClient.send(new AttachPolicyCommand({ policyName, target }));
};

export const createPolicy = (policyDocument, policyName) => {
  return iotClient.send(new CreatePolicyCommand({ policyDocument, policyName }));
};
