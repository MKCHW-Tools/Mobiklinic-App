// DiagnosisContext.mock.js
import React from 'react';

const DiagnosisContext = React.createContext({
    diagnoses: [],
    followups: [],
    setDiagnoses: jest.fn(),
    setFollowups: jest.fn(),
});

const DiagnosisProvider = ({ children }) => {
    const [followups, setFollowups] = React.useState([]);
    const [diagnoses, setDiagnoses] = React.useState([]);

    const handleFollowup = jest.fn();
    const handleFollowups = jest.fn();
    const handleDiagnoses = jest.fn();
    const handleDiagnosis = jest.fn();

    return (
        <DiagnosisContext.Provider
            value={{
                diagnoses,
                followups,
                setDiagnoses,
                setFollowups,
                handleFollowup,
                handleFollowups,
                handleDiagnoses,
                handleDiagnosis,
            }}
        >
            {children}
        </DiagnosisContext.Provider>
    );
};

export { DiagnosisContext, DiagnosisProvider };
