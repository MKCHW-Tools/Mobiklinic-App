import React, { createContext, useContext, useState } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CopyRight from '../../simprints/copyright';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';


describe("CopyRight", () => {

    // Tests that the component renders without errors
    it('should render without errors', () => {
        // Render the component
        const { getByText } = render(<CopyRight />);
        //get copy right text
        // Get the current year
        const currentYear = new Date().getFullYear();
        const copyRightText = getByText(`© ${currentYear} Mobiklinic. All rights reserved.`);
        // Assert that the text is displayed
        expect(copyRightText).toBeTruthy();
    });

    // Tests that the component displays the correct year dynamically
    it('should display the correct year dynamically', () => {
        // Render the component
        const { getByText } = render(<CopyRight />);

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Assert that the displayed year matches the current year
        expect(getByText(`© ${currentYear} Mobiklinic. All rights reserved.`)).toBeTruthy();
    });

});