import React, { createContext, useContext, useState } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { AuthProvider } from '../../contexts/auth';
import { DataResultsContext, DataResultsProvider } from '../../contexts/DataResultsContext';
import Login from '../../screens/login';
import * as funcs from '../../helpers/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MockAuthContextProvider = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
);

const MockDataResultsContextProvider = ({ children }) => (
    <DataResultsProvider value={{}}>{children}</DataResultsProvider>
);

// the mock context value 
const mockContextValue = {
    isLoading: true,
    setIsLoading: jest.fn(),
    user: { id: 123, username: 'testuser' },
    setUser: jest.fn(),
    tokens: { accessToken: 'some-token', refreshToken: 'some-refresh-token' },
    setTokens: jest.fn(),
};


// Mock the network request response
global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                message: 'Login successful',
                id: mockContextValue.user.id,
                accessToken: mockContextValue.tokens.accessToken,
                refreshToken: mockContextValue.tokens.refreshToken,
                firstName: 'testuser',
                lastName: 'testuser',
            }),
    })
);

describe('Login Component', () => {
    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(
            <MockAuthContextProvider>
                <MockDataResultsContextProvider>
                    <Login />
                </MockDataResultsContextProvider>
            </MockAuthContextProvider>

        );

        //Check that Sign Button is rendered
        expect(getByText('SIGN IN')).toBeTruthy();

    });


    // //test login with valid credentials
    // it('should login with valid credentials', async () => {

    //     // Mock navigation object
    //     const navigation = {
    //         navigate: jest.fn()
    //     };


    //     const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    //         buttons[0].onPress();
    //     });

    //     const { getByText, getByPlaceholderText } = render(
    //         <MockAuthContextProvider value={mockContextValue} >
    //             <MockDataResultsContextProvider>
    //                 <Login navigation={navigation} />
    //             </MockDataResultsContextProvider>
    //         </MockAuthContextProvider>

    //     );

    //     //get sign in button
    //     const signInButton = getByText('SIGN IN');
    //     const mockAlert = jest.spyOn(Alert, 'alert');



    //     // press signin button
    //     act(() => {
    //         fireEvent.press(signInButton);
    //     });

    //     expect(navigation.navigate).toHaveBeenCalled();


    // });

    //test navigation to signup screen
    it('should navigate to signup screen', async () => {

        // Mock navigation object
        const navigation = {
            navigate: jest.fn()
        };
        const { getByText, getByPlaceholderText } = render(
            <MockAuthContextProvider value={mockContextValue}>
                <MockDataResultsContextProvider>
                    <Login navigation={navigation} />
                </MockDataResultsContextProvider>
            </MockAuthContextProvider>
        );
        //get signup screen button
        const signUpButton = getByText(`Don't have an Account? Sign up`);
        // press signup button
        act(() => {
            fireEvent.press(signUpButton);
        });
        expect(navigation.navigate).toHaveBeenCalledWith('signUp');

    });


});
