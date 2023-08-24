import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';
import GetPatients from '../../simprints/getPatients';


describe('GetPatients', () => {

    //test that the component renders successfully
    it('should render successfully', () => {
        // Mock the necessary dependencies
        const navigation = { goBack: jest.fn(), navigate: jest.fn() };
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

    // Tests that the function fetches data successfully and displays it on the screen
    // it('should fetch data successfully and display it on the screen', async () => {
    //     // Mock the necessary dependencies
    //     const navigation = { goBack: jest.fn(), navigate: jest.fn() };
    //     const useContextMock = jest.spyOn(React, 'useContext').mockReturnValue({ benData: [{ guid: '123' }] });
    //     const useStateMock = jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
    //     const setGuidMock = jest.fn();
    //     const setUserDataMock = jest.fn();
    //     const setVaccinationsMock = jest.fn();
    //     const setDiagnosisMock = jest.fn();
    //     const setShowConfirmButtonMock = jest.fn();
    //     const fetchDataMock = jest.fn();
    //     const setUserDataData = {
    //         firstName: 'Silas',
    //         lastName: 'Sanminga',
    //         phoneNumber: '1234567890',
    //         vaccinations: [
    //             { vaccineName: 'COVID-19', dateOfVaccination: new Date(), dose: '1', units: '123', dateForNextDose: new Date(), siteAdministered: 'Hospital', facility: 'ABC Hospital' }],
    //         diagnoses: [
    //             {
    //                 condition: 'Fever', drugsPrescribed: 'Paracetamol', dosage: '1 tablet', frequency: '3 times a day', duration: '5 days', dateOfDiagnosis: new Date(), followUpDate: new Date(), impression: 'Common cold'
    //             }]
    //     };

    //     // Mock the useEffect hook
    //     jest.spyOn(React, 'useEffect').mockImplementationOnce((effect) => effect());

    //     // Mock the fetch function
    //     global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(setUserDataData) });

    //     const { getByText } = render(
    //         <DiagnosisProvider>
    //             <DataResultsProvider >
    //                 <GetPatients navigation={navigation} />
    //             </DataResultsProvider>
    //         </DiagnosisProvider>);

    //     // Assertions
    //     expect(useContextMock).toHaveBeenCalledTimes(1);
    //     expect(useStateMock).toHaveBeenCalledTimes(6);
    //     expect(useStateMock).toHaveBeenCalledWith(benData.length > 0 ? benData[0].guid : []);
    //     expect(setGuidMock).toHaveBeenCalledWith(benData.length > 0 ? benData[0].guid : []);
    //     expect(setUserDataMock).toHaveBeenCalledWith(setUserDataData);
    //     expect(setVaccinationsMock).toHaveBeenCalledWith(setUserDataData.vaccinations);
    //     expect(setDiagnosisMock).toHaveBeenCalledWith(setUserDataData.diagnoses);
    //     expect(setShowConfirmButtonMock).toHaveBeenCalledWith(true);
    //     expect(fetch).toHaveBeenCalledWith(`https://api.example.com/beneficiary/${guid}`);
    //     expect(setUserDataMock).toHaveBeenCalledWith(setUserDataData);
    // });

    // // Tests that the user navigates back to the previous screen successfully
    // it('should navigate back to the previous screen successfully', () => {
    //     // Mock the necessary dependencies
    //     const navigation = { goBack: jest.fn(), navigate: jest.fn() };
    //     const useContextMock = jest.spyOn(React, 'useContext').mockReturnValue({ benData: [] });
    //     const { getByText } = render(
    //         <DiagnosisProvider>
    //             <DataResultsProvider >
    //                 <GetPatients navigation={navigation} />
    //             </DataResultsProvider>
    //         </DiagnosisProvider>);

    //     //get the back button
    //     const backButton = getByText('Back');

    //     // Click the back button
    //     act(() => {
    //         fireEvent.press(backButton);
    //     });

    //     // Assertions
    //     expect(navigation.goBack).toHaveBeenCalled();
    // });
});
