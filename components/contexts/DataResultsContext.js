import React, { createContext, useState } from 'react';

const DataResultsContext = createContext();

export const DataResultsProvider = ({ children }) => {
  const [dataResults, setDataResults] = useState('');
  const [benData, setBenData] = useState([]);
  const [userLog, setUserLog] = useState('');
  const [patientVac, setPatientVac] = useState('');

  const updateDataResults = newDataResults => {
    setDataResults(newDataResults);
  };

  const updateBenData = newBenData => {
    setBenData(newBenData);
  };

  const updateUserLog = newUserLog => {
    setUserLog(newUserLog);
  };

  const updatePatientVac = newPatientVac => {
    setPatientVac(newPatientVac);
  };

  return (
    <DataResultsContext.Provider 
      value={{
        dataResults,
        updateDataResults,
        benData,
        updateBenData,
        userLog,
        updateUserLog,
        patientVac,
        updatePatientVac
      }}
    >
      {children}
    </DataResultsContext.Provider>
  );
};

export default DataResultsContext;
