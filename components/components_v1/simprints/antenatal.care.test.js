import React, { createContext, useContext, useState } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';
import AntenatalCare from '../../simprints/antenatal.care';
import * as funcs from '../../helpers/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';


describe('AntenatalCare', () => {

    //test that the component renders correctly
    it('should render correctly', () => {
        const navigation = { navigate: jest.fn() };
        const { getByText, getByPlaceholderText, getByTestId, getByAccessibilityHint } = render(
            <DiagnosisProvider>
                <DataResultsProvider >
                    <AntenatalCare navigation={navigation} />
                </DataResultsProvider>
            </DiagnosisProvider>);

        //check that the page renders correctly
        expect(getByText('Antenatal Care')).toBeTruthy();
        expect(getByText('Pregnacy Status:')).toBeTruthy();
        expect(getByText('Date for Check Up:')).toBeTruthy();
        expect(getByText('Prescriptions:')).toBeTruthy();
        expect(getByText('Blood Group:')).toBeTruthy();
        expect(getByText('Current Weight:')).toBeTruthy();
        expect(getByText('Drug Notes*:')).toBeTruthy();
        expect(getByText('Submit')).toBeTruthy();
    });



    // Tests that the form displays error message when not all required fields are filled in'
    it('should display error message when not all required fields are filled in', () => {

        const navigation = { navigate: jest.fn() };
        const setState = jest.fn();
        const fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn() });
        global.fetch = fetch;

        const useStateMock = (init) => [init, setState];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        //spy on alert
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {
            return;
        });

        // get the screen
        const { getByText, getByPlaceholderText, getByTestId } = render(
            <DiagnosisProvider>
                <DataResultsProvider >
                    <AntenatalCare navigation={navigation} />
                </DataResultsProvider>
            </DiagnosisProvider>);

        //set the values of the required fields
        // Pregnancy Status
        const pregnancyStatusInput = getByPlaceholderText('Enter Pregnancy Status e.g \'lower back pain\'');
        fireEvent.changeText(pregnancyStatusInput, 'New Pregnancy Status');

        // Date for Check Up
        //const dateForCheckUpPicker = getByTestId('AdatePicker'); // Replace 'antenatal-date-picker' with the actual test ID
        //fireEvent(dateForCheckUpPicker, 'change', null, new Date('2023-08-10')); // Simulate changing the selected date
        // Define your list of medications
        const medications = [
            'Folic Acid Supplements',
            'Iron Supplements',
            'Calcium Supplements',
            'Antiemeitics',
            'Antihistamines',
        ];


        // Blood Group
        const bloodGroupPicker = getByTestId('blood-group-picker');
        fireEvent(bloodGroupPicker, 'valueChange', ''); // Simulate changing the selected value


        // Current Weight
        const currentWeightInput = getByPlaceholderText('Current Weight (Kgs)');
        fireEvent.changeText(currentWeightInput, '');

        // Drug Notes
        const drugNotesInput = getByPlaceholderText('Add Drug Note');
        fireEvent.changeText(drugNotesInput, '');

        // Next of Kin
        const nextOfKinInput = getByPlaceholderText('Next of Kin');
        fireEvent.changeText(nextOfKinInput, 'Silas');


        // Next of Kin Contact
        const nextOfKinContactInput = getByPlaceholderText('Add Contact');
        fireEvent.changeText(nextOfKinContactInput, '');

        //get submit button
        const submitButton = getByText('Submit');

        // Act
        act(() => {
            fireEvent.press(submitButton);
        });

        expect(alertSpy).toHaveBeenCalledWith('Error', 'Please fill in all required fields' || 'Failed to Register patient.Please try again later.');

    });


    // //Tests that the form is submitted successfully when all required fields are filled in
    // it('should submit successfully when all required fields are filled in', () => {
    //     // Arrange
    //     const navigation = { navigate: jest.fn() };
    //     const setState = jest.fn();
    //     const fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn() });
    //     global.fetch = fetch;

    //     const useStateMock = (init) => [init, setState];
    //     jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    //     //spy on alert
    //     const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {
    //         return;
    //     });

    //     // get the screen
    //     const { getByText, getByPlaceholderText, getByTestId, getByAccessibilityHint } = render(
    //         <DiagnosisProvider>
    //             <DataResultsProvider >
    //                 <AntenatalCare navigation={navigation} />
    //             </DataResultsProvider>
    //         </DiagnosisProvider>);

    //     //set the values of the required fields
    //     // Pregnancy Status
    //     const pregnancyStatusInput = getByPlaceholderText('Enter Pregnancy Status e.g \'lower back pain\'');
    //     fireEvent.changeText(pregnancyStatusInput, 'New Pregnancy Status');

    //     // Date for Check Up
    //     //const dateForCheckUpPicker = getByTestId('AdatePicker'); // Replace 'antenatal-date-picker' with the actual test ID
    //     //fireEvent(dateForCheckUpPicker, 'change', null, new Date('2023-08-10')); // Simulate changing the selected date
    //     // Define your list of medications
    //     const medications = [
    //         'Folic Acid Supplements',
    //         'Iron Supplements',
    //         'Calcium Supplements',
    //         'Antiemeitics',
    //         'Antihistamines',
    //     ];


    //     // Blood Group
    //     const bloodGroupPicker = getByTestId('blood-group-picker');
    //     fireEvent(bloodGroupPicker, 'valueChange', 'A+'); // Simulate changing the selected value


    //     // Current Weight
    //     const currentWeightInput = getByPlaceholderText('Current Weight (Kgs)');
    //     fireEvent.changeText(currentWeightInput, '65');

    //     // Drug Notes
    //     const drugNotesInput = getByPlaceholderText('Add Drug Note');
    //     fireEvent.changeText(drugNotesInput, 'New Drug Note');

    //     // Next of Kin
    //     const nextOfKinInput = getByPlaceholderText('Next of Kin');
    //     fireEvent.changeText(nextOfKinInput, 'Silas Sande');

    //     // Next of Kin Contact
    //     const nextOfKinContactInput = getByPlaceholderText('Add Contact');
    //     fireEvent.changeText(nextOfKinContactInput, '1234567890');

    //     //get submit button
    //     const submitButton = getByText('Submit');

    //     // Act
    //     act(() => {
    //         fireEvent.press(submitButton);
    //     });


    //     expect(navigation.navigate).toHaveBeenCalledWith('Dashboard');
    // });


});
