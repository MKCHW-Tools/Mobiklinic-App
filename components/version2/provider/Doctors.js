import * as React from 'react';

const DoctorsContext = React.createContext();

const DoctorsProvider = ({children}) => {
  const [doctors, setDoctors] = React.useState([]);

//Changed the literal object proping to useMemo to reduce the re-rendring
  const value = React.useMemo(() => ({ doctors, setDoctors }), [doctors, setDoctors]);
  return (
    <DoctorsContext.Provider value={value}>
      {children}
    </DoctorsContext.Provider>
  );
};

export {DoctorsContext, DoctorsProvider};
