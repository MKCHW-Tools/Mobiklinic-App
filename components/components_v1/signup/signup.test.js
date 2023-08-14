
import 'react-native';
import React from 'react';
import { Alert } from 'react-native';
import SignUp from "../../screens/signup";
import { render, fireEvent } from '@testing-library/react-native';
import * as funcs from '../../helpers/functions';

import renderer from 'react-test-renderer';


describe("Testing Sign Up Component", () => {
    //Tests that the component renders correctly
    it('renders same screen', () => {
        const tree = renderer.create(
            <SignUp />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('renders field lables and placeholders', () => {
        const { getByText, getByPlaceholderText } = render(<SignUp />);

        // Verify the existence of UI elements like labels, placeholders, and buttons
        expect(getByText('Sign Up')).toBeTruthy();
        expect(getByPlaceholderText('Enter First name')).toBeTruthy();
        expect(getByPlaceholderText('Enter Last name')).toBeTruthy();

    });


    // Tests that the user is registered when valid data is submitted during sign up
    it('should register user when valid data is submitted', async () => {
        const data = {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '256754123456',
            password: 'password',
            cPassword: 'password',
            eMail: 'johndoe@example.com',
            setIsLoading: jest.fn(),
            setProcess: jest.fn(),
            setRegistered: jest.fn()
        };

        //const signUpMock = jest.spyOn(funcs, 'signUp').mockImplementation(() => Promise.resolve());
        const signUpMock = jest.spyOn(funcs, 'signUp');

        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
            buttons[0].onPress();
        });

        const { getByText, getByPlaceholderText } = render(<SignUp />);
        const signUpButton = getByText('Sign Up');
        fireEvent.press(signUpButton);
        expect(signUpMock).toBeCalled();
        //expect(alertSpy).toBeCalled();
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Please fill in the required fields correctly !', [
            {
                text: 'OK',
                onPress: expect.any(Function)
            }
        ]); //should alert error because default fields are empty
    });

});

