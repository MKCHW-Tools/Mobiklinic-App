import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Dashboard from '../components/screens/dashboard';

// Mocking the navigation object
const mockNavigation = {
  navigate: jest.fn(),
};

describe('Dashboard', () => {
  it('displays the correct greeting message', () => {
    const {getByText} = render(<Dashboard navigation={mockNavigation} />);
    const greetingText = getByText('Hey');
    expect(greetingText).toBeTruthy();
  });

  it('navigates to "SimprintsConnect" screen when Beneficiary card is pressed', () => {
    const {getByText} = render(<Dashboard navigation={mockNavigation} />);
    const beneficiaryCard = getByText('Beneficiary');
    fireEvent.press(beneficiaryCard);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SimprintsConnect');
  });

  it('navigates to "Ambulance" screen when Ambulances card is pressed', () => {
    const {getByText} = render(<Dashboard navigation={mockNavigation} />);
    const ambulancesCard = getByText('Ambulances');
    fireEvent.press(ambulancesCard);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Ambulance');
  });

  it('navigates to "Profile" screen when My Profile card is pressed', () => {
    const {getByText} = render(<Dashboard navigation={mockNavigation} />);
    const myProfileCard = getByText('My Profile');
    fireEvent.press(myProfileCard);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
  });

  // Add more test cases for other cards as needed
});
