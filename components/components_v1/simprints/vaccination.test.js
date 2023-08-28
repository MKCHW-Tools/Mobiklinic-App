
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { DiagnosisContext } from '../../providers/Diagnosis';
import DataResultsContext from '../../contexts/DataResultsContext';
import PatientData from '../../simprints/vaccination';
import { Alert } from 'react-native';
import fetchMock from 'jest-fetch-mock';


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

describe(' Vaccination - PatientData', () => {

    beforeEach(() => {
        fetchMock.resetMocks(); // Reset fetch mocks before each test
    });



    //Test that component renders correctly
    it('should render correctly', () => {
        // Arrange
        const navigation = { navigate: jest.fn() };
        const route = {};
        const diagnosisContext = { diagnoses: [] };
        const dataResultsContext = { dataResults: '', userLog: 'userLog', patientId: '', setPatientId: jest.fn() };
        const fetchSpy = jest.spyOn(global, 'fetch');
        fetchSpy.mockResolvedValueOnce({ ok: true, json: jest.fn() });
        const alertSpy = jest.spyOn(Alert, 'alert');

        // Act
        const screen = render(
            <DiagnosisContext.Provider value={diagnosisContext}>
                <DataResultsContext.Provider value={dataResultsContext}>
                    <PatientData navigation={navigation} route={route} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>
        );

        // Assert
        expect(screen).toMatchSnapshot();

        //test some elements are rendered
        expect(screen.getByText(' VACCINATION DATA')).toBeTruthy();
        expect(screen.getByText('Submit')).toBeTruthy();
        expect(screen.getByText('Vaccine Name:')).toBeTruthy();
        expect(screen.getByText(' Card number:')).toBeTruthy();
        expect(screen.getByText('Dose:')).toBeTruthy();
        expect(screen.getByText(' Date for Vaccination:')).toBeTruthy();
        expect(screen.getByText('Site Administered:')).toBeTruthy();
        expect(screen.getByText('Facility:')).toBeTruthy();
        expect(screen.getByText('Date for Next Dose:')).toBeTruthy();


    });

    it('handles date picker correctly', () => {
        const route = {};
        const navigation = { navigate: jest.fn(), goBack: jest.fn() };

        const { getByText, getByTestId, queryByTestId, queryByText } = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '', setPatientId: jest.fn() }}>
                    < PatientData navigation={navigation} route={route} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Initially, date picker should not be visible
        expect(queryByTestId('dateOfVaccination')).toBeFalsy();

        // Simulate a button click to show the date picker
        fireEvent.press(getByTestId('showVaccDatePicker'));

        // Now, date picker should be visible
        expect(queryByTestId('dateOfVaccination')).toBeTruthy();

    });


    // Tests that the form can be submitted when all required fields are filled
    it('should submit form when all required fields are filled', () => {
        // Arrange
        const navigation = { navigate: jest.fn() };
        const route = {};
        const diagnosisContext = { diagnoses: [] };
        const dataResultsContext = { dataResults: '', userLog: 'userLog', patientId: '13', setPatientId: jest.fn() };

        // render the component
        const { getByText, getByTestId } = render(
            <DiagnosisContext.Provider value={diagnosisContext}>
                <DataResultsContext.Provider value={dataResultsContext}>
                    <PatientData navigation={navigation} route={route} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>
        );

        // Mock alert
        // Mock the Alert.alert function
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {

        });


        /**
        *Required Fields
        *  vaccineName
        *  dose
        *  dateOfVaccination
        *  siteAdministered
        */

        //fill in the form
        // Simulate a button click to show the date picker
        fireEvent.press(getByTestId('showVaccDatePicker'));
        const vaccineName = getByTestId('vaccineName');
        const dose = getByTestId('dose');
        const dateOfVaccination = getByTestId('dateOfVaccination');
        const siteAdministered = getByTestId('siteAdministered');
        const submitButton = getByText('Submit');


        // Simulate selecting a value
        fireEvent(vaccineName, 'onValueChange', "pfizer");
        fireEvent(dose, 'onValueChange', "1st");
        fireEvent(siteAdministered, 'onValueChange', "Left Arm");


        // Select a date from the date picker
        // Generate new date
        let date = new Date()

        // Fire the onChange Event
        fireEvent(
            getByTestId('dateOfVaccination'),
            'onChange',
            ...createDateTimeSetEvtParams(date),
        );

        // Mock a successful response from the server
        fetchMock.mockResponseOnce(JSON.stringify({ id: 1 }), { status: 200 });

        // Act
        fireEvent.press(submitButton);

        // Assert
        // Verify that the fetch request was made with the expected data
        expect(fetchMock).toHaveBeenCalledWith(
            `https://mobi-be-production.up.railway.app/${dataResultsContext.patientId}/vaccinations`,
            {
                method: 'POST',
                body: JSON.stringify({
                    vaccineName: 'pfizer',
                    dose: '1st',
                    units: '',
                    dateOfVaccination: createDateTimeSetEvtParams(date)[1],
                    dateForNextDose: '',
                    siteAdministered: 'Left Arm',
                    facility: '',
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Accept: 'application/json',
                },
            }
        );
    });

    // Tests that an error message is displayed when an invalid vaccine name is selected
    it('should display error message when not all required fields are filled', () => {
        const navigation = { navigate: jest.fn() };
        const route = {};
        const diagnosisContext = { diagnoses: [] };
        const dataResultsContext = { dataResults: '', userLog: 'userLog', patientId: '13', setPatientId: jest.fn() };

        // render the component
        const { getByText, getByTestId } = render(
            <DiagnosisContext.Provider value={diagnosisContext}>
                <DataResultsContext.Provider value={dataResultsContext}>
                    <PatientData navigation={navigation} route={route} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>
        );

        // Mock alert
        // Mock the Alert.alert function
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {

        });


        /**
         *Required Fields
         *  vaccineName
         *  dose
         *  dateOfVaccination
         *  siteAdministered
         */

        //fill in the form
        const vaccineName = getByTestId('vaccineName');
        const dose = getByTestId('dose');
        const siteAdministered = getByTestId('siteAdministered');
        const submitButton = getByText('Submit');


        // Simulate selecting a value
        fireEvent(vaccineName, 'onValueChange', "");
        fireEvent(dose, 'onValueChange', "");
        fireEvent(siteAdministered, 'onValueChange', "Left Arm");

        // Act
        fireEvent.press(submitButton);

        // Assert
        // Verify that the fetch request was made with the expected data
        expect(fetchMock).not.toHaveBeenCalledWith(
            `https://mobi-be-production.up.railway.app/${dataResultsContext.patientId}/vaccinations`,
            {
                method: 'POST',
                body: JSON.stringify({
                    vaccineName: 'pfizer',
                    dose: '1st',
                    units: '',
                    dateOfVaccination: '',
                    dateForNextDose: '',
                    siteAdministered: 'Left Arm',
                    facility: '',
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Accept: 'application/json',
                },
            }
        );

        // Assert
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Please fill in all required fields');
    });


});
