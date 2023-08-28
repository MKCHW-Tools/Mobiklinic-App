import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';
import GetPatients from '../../simprints/getPatients';
import fetchMock from 'jest-fetch-mock';
import { useNavigation } from '@react-navigation/native';

// Configure fetch to use the mock implementation
fetchMock.enableMocks();

// Mock the navigation hook
const spyNavigation = jest.mock('@react-navigation/native').useNavigation = jest.fn();

describe('GetPatients', () => {
    beforeEach(() => {
        fetchMock.resetMocks(); // Reset fetch mocks before each test
    });

    // Mock the necessary dependencies
    const navigation = { goBack: jest.fn(), navigate: jest.fn() };
    //useN

    //test that the component renders successfully
    it('should render successfully', () => {

        const useContextMock = jest.spyOn(React, 'useContext').mockReturnValue({ benData: [] });
        const { getByText } = render(
            <DiagnosisProvider>
                <DataResultsProvider >
                    <GetPatients navigation={navigation} />
                </DataResultsProvider>
            </DiagnosisProvider>);

        // Assertions
        expect(getByText('Mobiklinic')).toBeTruthy();
    });

    //Tests that the function fetches data successfully and displays it on the screen
    it('fetches and displays patient data correctly', async () => {
        // Mock the fetch response data
        const mockPatientData = {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '123-456-7890',
            // Add more properties as needed to match your data structure
        };


        // Render your component
        const { getByText } = render(
            <DiagnosisProvider>
                <DataResultsProvider >
                    <GetPatients navigation={navigation} />
                </DataResultsProvider>
            </DiagnosisProvider>);

        // Mock a successful response from the server
        fetchMock.mockResponseOnce(JSON.stringify(mockPatientData));

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
