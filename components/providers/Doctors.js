import * as React from 'react';

const DoctorsContext = React.createContext();

const DoctorsProvider = ({children}) => {
  const [doctors, setDoctors] = React.useState([]);

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        setDoctors,
      }}>
      {children}
    </DoctorsContext.Provider>
  );
};

export {DoctorsContext, DoctorsProvider};
