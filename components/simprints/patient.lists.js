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
  const {userLog} = useContext(DataResultsContext); // Get the logged-in user ID from the context

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
        // First, check if the data is stored locally
        const storedData = await AsyncStorage.getItem('patientList');
        if (storedData) {
          setUsers(JSON.parse(storedData));
        } else {
          const response = await axios.get(
            `https://mobi-be-production.up.railway.app/${userLog}/patients`, // Use the logged-in user ID in the API URL
          );
          setUsers(response.data);
          // Save the fetched data locally for offline access
          await AsyncStorage.setItem(
            'patientList',
            JSON.stringify(response.data),
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [userLog]);

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [vaccinationData, setVaccinationData] = useState(null);

  const renderUserCard = ({item}) => {
    const isExpanded = item.id === expandedUserId;

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
            <Text style={styles.label}>
              Primary Language: {item.primaryLanguage}
            </Text>
            <Text style={styles.label}>Simprints GUI: {item.simprintsGui}</Text>
            {item.vaccinations && item.vaccinations.length > 0 && (
              <View>
                {item.vaccinations.map((vaccination, index) => (
                  <View key={index}>
                    <Text style={styles.label}>
                      Vaccination Name: {vaccination.vaccineName}
                    </Text>
                    <Text style={styles.label}>
                      Vaccination Date: {vaccination.dateOfVaccination}
                    </Text>
                    <Text style={styles.label}>
                      {' '}
                      Dosage: {vaccination.dose}
                    </Text>
                    <Text style={styles.label}>
                      {' '}
                      Units: {vaccination.units}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const formatPhoneNumber = phoneNumber => {
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
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  cardDetails: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: COLORS.BLACK,
  },
  userDataValue: {
    fontWeight: 'normal',
    fontSize: 16,
  },
});

export default PatientLists;
