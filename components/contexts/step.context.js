import React, {useState, createContext} from 'react';
import {View} from 'react-native';

export const MultiStepContext = createContext();
export const StepContext = ({children}) => {
  const [patientData, setPatientData] = useState({});

  return (
    <View>
      <MultiStepContext.Provider value={{patientData, setPatientData}}>
        {children}
      </MultiStepContext.Provider>
    </View>
  );
};

export default StepContext;
