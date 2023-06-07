import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import axios from 'axios';
import SimprintsID from './simprintsID';

const DatabasePostComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [district, setDistrict] = useState('');
  const [country, setCountry] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('');
  const [simprintsGui, setSimprintsGui] = useState('');

  const handleSimprintsIDChange = (simprintsId) => {
    // Assuming SimprintsID component provides the simprintsId value
    setSimprintsGui(simprintsId);
  };

  const handleSubmit = async () => {
    const data = {
      firstName,
      lastName,
      sex,
      ageGroup,
      phoneNumber,
      weight,
      height,
      district,
      country,
      primaryLanguage,
      simprintsGui,
    };

    try {
      const response = await axios.post(
        'https://mobi-be-production.up.railway.app/patients',
        data
      );
      console.log('Response:', response.data);

      // Clear the form fields after successful submission
      setFirstName('');
      setLastName('');
      setSex('');
      setAgeGroup('');
      setPhoneNumber('');
      setWeight('');
      setHeight('');
      setDistrict('');
      setCountry('');
      setPrimaryLanguage('');
      setSimprintsGui('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput placeholder="Sex" value={sex} onChangeText={setSex} />
      <TextInput
        placeholder="Age Group"
        value={ageGroup}
        onChangeText={setAgeGroup}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        placeholder="Height"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        placeholder="District"
        value={district}
        onChangeText={setDistrict}
      />
      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        placeholder="Primary Language"
        value={primaryLanguage}
        onChangeText={setPrimaryLanguage}
      />
      <SimprintsID onChange={handleSimprintsIDChange} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default DatabasePostComponent;
