
import React from 'react';
import { render, fireEvent, waitFor, act, userEvent } from '@testing-library/react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';
import DataResultsContext from '../../contexts/DataResultsContext';
import PatientData from '../../simprints/vaccination';
import { Alert } from 'react-native';
import fetchMock from 'jest-fetch-mock';

describe('PatientData', () => {

    beforeEach(() => {
        fetchMock.resetMocks(); // Reset fetch mocks before each test
    });


    // Tests that the form can be submitted when all required fields are filled
    it('should submit form when all required fields are filled', () => {
        // Arrange
        const navigation = { navigate: jest.fn() };
        const route = {};
        const diagnosisContext = { diagnoses: [] };
        const dataResultsContext = { dataResults: '', userLog: 'userLog', patientId: '', setPatientId: jest.fn() };
        const useStateSpy = jest.spyOn(React, 'useState');
        useStateSpy.mockImplementation((initialValue) => [initialValue, jest.fn()]);
        const fetchSpy = jest.spyOn(global, 'fetch');
        fetchSpy.mockResolvedValueOnce({ ok: true, json: jest.fn() });
        const alertSpy = jest.spyOn(Alert, 'alert');
        const setStateSpy = jest.spyOn(React, 'setState');
        setStateSpy.mockImplementation(jest.fn());

        // render the component
        const screen = render(
            <DiagnosisProvider value={diagnosisContext}>
                <DataResultsProvider value={dataResultsContext}>
                    <PatientData navigation={navigation} route={route} />
                </DataResultsProvider>
            </DiagnosisProvider>
        );

        PatientData({ navigation, route });

        // Assert
        expect(fetchSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('Vaccination Registered Successfully');
        expect(navigation.navigate).toHaveBeenCalledWith('Dashboard');
    });

    // // Tests that an error message is displayed when an invalid vaccine name is selected
    // it('should display error message when invalid vaccine name is selected', () => {
    //     // Arrange
    //     const navigation = { navigate: jest.fn() };
    //     const route = {};
    //     const diagnosisContext = { diagnoses: [] };
    //     const dataResultsContext = { dataResults: [], patientId: '', setPatientId: jest.fn() };
    //     const useStateSpy = jest.spyOn(React, 'useState');
    //     useStateSpy.mockImplementation((initialValue) => [initialValue, jest.fn()]);
    //     const fetchSpy = jest.spyOn(global, 'fetch');
    //     fetchSpy.mockResolvedValueOnce({ ok: true, json: jest.fn() });
    //     const alertSpy = jest.spyOn(Alert, 'alert');
    //     const setStateSpy = jest.spyOn(React, 'setState');
    //     setStateSpy.mockImplementation(jest.fn());

    //     // Act
    //     PatientData({ navigation, route });

    //     // Assert
    //     expect(alertSpy).toHaveBeenCalledWith('Error', 'Please fill in all required fields');
    // });

    // // Tests that an error message is displayed when an invalid dose is selected
    // it('should display error message when invalid dose is selected', () => {
    //     // Arrange
    //     const navigation = { navigate: jest.fn() };
    //     const route = {};
    //     const diagnosisContext = { diagnoses: [] };
    //     const dataResultsContext = { dataResults: [], patientId: '', setPatientId: jest.fn() };
    //     const useStateSpy = jest.spyOn(React, 'useState');
    //     useStateSpy.mockImplementation((initialValue) => [initialValue, jest.fn()]);
    //     const fetchSpy = jest.spyOn(global, 'fetch');
    //     fetchSpy.mockResolvedValueOnce({ ok: true, json: jest.fn() });
    //     const alertSpy = jest.spyOn(Alert, 'alert');
    //     const setStateSpy = jest.spyOn(React, 'setState');
    //     setStateSpy.mockImplementation(jest.fn());

    //     // Act
    //     PatientData({ navigation, route });

    //     // Assert
    //     expect(alertSpy).toHaveBeenCalledWith('Error', 'Please fill in all required fields');
    // });
});
