
import React from 'react';
import { render, fireEvent, waitFor, act, userEvent } from '@testing-library/react-native';
import { DiagnosisProvider, DiagnosisContext } from '../../providers/Diagnosis';
import { DataResultsProvider } from '../../contexts/DataResultsContext';
import DataResultsContext from '../../contexts/DataResultsContext';
import PatientMedical from '../../simprints/patient.medical';
import { Alert } from 'react-native';
import fetchMock from 'jest-fetch-mock'; 