import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectActivity from '../../simprints/select.activity';


describe('SelectActivity Component', () => {
    // Mock navigation prop and context
    const navigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
    };

    const route = {
        params: {
            paramKey: {
                firstName: 'Silas',
                lastName: 'Sangmin',
            },
        },
    };

    it('renders the component correctly', () => {
        const { getByText } = render(

            <SelectActivity navigation={navigation} route={route} />

        );

        // Check if important text elements are rendered
        expect(getByText('Mobiklinic')).toBeTruthy();
        expect(getByText('Diagnose Patient')).toBeTruthy();
        expect(getByText('Vaccination')).toBeTruthy();
        expect(getByText('Antenatal Care')).toBeTruthy();
        expect(getByText('Home')).toBeTruthy();
    });


    //Test that the buttons navigate to the correct screens - PatientMedical
    it('navigates to Diagnose Patient screen', () => {
        const { getByText } = render(
            <SelectActivity navigation={navigation} route={route} />
        );

        const diagnosePatientButton = getByText('Diagnose Patient');
        fireEvent.press(diagnosePatientButton);

        expect(navigation.navigate).toHaveBeenCalledWith('PatientMedical');
    });


    //Test that the buttons navigate to the correct screens - Vaccination
    it('navigates to Vaccination screen', () => {
        const { getByText } = render(
            <SelectActivity navigation={navigation} route={route} />
        );

        const vaccinationButton = getByText('Vaccination');
        fireEvent.press(vaccinationButton);

        expect(navigation.navigate).toHaveBeenCalledWith('Vaccination');
    });

    //Test that the buttons navigate to the correct screens - Antenatal Care
    it('navigates to Antenatal Care screen', () => {
        const { getByText } = render(
            <SelectActivity navigation={navigation} route={route} />
        );

        const antenatalCareButton = getByText('Antenatal Care');
        fireEvent.press(antenatalCareButton);

        expect(navigation.navigate).toHaveBeenCalledWith('AntenatalCare');
    });

    //Test that the buttons navigate to the correct screens - Home
    it('navigates to Home screen', () => {
        const { getByText } = render(
            <SelectActivity navigation={navigation} route={route} />
        );

        const homeButton = getByText('Home');
        fireEvent.press(homeButton);

        expect(navigation.navigate).toHaveBeenCalledWith('Dashboard');
    });
});
