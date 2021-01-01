/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import {
  main as attachPublicPublish,
  generatePolicyDocumentTemplate,
} from '../attachPublicPublish';
import * as iot from '../../helpers/aws-iot';
import { CustomError } from '../../helpers/test/errors';

describe('attach public publish policy', () => {
  jest.mock('../../helpers/aws-iot', () => ({
    call: jest.fn(),
  }));

  const identityId = 'us-west-2:identity-id';
  const event = {
    requestContext: {
      identity: {
        cognitoIdentityId: identityId,
      },
    },
  };
  const accountArn = '123456789';
  const context = {
    invokedFunctionArn: 'arn:aws:lambda:us-west-2:123456789:function:chat-app-api-prod-AttachPublicPublishPolicy',
  };

  describe('when iot calls succeed', () => {
    beforeEach(() => {
      const expectedPolicyName = 'IotChatPublicPublishPolicy.us-west-2-identity-id';
      iot.createPolicy = (policyDocument, policyName) => (
        new Promise((resolve) => {
          const expectedPolicyDocument = generatePolicyDocumentTemplate(identityId, accountArn);
          expect(policyDocument).toEqual(JSON.stringify(expectedPolicyDocument));
          expect(policyName).toEqual(expectedPolicyName);
          resolve();
        })
      );

      iot.attachPrincipalPolicy = (policyName, principal) => (
        new Promise((resolve) => {
          expect(policyName).toEqual(expectedPolicyName);
          expect(principal).toEqual(identityId);
          resolve();
        })
      );
    });

    it('should should return status true', async () => {
      await attachPublicPublish(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body).toEqual({ status: true });
          expect(result.statusCode).toEqual(200);
        },
      );
    });
  });

  describe('when policy is already attached', () => {
    beforeEach(() => {
      iot.createPolicy = () => (
        new Promise((resolve, reject) => {
          reject(new CustomError(409));
        })
      );
    });

    it('should return status true if policy is already attached', async () => {
      await attachPublicPublish(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body).toEqual({ status: true });
          expect(result.statusCode).toEqual(200);
        },
      );
    });
  });

  describe('when attaching policy fails and not a 409', () => {
    beforeEach(() => {
      iot.createPolicy = () => (
        new Promise((resolve, reject) => {
          reject(new CustomError(500));
        })
      );
    });

    it('should return error', async () => {
      await attachPublicPublish(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body.status).toEqual(false);
          expect(result.statusCode).toEqual(500);
        },
      );
    });
  });
});
