<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
=======
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import Loader from '../ui/loader';
import {URLS} from '../constants/API';
import DataResultsContext from '../contexts/DataResultsContext';
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291

const VaccinationDatesList = () => {
  const [patientData, setPatientData] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  useEffect(() => {
    // Fetch patient data from the API endpoint
    fetch('https://apis.mobiklinic.com/patients')
=======
  const {userLog, userNames, refusalData, patientId, setPatientId} =
    useContext(DataResultsContext);


  useEffect(() => {
    // Fetch patient data from the API endpoint
    fetch(`${URLS.BASE}/${userLog}/patients`)
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
      .then(response => response.json())
      .then(data => {
        // Sort patient data by appointment date (ascending)
        data.sort((a, b) => {
<<<<<<< HEAD
          const dateA = a.vaccinations && a.vaccinations.length > 0 ? new Date(a.vaccinations[0].dateForNextDose) : null;
          const dateB = b.vaccinations && b.vaccinations.length > 0 ? new Date(b.vaccinations[0].dateForNextDose) : null;
=======
          const dateA =
            a.vaccinations && a.vaccinations.length > 0
              ? new Date(a.vaccinations[0].dateForNextDose)
              : null;
          const dateB =
            b.vaccinations && b.vaccinations.length > 0
              ? new Date(b.vaccinations[0].dateForNextDose)
              : null;
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291

          if (!dateA) return 1;
          if (!dateB) return -1;

          return dateA - dateB;
        });

        setPatientData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching patient data:', error);
        setLoading(false);
      });
  }, []);

<<<<<<< HEAD
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' };
=======
  const formatDate = date => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
    };
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

<<<<<<< HEAD
  const isDateValid = (date) => {
    return !isNaN(new Date(date).getTime());
  };

  const isDatePassed = (date) => {
=======
  const isDateValid = date => {
    return !isNaN(new Date(date).getTime());
  };

  const isDatePassed = date => {
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
    return new Date(date) < new Date();
  };

  const handleDateClick = (date, patient) => {
    setSelectedAppointment({
      date: formatDate(date),
<<<<<<< HEAD
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
=======
      dayOfWeek: new Date(date).toLocaleDateString('en-US', {weekday: 'long'}),
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
      patientName: `${patient.firstName} ${patient.lastName}`,
      phoneNumber: patient.phoneNumber,
    });
  };

  if (loading) {
<<<<<<< HEAD
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
=======
    return <Loader />;
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>COVID-19 Next Dose Appointments:</Text>
      <ScrollView style={styles.dateList}>
        {patientData &&
          patientData.map(patient =>
            patient.vaccinations &&
            patient.vaccinations.length > 0 &&
            isDateValid(patient.vaccinations[0].dateForNextDose) &&
            !isDatePassed(patient.vaccinations[0].dateForNextDose) ? (
              <TouchableOpacity
                key={patient.id}
                onPress={() =>
<<<<<<< HEAD
                  handleDateClick(patient.vaccinations[0].dateForNextDose, patient)
                }
                style={styles.dateItem}
              >
                <Text style={styles.dateText}>
                  Next Dose: {formatDate(patient.vaccinations[0].dateForNextDose)}
                </Text>
              </TouchableOpacity>
            ) : null
          )}
      </ScrollView>
      {selectedAppointment && (
        <View style={[styles.selectedAppointment, { backgroundColor: 'skyblue' }]}>
          <Text style={styles.appointmentDate}>Next Dose: {selectedAppointment.date}</Text>
          <Text style={styles.appointmentDate}>Patient's Name: {selectedAppointment.patientName}</Text>
          <Text style={styles.appointmentDate}>Phone Number: {selectedAppointment.phoneNumber}</Text>
        </View>
=======
                  handleDateClick(
                    patient.vaccinations[0].dateForNextDose,
                    patient,
                  )
                }
                style={styles.dateItem}>
                <Text style={styles.dateText}>
                  Next Dose:{' '}
                  {formatDate(patient.vaccinations[0].dateForNextDose)}
                </Text>
              </TouchableOpacity>
            ) : null,
          )}
      </ScrollView>
      {selectedAppointment && (
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`tel:${selectedAppointment.phoneNumber}`)
          }>
          <View style={styles.selectedAppointment}>
            <Text style={styles.appointmentDate}>
              Next Dose: {selectedAppointment.date}
            </Text>
            <Text style={styles.appointmentDate}>
              Patient's Name: {selectedAppointment.patientName}
            </Text>
            <Text style={styles.appointmentDate}>
              Phone Number: {selectedAppointment.phoneNumber}
            </Text>
          </View>
        </TouchableOpacity>
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
<<<<<<< HEAD
    fontSize: 18,
=======
    fontSize: 24,
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  dateList: {
    marginTop: 10,
  },
  dateItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
<<<<<<< HEAD
    marginBottom: 5,
=======
    marginBottom: 10,
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  selectedAppointment: {
    marginTop: 20,
<<<<<<< HEAD
    padding: 10,
    backgroundColor: 'skyblue', // Set the background color to sky blue
=======
    padding: 20,
    backgroundColor: 'skyblue',
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
    borderRadius: 5,
  },
  appointmentDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
<<<<<<< HEAD
  },
  dayOfWeek: {
    fontSize: 16,
    color: 'black',
  },
  patientName: {
    fontSize: 16,
    color: 'black',
  },
  patientPhone: {
    fontSize: 16,
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
=======
    marginBottom: 10,
>>>>>>> fd494d0cb8b8f3a2c4139232886ef776b4900291
  },
});

export default VaccinationDatesList;
