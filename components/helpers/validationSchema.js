import * as Yup from 'yup';
import React from 'react';

const validationSchema = Yup.object({
  personalInformation: Yup.object().shape({
    fullname: Yup.string().required('Full Name is required'),
    age_group: Yup.string().required('Age Group is required'),
    phone: Yup.string().required('Phone number is required'),
    condition: Yup.string().required('Condition is required'),
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
