
import React from 'react';
import { render, fireEvent, waitFor, act, userEvent } from '@testing-library/react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';
import DataResultsContext from '../../contexts/DataResultsContext';
import PatientMedical from '../../simprints/patient.medical';
import { Alert } from 'react-native';
import fetchMock from 'jest-fetch-mock'; // Import jest-fetch-mock



// Configure fetch to use the mock implementation
fetchMock.enableMocks();


// Utility function to prepare the date to be accepted by DatePicker's onChange method

const createDateTimeSetEvtParams = (date,) => {
    return [
        {
            type: 'set',
            nativeEvent: {
                timestamp: date.getTime(),
            },
        },
        date,
    ];
};

describe('PatientMedical Component', () => {

    beforeEach(() => {
        fetchMock.resetMocks(); // Reset fetch mocks before each test
    });

    const navigation = {
        navigate: jest.fn(),
        goBack: jest.fn()
    };

    it('renders correctly', () => {

        const { getByText, getByPlaceholderText } = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '', setPatientId: jest.fn() }}>
                    <PatientMedical navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Check if important text and placeholders are present
        expect(getByText('MEDICAL DIAGNOSIS')).toBeTruthy();
        expect(getByPlaceholderText('signs and symptoms e.g "Headache, Fever, Cough"')).toBeTruthy();
        expect(getByText('Submit')).toBeTruthy();
        expect(getByText('Date for Diagnosis:')).toBeTruthy();

    });

    it('handles date picker correctly', () => {
        const { getByText, getByTestId, queryByTestId, queryByText } = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '', setPatientId: jest.fn() }}>
                    <PatientMedical navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Initially, date picker should not be visible
        expect(queryByTestId('dateOfDiagnosis')).toBeFalsy();

        // Simulate a button click to show the date picker
        fireEvent.press(getByTestId('clickToOpenDatePicker'));

        // Now, date picker should be visible
        expect(queryByTestId('dateOfDiagnosis')).toBeTruthy();

    });

    it('submits form correctly', async () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '12', setPatientId: jest.fn() }}>
                    <PatientMedical navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Fill in the form fields
        // Simulate a button click to show the date picker
        fireEvent.press(getByTestId('clickToOpenDatePicker'));
        // act(() => {
        fireEvent.changeText(getByPlaceholderText('signs and symptoms e.g "Headache, Fever, Cough"'), 'Test symptoms');
        fireEvent.changeText(getByPlaceholderText('e.g "Malaria"'), 'Test condition');

        // Select a date from the date picker
        // Generate new date
        let date = new Date()

        // Fire the onChange Event
        fireEvent(
            getByTestId('dateOfDiagnosis'),
            'onChange',
            ...createDateTimeSetEvtParams(date),
        );
        // fireEvent.changeText(getByTestId('dateOfDiagnosis'), { target: { value: '2020-05-24' } });
        // });

        // Mock a successful response from the server
        fetchMock.mockResponseOnce(JSON.stringify({ id: 1 }), { status: 200 });

        // Submit the form
        // waitFor(() => {
        fireEvent.press(getByText('Submit'));
        // });



        expect(fetchMock).toHaveBeenCalled();


        // Verify that the fetch request was made with the expected data
        expect(fetchMock).toHaveBeenCalledWith(
            'https://mobi-be-production.up.railway.app/12/diagnosis',
            {
                method: 'POST',
                body: JSON.stringify({
                    condition: 'Test condition',
                    dateOfDiagnosis: createDateTimeSetEvtParams(date)[1],
                    impression: 'Test symptoms',
                    drugsPrescribed: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    followUpDate: "",
                    isPregnant: false,
                    labTests: "",
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Accept: 'application/json',
                },
            }
        );

    });

    //test that error message is displayed when the form is submitted with empty fields
    it('displays error message when form is submitted with empty fields', async () => {

        const { getByText, getByPlaceholderText, getByTestId } = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '12', setPatientId: jest.fn() }}>
                    <PatientMedical navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Mock alert
        // Mock the Alert.alert function
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {

        });

        fireEvent.changeText(getByPlaceholderText('signs and symptoms e.g "Headache, Fever, Cough"'), '');
        fireEvent.changeText(getByPlaceholderText('e.g "Malaria"'), '');



        // Mock a successful response from the server
        //fetchMock.mockResponseOnce(JSON.stringify({ id: 1 }), { status: 200 });

        // Submit the form

        fireEvent.press(getByText('Submit'));

        // display error message
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Please fill in all required fields');

    });

});
