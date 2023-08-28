
import React from 'react';
import { render } from '@testing-library/react-native';
import { DiagnosisContext } from '../../providers/Diagnosis';
import DataResultsContext from '../../contexts/DataResultsContext';
import SimprintsID from '../../simprints/simprintsID';
import fetchMock from 'jest-fetch-mock';

// mock fetch
fetchMock.enableMocks();

describe('SimprintsID Component', () => {

    beforeEach(() => {
        fetchMock.resetMocks(); // Reset fetch mocks before each test
    });

    const navigation = {
        navigate: jest.fn(),
        goBack: jest.fn()
    };


    //Test that component renders correctly
    it('renders correctly', () => {

        const screen = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '', benData: [], setPatientId: jest.fn() }}>
                    <SimprintsID navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>);

        expect(screen).toMatchSnapshot();

    });


    //Test for fetchData Function:
    it('fetchData fetches data and sets state', async () => {
        // Mock the fetch function to return a response
        fetchMock.mockResponseOnce(JSON.stringify({ id: 1 }), { status: 200 });


        const screen = render(
            <DiagnosisContext.Provider value={{ diagnoses: [] }}>
                <DataResultsContext.Provider value={{ dataResults: '', userLog: 'userLog', patientId: '', benData: [], setPatientId: jest.fn() }}>
                    <SimprintsID navigation={navigation} />
                </DataResultsContext.Provider>
            </DiagnosisContext.Provider>)

        // Wait for the fetchData function to be called and complete
        expect(fetchMock).toHaveBeenCalledTimes(1);

    });



});