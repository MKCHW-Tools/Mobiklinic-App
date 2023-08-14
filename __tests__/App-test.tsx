/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  //jest.mock('react-native-fs');
  renderer.create(<App />);
});

function addTo2(num: number) {
  return num + 2;
}

// Tests that passing a number returns number + 2
test("should return num plus 2", () => {
  expect(addTo2(3)).toBe(5)
  expect(addTo2(100000)).toEqual(100002)
  expect(addTo2(0)).toBe(2)
});

