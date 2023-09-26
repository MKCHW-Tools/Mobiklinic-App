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

const VaccinationDatesList = () => {
  const [patientData, setPatientData] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const {userLog, userNames, refusalData, patientId, setPatientId} =
    useContext(DataResultsContext);

  const openPhone = () => {
    Linking.openURL('tel:+256 784 528444');
  };

  useEffect(() => {
    // Fetch patient data from the API endpoint
    fetch(`${URLS.BASE}/${userLog}/patients`)
      .then(response => response.json())
      .then(data => {
        // Sort patient data by appointment date (ascending)
        data.sort((a, b) => {
          const dateA =
            a.vaccinations && a.vaccinations.length > 0
              ? new Date(a.vaccinations[0].dateForNextDose)
              : null;
          const dateB =
            b.vaccinations && b.vaccinations.length > 0
              ? new Date(b.vaccinations[0].dateForNextDose)
              : null;

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

  const formatDate = date => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
    };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

  const isDateValid = date => {
    return !isNaN(new Date(date).getTime());
  };

  const isDatePassed = date => {
    return new Date(date) < new Date();
  };

  const handleDateClick = (date, patient) => {
    setSelectedAppointment({
      date: formatDate(date),
      dayOfWeek: new Date(date).toLocaleDateString('en-US', {weekday: 'long'}),
      patientName: `${patient.firstName} ${patient.lastName}`,
      phoneNumber: patient.phoneNumber,
    });
  };

  if (loading) {
    return <Loader />;
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
    fontSize: 24,
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
    marginBottom: 10,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  selectedAppointment: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'skyblue',
    borderRadius: 5,
  },
  appointmentDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
});

export default VaccinationDatesList;
