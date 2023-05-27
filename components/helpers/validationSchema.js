import * as Yup from 'yup';
import React from 'react';

const validationSchema = Yup.object({
  personalInformation: Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    contactInformation: Yup.object().shape({
      phoneNumber: Yup.string().required('Phone Number is required'),
      email: Yup.string(),
    }),
  }),
  medicalConditions: Yup.object().shape({
    currentConditions: Yup.string(),
    pastConditions: Yup.string(),
    chronicDiseases: Yup.string(),
    allergies: Yup.string(),
    surgeries: Yup.string(),
  }),
  medications: Yup.object().shape({
    currentMedications: Yup.string(),
    previousMedications: Yup.string(),
    medicationAllergies: Yup.string(),
  }),
  familyMedicalHistory: Yup.object().shape({
    familyDiseases: Yup.string(),
    hereditaryConditions: Yup.string(),
  }),
  reproductiveHistory: Yup.object().shape({
    pregnancyHistory: Yup.string(),
    obstetricGynecologicalHistory: Yup.string(),
  }),
  additionalInformation: Yup.object().shape({
    otherMedicalInformation: Yup.string(),
  }),
});
export default validationSchema;
