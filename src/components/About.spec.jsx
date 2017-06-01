// Passing arrow functions (lambdas) to Mocha is discouraged
// https://mochajs.org/#arrow-functions
// eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always']
// global describe, it, beforeEach, before

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import About from './About';

describe('About', () => {

 it('should render without crashing', function() {
   shallow(<About />);
 });

 it('should have a main as container', function() {
   const wrapper = shallow(<About />);
   assert.strictEqual(wrapper.type(), 'main');
 });

 it('should have an h2 tag containing the text "About"', function() {
   const wrapper = shallow(<About />);
   const title = wrapper.find('h2');
   assert.strictEqual(title.contains(<h2>About</h2>), true);
 });
});
