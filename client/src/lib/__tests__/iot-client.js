/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as DeviceSdk from 'aws-iot-device-sdk';
import * as log from 'loglevel';

import IoTClient from '../iot-client';

describe('IoTClient', () => {
  DeviceSdk.default = jest.fn();
  const oldLogLevel = log.getLevel();

  beforeAll(() => {
    log.setLevel('silent');
  });

  afterAll(() => {
    log.setLevel(oldLogLevel);
  });

  describe('constructor', () => {
    it('creates new instance if instance did not exist before', () => {
      const client = new IoTClient(false, { debug: false });
      expect(client).toHaveProperty('client');
    });

    it('does not create new instance if instance already exists', () => {
      const client = new IoTClient(false, { debug: false });
      const client2 = new IoTClient(false, { debug: false });
      expect(client).toBe(client2);
    });

    it('creates a new instance if createNewClient is set to true', () => {
      const client = new IoTClient(false, { debug: false });
      const client2 = new IoTClient(true, { debug: false });
      expect(client).not.toBe(client2);
    });
  });
});
