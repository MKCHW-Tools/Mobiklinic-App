import React, {useEffect, useState, useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, DIMENS} from '../constants/styles';
import Icon from 'react-native-vector-icons/Feather';
import Loader from '../ui/loader';
import CustomHeader from '../ui/custom-header';
import DataResultsContext from '../contexts/DataResultsContext';

const PatientLists = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const {userLog} = useContext(DataResultsContext);
  const patientVac = useContext(DataResultsContext);
  const [vaccinations, setVaccinations] = useState([]);

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{
            marginHorizontal: 4,
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
      title={<Text style={[styles.centerHeader]}>Back</Text>}
    />
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedData = await AsyncStorage.getItem('patientList');
        if (storedData) {
          setUsers(JSON.parse(storedData));
        } else {
          const response = await axios.get(
            `https://mobi-be-production.up.railway.app/${userLog}/patients`,
          );
          const { data } = response;
          setUsers(data);
          await AsyncStorage.setItem('patientList', JSON.stringify(data));
    
          const vaccinationsResponse = await axios.get(
            `https://mobi-be-production.up.railway.app/${userLog}/vaccinations`,
          );
          const { data: vaccinationData } = vaccinationsResponse;
          setVaccinations(vaccinationData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    

    fetchUsers();
  }, [userLog]);

  const [expandedUserId, setExpandedUserId] = useState(null);

  const renderUserCard = ({item}) => {
    const isExpanded = item.id === expandedUserId;

    const userVaccinations = vaccinations.filter(
      vaccination => vaccination.signUpId === item.signUpId,
    );

    const toggleExpansion = () => {
      if (isExpanded) {
        setExpandedUserId(null);
      } else {
        setExpandedUserId(item.id);
      }
    };

    return (
      <View style={styles.userCard}>
        <TouchableOpacity onPress={toggleExpansion} style={styles.cardHeader}>
          <Text style={styles.userName}>
            {item.firstName} {item.lastName}
          </Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={25}
            color={COLORS.PRIMARY}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.cardDetails}>
            <Text style={styles.label}>Sex: {item.sex}</Text>
            <Text style={styles.label}>Age Group: {item.ageGroup}</Text>
            <Text style={styles.label}>
              Phone Number: {formatPhoneNumber(item.phoneNumber)}
            </Text>
            <Text style={styles.label}>Weight: {item.weight} kg</Text>
            <Text style={styles.label}>Height: {item.height} cm</Text>
            <Text style={styles.label}>District: {item.district}</Text>
            <Text style={styles.label}>Country: {item.country}</Text>
            <Text style={styles.label}>
              Primary Language: {item.primaryLanguage}
            </Text>
            <Text style={styles.label}>Simprints GUI: {item.simprintsGui}</Text>

            <Text style={styles.label}>Vaccinations:</Text>
            {userVaccinations.map((vaccination, index) => (
              <View key={index} style={styles.vaccinationContainer}>
                <Text style={styles.vaccinationLabel}>
                  Date of Vaccination: {vaccination.dateOfVaccination}
                </Text>
                <Text style={styles.vaccinationLabel}>
                  Date for Next Dose: {vaccination.dateForNextDose}
                </Text>
                <Text style={styles.vaccinationLabel}>
                  Vaccine Name: {vaccination.vaccineName}
                </Text>
                <Text style={styles.vaccinationLabel}>
                  Units: {vaccination.units}
                </Text>
                <Text style={styles.vaccinationLabel}>
                  Site Administered: {vaccination.siteAdministered}
                </Text>
                <Text style={styles.vaccinationLabel}>
                  Facility: {vaccination.facility}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const formatPhoneNumber = phoneNumber => {
    // Format the phone number as per your preference
    // Example: Add dashes or parentheses for better readability
    return phoneNumber;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {_header()}
        <Text style={styles.header}>Beneficary List</Text>
        {users.length > 0 ? (
          <FlatList
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={renderUserCard}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <View>
            <Loader />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  wrapper: {
    flex: 1,
    // padding: DIMENS.PADDING,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
    marginVertical: 20,
    textDecorationLine: 'underline',
  },
  centerHeader: {
    flex: 1,
    alignItems: 'center',
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  cardDetails: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.BLACK,
  },
});

export default PatientLists;
