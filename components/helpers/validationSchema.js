import { Formik } from 'formik';
import * as Yup from 'yup';


export const validationSchema = Yup.object().shape({
  simprintsGui: Yup.string().required('Simprints GUI is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  sex: Yup.string().required('Sex is required'),
  ageGroup: Yup.string().required('Age Group is required'),
  weight: Yup.string().required('Weight is required'),
  height: Yup.string().required('Height is required'),
  district: Yup.string().required('District is required'),
  country: Yup.string().required('Country is required'),
  primaryLanguage: Yup.string().required('Primary Language is required'),
});
