
import * as React from 'react';
import {  UserProvider } from '../../../Mobiklinic-App/components/providers/User';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
// Configure Enzyme with the React 16 adapter

configure({ adapter: new Adapter() });

describe('UserProvider', () => {
    // Tests that UserContext.Provider is rendered with correct props
    it('should render UserContext.Provider with correct props', () => {
        const wrapper = shallow(
            <UserProvider>
                <div>Test</div>
            </UserProvider>
        );
        // ... your assertions ...
    });
});
