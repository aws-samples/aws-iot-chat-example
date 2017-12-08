/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import reducer, { initialState } from '../iotReducer';
import * as types from '../../actions/types';

describe('iot reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle CONNECT_POLICY_ATTACHED', () => {
    expect(
      reducer(
        { connectPolicy: false },
        { type: types.CONNECT_POLICY_ATTACHED },
      ),
    ).toEqual(
      { connectPolicy: true },
    );
  });

  it('should handle PUBLIC_PUBLISH_POLICY_ATTACHED', () => {
    expect(
      reducer(
        { publicPublishPolicy: false },
        { type: types.PUBLIC_PUBLISH_POLICY_ATTACHED },
      ),
    ).toEqual(
      { publicPublishPolicy: true },
    );
  });

  it('should handle PUBLIC_SUBSCRIBE_POLICY_ATTACHED', () => {
    expect(
      reducer(
        { publicSubscribePolicy: false },
        { type: types.PUBLIC_SUBSCRIBE_POLICY_ATTACHED },
      ),
    ).toEqual(
      { publicSubscribePolicy: true },
    );
  });

  it('should handle PUBLIC_RECEIVE_POLICY_ATTACHED', () => {
    expect(
      reducer(
        { publicReceivePolicy: false },
        { type: types.PUBLIC_RECEIVE_POLICY_ATTACHED },
      ),
    ).toEqual(
      { publicReceivePolicy: true },
    );
  });

  it('should handle DEVICE_CONNECTED_STATUS_CHANGED', () => {
    expect(
      reducer(
        { deviceConnected: false },
        { type: types.DEVICE_CONNECTED_STATUS_CHANGED, deviceConnected: true },
      ),
    ).toEqual(
      { deviceConnected: true },
    );
  });

  it('should handle MESSAGE_HANDLER_ATTACHED', () => {
    expect(
      reducer(
        { messageHandlerAttached: false },
        { type: types.MESSAGE_HANDLER_ATTACHED, attached: true },
      ),
    ).toEqual(
      { messageHandlerAttached: true },
    );
  });

  describe('when device is connected', () => {
    it('should handle LOGOUT and without modifying deviceConnected state', () => {
      expect(
        reducer(
          { deviceConnected: true, connectPolicy: true, messageHandlerAttached: false },
          { type: types.LOGOUT },
        ),
      ).toEqual(
        { ...initialState, deviceConnected: true, messageHandlerAttached: false },
      );
    });
  });

  describe('when message handler has been attached', () => {
    it('should handle LOGOUT and without modifying messageHandlerAttached state', () => {
      expect(
        reducer(
          { messageHandlerAttached: true, connectPolicy: true, deviceConnected: false },
          { type: types.LOGOUT },
        ),
      ).toEqual(
        { ...initialState, messageHandlerAttached: true, deviceConnected: false },
      );
    });
  });
});
