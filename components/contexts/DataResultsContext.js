import React, {createContext, useState} from 'react';

const DataResultsContext = createContext();

export const DataResultsProvider = ({children}) => {
  const [dataResults, setDataResults] = useState('');
  const [benData, setBenData] = useState([]);
  const [userLog, setUserLog] = useState('');
  const [patientId, setPatientId] = useState('');
  const [userNames, setUserNames] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [registrationError, setRegistrationError] = useState({
    reason: '',
    extra: '',
  });
  const [refusalData, setRefusalData] = useState({});


  const updateRegistrationErrorContext = (reason, extra) => {
    setRegistrationError({reason, extra});
  };
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

  const updateUserNames = newUserNames => {
    setUserNames(newUserNames);
  };

  const updateSession = newSession => {
    setSessionId(newSession);
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
        patientId,
        setPatientId,
        userNames,
        updateUserNames,
        sessionId,
        updateSession,
        registrationError,
        updateRegistrationErrorContext,
        refusalData, 
        setRefusalData,
      }}>
      {children}
    </DataResultsContext.Provider>
  );
};

export default DataResultsContext;
