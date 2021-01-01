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
  main as attachPublicReceive,
  POLICY_NAME,
} from '../attachPublicReceive';
import * as iot from '../../helpers/aws-iot';
import { CustomError } from '../../helpers/test/errors';

describe('attach public receive policy', () => {
  jest.mock('../../helpers/aws-iot', () => ({}));

  const identityId = 'us-west-2:identity-id';
  const event = {
    requestContext: {
      identity: {
        cognitoIdentityId: identityId,
      },
    },
  };
  const context = {};

  describe('when iot call succeeds', () => {
    beforeEach(() => {
      iot.attachPrincipalPolicy = (policyName, principal) => (
        new Promise((resolve) => {
          expect(policyName).toEqual(POLICY_NAME);
          expect(principal).toEqual(identityId);
          resolve();
        })
      );
    });

    it('should should return status true', async () => {
      await attachPublicReceive(
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

  describe('when attaching policy fails', () => {
    beforeEach(() => {
      iot.attachPrincipalPolicy = () => (
        new Promise((resolve, reject) => {
          reject(new CustomError(500));
        })
      );
    });

    it('should return error', async () => {
      await attachPublicReceive(
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
