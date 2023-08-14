
import React, { createContext, useContext, useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { DataResultsContext } from '../../contexts/DataResultsContext'
import Login from '../../screens/login';
import renderer from 'react-test-renderer';
import * as funcs from '../../helpers/functions';


describe("Login Component", () => {

    // Mock the AuthContext
    const AuthContext = createContext();

    // Create a custom context provider for testing
    const MockedAuthProvider = ({ children, contextValue }) => {
        return (
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        );
    }

    // Mock the AuthContext
    test('renders Login with mocked AuthContext', () => {
        // the mock context value 
        const mockContextValue = {
            isLoading: true,
            setIsLoading: jest.fn(),
            user: { id: 123, username: 'testuser' },
            setUser: jest.fn(),
            tokens: { accessToken: 'some-token', refreshToken: 'some-refresh-token' },
            setTokens: jest.fn(),
        };

        // Render the component within the mocked AuthContext
        const { getByText } = render(
            <MockedAuthProvider contextValue={mockContextValue}>
                <Login />
            </MockedAuthProvider>
        );

        // Verify that the component renders correctly
        expect(getByText('SIGN IN')).toBeTruthy();

    });


});