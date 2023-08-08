import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, DIMENS} from '../constants/styles';
import Icon from 'react-native-vector-icons/Feather';
import Loader from '../ui/loader';
import CustomHeader from '../ui/custom-header';
import DataResultsContext from '../contexts/DataResultsContext';

const PatientList = ({ navigation }) => {
  const { userLog, userNames } = useContext(DataResultsContext);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isNoUserFound, setIsNoUserFound] = useState(false);
  const [patientsEnrolledCount, setPatientsEnrolledCount] = useState(0);
  const [loggedInUserPhoneNumber, setLoggedInUserPhoneNumber] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);

  const formatDate = (date) => {
    if (date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }
    return 'Click to add date';
  };

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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://mobi-be-production.up.railway.app/patients`);

      if (response.status === 200) {
        const currentDate = new Date();
        const lastWeekDate = new Date('2023-07-19');

        const filteredData = response.data.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= lastWeekDate && itemDate <= currentDate;
        });

        const sortedData = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const loggedInUserPhone = userLog ? userLog.phoneNumber : '';
        const filteredDataForUser = sortedData.filter((item) => item.phoneNumber === loggedInUserPhone);

        setUsers(sortedData);
        await AsyncStorage.setItem('patientList', JSON.stringify(sortedData));
        setIsNoUserFound(sortedData.length === 0);
        setPatientsEnrolledCount(sortedData.length);
      } else {
        const storedData = await AsyncStorage.getItem('patientList');

        if (storedData) {
          setUsers(JSON.parse(storedData));
          setPatientsEnrolledCount(JSON.parse(storedData).length);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);

      const storedData = await AsyncStorage.getItem('patientList');

      if (storedData) {
        setUsers(JSON.parse(storedData));
        setPatientsEnrolledCount(JSON.parse(storedData).length);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    };

    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const response = await axios.get(`https://mobi-be-production.up.railway.app/search?query=${query}`);
      setSearchSuggestions(response.data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const renderUserCard = ({ item }) => {
    const isExpanded = item.id === expandedUserId;

    const toggleExpansion = () => {
      if (isExpanded) {
        setExpandedUserId(null);
      } else {
        setExpandedUserId(item.id);
      }
    };

    const fullName = `${item.firstName} ${item.lastName}`;
    const fullNameChars = fullName.split('');

    const addData = () => {
      setPatientId(item.id);
      console.log('Adding data for patient ID:', patientId.id);

      navigation.navigate('SelectActivity', {
        patientId: patientId,
        paramKey: { firstName: item.firstName, lastName: item.lastName },
      });
    };

    return (
      <View style={styles.userCard}>
        <TouchableOpacity onPress={toggleExpansion} style={styles.cardHeader}>
          <Text style={styles.userName}>
            {fullNameChars.map((char, index) => {
              const isMatchingChar = searchQuery.toLowerCase().includes(char.toLowerCase());
              const highlightStyle = isMatchingChar ? { backgroundColor: COLORS.PRIMARY } : {};

              return (
                <Text key={index} style={[styles.userName, highlightStyle]}>
                  {char}
                </Text>
              );
            })}
          </Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={25}
            color={COLORS.PRIMARY}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.cardDetails}>
            <Text style={styles.userDataLabel}>
              User Name:{'\t'}
              {'\t'}
              <Text style={styles.userDataValue}>{userNames}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Phone Number:
              <Text style={styles.userDataValue}>{item.phoneNumber}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Date Of Birth:
              <Text style={styles.userDataValue}>{formatDate(new Date(item.ageGroup))}</Text>
            </Text>

            <Text style={styles.userDataLabel}>
              Primary Language:{' '}
              <Text style={styles.userDataValue}>{item.primaryLanguage}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Simprints GUID:{' '}
              <Text style={styles.userDataValue}>{item.simprintsGui}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Country <Text style={styles.userDataValue}>{item.country}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              District:{' '}
              <Text style={styles.userDataValue}>{item.district}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Sex: <Text style={styles.userDataValue}>{item.sex}</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Weight: <Text style={styles.userDataValue}>{item.weight}</Text>
            </Text>
            <View style={styles.line} />
            {item.vaccinations && item.vaccinations.length > 0 && (
              <View>
                <Text style={styles.userDataLabel1}>VACCINATION</Text>
                {item.vaccinations.map((vaccination, index) => (
                  <View key={index}>
                    <Text style={styles.userDataLabel}>
                      Vaccine Name:{' '}
                      <Text style={styles.userDataValue}>{vaccination.vaccineName}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Date of Vaccination:{' '}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(vaccination.dateOfVaccination))}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Dose:{' '}
                      <Text style={styles.userDataValue}>{vaccination.dose}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Card Number:{' '}
                      <Text style={styles.userDataValue}>{vaccination.units}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Date for Next Dose:{' '}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(vaccination.dateForNextDose))}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Site Administered:{' '}
                      <Text style={styles.userDataValue}>{vaccination.siteAdministered}</Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Facility:{' '}
                      <Text style={styles.userDataValue}>{vaccination.facility}</Text>
                    </Text>
                    <View style={styles.line} />

                    <View style={{ height: 20 }} />
                  </View>
                ))}
              </View>
            )}
            {item.antenantals && item.antenantals.length > 0 && (
              <View>
                <Text style={styles.userDataLabel1}>ANTENATAL CARE</Text>
                {item.antenantals.map((antenantal, index) => (
                  <View key={index}>
                    <Text style={styles.userDataLabel}>
                      Pregnacy Status:
                      <Text style={styles.userDataValue}>{antenantal.pregnancyStatus}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Expected Date for Delivery:
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(antenantal.expectedDateOfDelivery))}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Date for routine visit:
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(antenantal.routineVisitDate))}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Blood Group:
                      <Text style={styles.userDataValue}>{antenantal.bloodGroup}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Prescriptions:
                      <Text style={styles.userDataValue}>{antenantal.prescriptions}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Current Weight:
                      <Text style={styles.userDataValue}>{antenantal.weight}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Next of Kin:
                      <Text style={styles.userDataValue}>{antenantal.nextOfKin}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Next of Kin Contact:
                      <Text style={styles.userDataValue}>{antenantal.nextOfKinContact}</Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Additional Notes:
                      <Text style={styles.userDataValue}>{antenantal.drugNotes}</Text>
                    </Text>

                    <View style={styles.line} />
                  </View>
                ))}
              </View>
            )}
            {item.diagnoses && item.diagnoses.length > 0 && (
              <View>
                <Text style={styles.userDataLabel1}>DIAGNOSIS</Text>

                {item.diagnoses.map((diagnosis, index) => (
                  <View key={index}>
                    <Text style={styles.userDataLabel}>
                      Condition:{' '}
                      <Text style={styles.userDataValue}>{diagnosis.condition}</Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Prescribed drugs:{' '}
                      <Text style={styles.userDataValue}>{diagnosis.drugsPrescribed}</Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Dosage:{' '}
                      <Text style={styles.userDataValue}>
                        {diagnosis.dosage} X {diagnosis.frequency} for {'\t'}
                        {diagnosis.duration} days
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Date of diagnosis:{' '}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(diagnosis.dateOfDiagnosis))}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Date for Next Dose:{' '}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(diagnosis.followUpDate))}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Impression:{' '}
                      <Text style={styles.userDataValue}>{diagnosis.impression}</Text>
                    </Text>
                    <View style={styles.line} />

                    <View style={{ height: 20 }} />
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('SimprintsID')} style={styles.buttonSec}>
              <Text style={styles.buttonText}>Add Data</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber;
  };

  return (
    <View style={styles.wrapper}>
      {_header()}
      <View style={styles.container}>
        <Text style={styles.header}>Beneficiary List</Text>
        <Text style={styles.header}>Patients Enrolled: {patientsEnrolledCount}</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor={COLORS.BLACK}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={fetchUsers}>
            <Icon name="search" size={20} color={COLORS.BLACK} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        {searchSuggestions.length > 0 && (
          <View style={styles.searchSuggestionsContainer}>
            {searchSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchSuggestion}
                onPress={() => handleSearch(suggestion)}>
                <Text style={styles.searchSuggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {!isLoading ? (
          users.length > 0 ? (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderUserCard}
              contentContainerStyle={styles.flatListContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
          ) : (
            <Text style={styles.noUserFoundText}>No user found</Text>
          )
        ) : (
          <Loader />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchSuggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  searchSuggestion: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  searchSuggestionText: {
    color: COLORS.WHITE,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  noUserFoundText: {
    fontSize: 16,
    textAlign: 'center',
  },
  userCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    borderRadius: 4,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDetails: {
    marginTop: 8,
  },
  userDataLabel: {
    marginBottom: 4,
  },
  userDataValue: {
    fontWeight: 'bold',
  },
  userDataLabel1: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BLACK,
    marginBottom: 8,
  },
  buttonSec: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PatientList;
