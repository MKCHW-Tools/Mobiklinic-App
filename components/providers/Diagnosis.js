import * as React from 'react';

const DiagnosisContext = React.createContext();

const DiagnosisProvider = ({children}) => {
  const [followups, setFollowups] = React.useState([]);
  const [followup, setFollowup] = React.useState({});
  const [diagnoses, setDiagnoses] = React.useState([]);
  const [diagnosis, setDiagnosis] = React.useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = React.useMemo(() => ({
    handleFollowup: () => {},
    handleFollowups: () => {},
    handleDiagnoses: async data => {},
    handleDiagnosis: () => {},
  }));

  return (
    <DiagnosisContext.Provider
      value={{
        diagnoses,
        followups,
        setDiagnoses,
        setFollowups,
      }}>
      {children}
    </DiagnosisContext.Provider>
  );
};

export {DiagnosisContext, DiagnosisProvider};
