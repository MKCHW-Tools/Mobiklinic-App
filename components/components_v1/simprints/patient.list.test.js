jest.mock('axios');

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';
import DataResultsContext from '../../contexts/DataResultsContext';
import PatientLists from '../../simprints/patient.lists';
import axios from 'axios';


describe('PatientLists', () => {
    // Tests that the component renders without crashing
    it('should render without crashing', () => {
        // Mock the necessary dependencies
        const navigation = {
            goBack: jest.fn()
        };

        // Render the component
        const screen = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: '', patientId: '', setPatientId: jest.fn() }}>
                    <PatientLists navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Assert that the component renders without throwing an error
        expect(screen.queryByText('Back')).toBeTruthy();
    });

    // Tests that the component displays a list of users fetched from the API
    it('should display a list of users', async () => {
        // Mock the necessary dependencies
        const navigation = {
            goBack: jest.fn()
        };

        // Mock the API response
        const mockUsers = [
            { id: 1, firstName: 'John', lastName: 'Paul' },
            { id: 2, firstName: 'Esther', lastName: 'Mart' }
        ];
        const mockAxiosSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 200, data: mockUsers });

        const screen = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '', setPatientId: jest.fn() }}>
                    <PatientLists navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Wait for the API call to resolve
        await waitFor(() => expect(mockAxiosSpy).toBeCalled());
        // Assert that the list of users is displayed
        expect(screen.queryByText('John Paul')).toBeTruthy();
        expect(screen.queryByText('Esther Mart')).toBeTruthy();
    });

    // test that the axios get is called with the correct url, `https://mobi-be-production.up.railway.app/${userLog}/patients`
    it('should call axios get with the correct url', async () => {
        // Mock the necessary dependencies
        const navigation = {
            goBack: jest.fn()
        };

        // Mock the API response
        const mockUsers = [
            { id: 1, firstName: 'John', lastName: 'Paul' },
            { id: 2, firstName: 'Esther', lastName: 'Mart' }
        ];
        const mockAxiosSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 200, data: mockUsers });

        // Render the component
        const screen = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '', setPatientId: jest.fn() }}>
                    <PatientLists navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        // Wait for the API call to resolve
        await waitFor(() => expect(mockAxiosSpy).toBeCalled());

        //assert that the axios get is called with the correct url
        expect(mockAxiosSpy).toHaveBeenCalledWith(`https://mobi-be-production.up.railway.app/userLog/patients`);
    });
});
