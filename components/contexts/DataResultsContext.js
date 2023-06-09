

import React, { createContext, useState } from 'react';

const DataResultsContext = createContext();

export const DataResultsProvider = ({ children }) => {
  const [dataResults, setDataResults] = useState('');
  const [benData, setBenData] = useState([]);

  const updateDataResults = newDataResults => {
    setDataResults(newDataResults);
  };

  const updateBenData = newBenData => {
    setBenData(newBenData);
  };

  return (
    <DataResultsContext.Provider 
      value={{
        dataResults,
        updateDataResults,
        benData,
        updateBenData,
      }}
    >
      {children}
    </DataResultsContext.Provider>
  );
};

export default DataResultsContext;

