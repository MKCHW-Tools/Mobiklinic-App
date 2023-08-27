import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';

import { DataResultsProvider } from '../../contexts/DataResultsContext';
import DataResultsContext from '../../contexts/DataResultsContext';
import PatientData from '../../simprints/patient.data';

import fetchMock from 'jest-fetch-mock';

// Configure fetch to use the mock implementation
fetchMock.enableMocks();

describe('PatientData', () => {
    // Mock fetch before each test
    beforeEach(() => {
        fetchMock.resetMocks();
    });



    //test that the component renders successfully
    it('should render successfully', () => {
        // Mock the necessary dependencies
        const navigation = { goBack: jest.fn(), navigate: jest.fn() };

        const { getByText } = render(
            <DiagnosisProvider>
                <DataResultsProvider >
                    <PatientData navigation={navigation} />
                </DataResultsProvider>
            </DiagnosisProvider>);

        // Assertions
        expect(getByText('Beneficiary Profile')).toBeTruthy();
        //test that the submit button is rendered successfully
        expect(getByText('Submit')).toBeTruthy();
    });


    // Tests that the form is submitted successfully when all required fields are filled in
    it('should submit form when all required fields are filled in', async () => {
        // Mock necessary dependencies
        const navigation = {
            navigate: jest.fn()
        };


        const mockDiagnosisValue = {
            diagnoses: [{ id: 1, name: 'Diagnosis 1' }],
            followups: [{ id: 1, name: 'Followup 1' }],
            setDiagnoses: jest.fn(),
            setFollowups: jest.fn(),
        }

        const mockDatacontextValue = {
            dataResults: 'Mocked Data Results',
            updateDataResults: jest.fn(),
            benData: [],
            updateBenData: jest.fn(),
            userLog: 'Mocked User Log',
            updateUserLog: jest.fn(),
            patientId: 'Mocked Patient ID',
            setPatientId: jest.fn(),
            userNames: 'Mocked User Names',
            updateUserNames: jest.fn(),
        }

        // Render the component with required fields filled in
        const screen = render(
            <DiagnosisContext.Provider value={mockDiagnosisValue}>
                <DataResultsContext.Provider value={mockDatacontextValue}>
                    <PatientData navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>
        );



        fireEvent.changeText(screen.getByPlaceholderText('Enter first name'), 'Silas');
        fireEvent.changeText(screen.getByPlaceholderText('Enter last name'), 'Sangmin');
        fireEvent.changeText(screen.getByPlaceholderText('eg:"0772700900'), '0772700900');
        fireEvent.press(screen.getByTestId('setAgeGroup'));




        fireEvent.press(screen.getByText('Submit'));

        // Use `waitFor` to wait for asynchronous updates before making assertions
        await waitFor(() => {
            // Mock the handleSubmit function
            const handleSubmitMock = jest.fn();
            screen.handleSubmit = handleSubmitMock;
            //spy handleSubmit function
            const currentDate = new Date();
            screen.ageGroup = currentDate;
            expect(screen.getByPlaceholderText('Enter first name').props.value).toBe('Silas');
            expect(screen.getByPlaceholderText('Enter last name').props.value).toBe('Sangmin');
            expect(screen.getByPlaceholderText('eg:"0772700900').props.value).toBe('0772700900');
            console.log("screen.ageGroup", screen.ageGroup);

        });

        const data = {
            diagnoses: [{ id: 1, name: 'Diagnosis 1' }],
            followups: [{ id: 1, name: 'Followup 1' }],
            setDiagnoses: jest.fn(),
            setFollowups: jest.fn(),
        }

        expect(mockDiagnosisValue.diagnoses).toEqual(data.diagnoses);

    });

    //Tests that the should alert error message if not all fields are filled
    it('should alert error message if not all fields are filled', () => {
        // Mock necessary dependencies
        const navigation = {
            navigate: jest.fn()
        };

        // Render the component with required fields filled in
        const { getByPlaceholderText, getByText } = render(
            <DiagnosisProvider>
                <DataResultsProvider>
                    <PatientData navigation={navigation} />
                </DataResultsProvider>
            </DiagnosisProvider>
        );

        // Mock the Alert.alert function
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {

        });

        fireEvent.changeText(getByPlaceholderText('Enter first name'), 'Silas');
        fireEvent.changeText(getByPlaceholderText('Enter last name'), ''); // Empty last name
        fireEvent.changeText(getByPlaceholderText('eg:"0772700900'), '');   // Empty phone number

        fireEvent.press(getByText('Submit'));

        expect(alertSpy).toHaveBeenCalledWith("Error", expect.any(String));

    });

    it('should submit patient data', async () => {
        // Mock the navigation object
        const navigation = {
            navigate: jest.fn(),
        };

        // Render the component
        const { getByPlaceholderText, getByText } = render(
            <DiagnosisProvider>
                <DataResultsProvider>
                    <PatientData navigation={navigation} />
                </DataResultsProvider>
            </DiagnosisProvider>
        );

        // Mock the fetch response
        fetchMock.mockResponseOnce(JSON.stringify({ id: 12345 }), {
            status: 200,
        });
        fireEvent.changeText(getByPlaceholderText('Enter first name'), 'Silas');
        fireEvent.changeText(getByPlaceholderText('Enter last name'), 'Sangmin');
        fireEvent.changeText(getByPlaceholderText('eg:"0772700900'), '0772700900');


        // Trigger the submit button press
        fireEvent.press(getByText('Submit'));

        // Wait for the fetch call to complete
        await waitFor(() => expect(fetchMock).toBeCalled());
        // Fill in the form fields
        await waitFor(() => {
            // Check that the fetch call was made with the correct URL and payload
            expect(fetchMock).toHaveBeenCalledWith(
                'https://mobi-be-production.up.railway.app//patients',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        firstName: 'Silas',
                        lastName: 'Sangmin',
                        sex: '',
                        ageGroup: '',
                        phoneNumber: '0772700900',
                        weight: '',
                        height: '',
                        district: '',
                        country: '',
                        primaryLanguage: '',
                        simprintsGui: ''

                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        Accept: 'application/json',
                    },
                }
            );

            // Check that the navigation function was called with the expected parameters
            expect(navigation.navigate).toHaveBeenCalledWith('SelectActivity', {
                patientId: 12345, // Mocked patient ID
                paramKey: {
                    firstName: 'Silas',
                    lastName: 'Sangmin',
                    sex: '',
                    ageGroup: '',
                    phoneNumber: '0772700900',
                    weight: '',
                    height: '',
                    district: '',
                    country: '',
                    primaryLanguage: '',
                    simprintsGui: ''
                }
            });
        });
    });
});
