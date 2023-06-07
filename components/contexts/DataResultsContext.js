import React, {createContext, useState} from 'react';

const DataResultsContext = createContext();

export const DataResultsProvider = ({children}) => {
  const [dataResults, setDataResults] = useState([]);

  const updateDataResults = newDataResults => {
    setDataResults(newDataResults);
  };

  return (
    <DataResultsContext.Provider value={{dataResults, updateDataResults}}>
      {children}
    </DataResultsContext.Provider>
  );
};

export default DataResultsContext;
