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
import {URLS} from '../constants/API';

const PatientList = ({navigation}) => {
  const {userLog, refusalData, patientId, setPatientId} =
    useContext(DataResultsContext);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isNoUserFound, setIsNoUserFound] = useState(false);
  const [patientsEnrolledCount, setPatientsEnrolledCount] = useState(0);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const {reason} = refusalData;

  const formatDate = date => {
    if (date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year}`;
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
      const response = await axios.get(`${URLS.BASE}/${userLog}/patients`);
      // const response = await axios.get(`https://mobi-be-production.up.railway.app/patients`);

      if (response.status === 200) {
        const currentDate = new Date();
        const lastWeekDate = new Date('2023-07-19');

        const filteredData = response.data.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= lastWeekDate && itemDate <= currentDate;
        });

        const sortedData = filteredData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        const loggedInUserPhone = userLog ? userLog.phoneNumber : '';
        const filteredDataForUser = sortedData.filter(
          item => item.phoneNumber === loggedInUserPhone,
        );

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

  const handleSearch = async query => {
    setSearchQuery(query);
    try {
      const response = await axios.get(
        `http://192.168.1.14:3000/search?query=${query}`,
      );
      setSearchSuggestions(response.data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const renderUserCard = ({item}) => {
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
      console.log('Adding data for patient ID:', item.id);

      navigation.navigate('SelectActivity', {
        patientId: item.id,
        paramKey: {firstName: item.firstName, lastName: item.lastName},
      });
    };

    return (
      <View style={styles.userCard}>
        <TouchableOpacity onPress={toggleExpansion} style={styles.cardHeader}>
          <Text style={styles.userName}>
            {fullNameChars.map((char, index) => {
              const isMatchingChar = searchQuery
                .toLowerCase()
                .includes(char.toLowerCase());
              const highlightStyle = isMatchingChar
                ? {backgroundColor: COLORS.PRIMARY}
                : {};

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
              Phone Number:
              <Text style={styles.userDataValue}>{item.phoneNumber}</Text>
            </Text>

            <Text style={styles.userDataLabel}>
              Date Of Birth:
              <Text style={styles.userDataValue}>
                {formatDate(new Date(item.ageGroup))}
              </Text>
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
              Weight:{' '}
              <Text style={styles.userDataValue}>{item.weight} kgs</Text>
            </Text>

            <Text style={styles.userDataLabel}>
              Height: <Text style={styles.userDataValue}>{item.height} cm</Text>
            </Text>
            <Text style={styles.userDataLabel}>
              Created At:{' '}
              <Text style={styles.userDataValue}>
                {' '}
                {formatDate(new Date(item.createdAt))}
              </Text>
            </Text>
            <View style={styles.line} />
            {item.vaccinations && item.vaccinations.length > 0 && (
              <View>
                <Text style={styles.userDataLabel1}>VACCINATION</Text>
                {item.vaccinations.map((vaccination, index) => (
                  <View key={index}>
                    <Text style={styles.userDataLabel}>
                      Vaccine Name:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.vaccineName}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Date of Vaccination:{' '}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(vaccination.dateOfVaccination))}
                      </Text>
                    </Text>

                    {/* <Text style={styles.userDataLabel}>
                      Dose:
                      <Text style={styles.userDataValue}>
                        {vaccination.vaccinatedBy}
                      </Text>
                    </Text> */}

                    <Text style={styles.userDataLabel}>
                      Card Number:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.units}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Date for Next Dose:{' '}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(vaccination.dateForNextDose))}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Site Administered:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.siteAdministered}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Facility:{' '}
                      <Text style={styles.userDataValue}>
                        {vaccination.facility}
                      </Text>
                    </Text>
                    <View style={styles.line} />

                    <View style={{height: 20}} />
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
                      <Text style={styles.userDataValue}>
                        {antenantal.pregnancyStatus}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Expected Date for Delivery:
                      <Text style={styles.userDataValue}>
                        {formatDate(
                          new Date(antenantal.expectedDateOfDelivery),
                        )}
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
                      <Text style={styles.userDataValue}>
                        {antenantal.bloodGroup}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Current Weight:
                      <Text style={styles.userDataValue}>
                        {antenantal.weight}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Next of Kin:
                      <Text style={styles.userDataValue}>
                        {antenantal.nextOfKin}
                      </Text>
                    </Text>

                    <Text style={styles.userDataLabel}>
                      Next of Kin Contact:
                      <Text style={styles.userDataValue}>
                        {antenantal.nextOfKinContact}
                      </Text>
                    </Text>

                    {antenantal.medicines &&
                      antenantal.medicines.length > 0 && (
                        <View>
                          <Text style={styles.userDataLabel}>MEDICINES</Text>
                          {antenantal.medicines.map((medicine, index) => (
                            <View key={index}>
                              <Text style={styles.userDataLabel}>
                                Medicine Name:
                                <Text style={styles.userDataValue}>
                                  {medicine.name}
                                </Text>
                              </Text>

                              <Text style={styles.userDataLabel}>
                                Additional Notes:
                                <Text style={styles.userDataValue}>
                                  {medicine.description}
                                </Text>
                              </Text>

                              <Text style={styles.userDataLabel}>
                                Dosage:
                                <Text style={styles.userDataValue}>
                                  {medicine.dosage} X {medicine.frequency} for{' '}
                                  {medicine.duration} days
                                </Text>
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                    <View style={styles.line} />
                  </View>
                ))}
              </View>
            )}
            {item.diagnoses && item.diagnoses.length > 0 && (
              <View>
                <Text style={styles.userDataLabel1}>DAIGNOSIS</Text>
                {item.diagnoses.map((diagnosis, index) => (
                  <View key={index}>
                    <Text style={styles.userDataLabel}>
                      Pregnacy Status:{'\t'}
                      <Text style={styles.userDataValue}>
                        {diagnosis.condition}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Signs and Symptoms:{'\t'}
                      <Text style={styles.userDataValue}>
                        {diagnosis.impression}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Labarotorial Tests:{'\t'}
                      <Text style={styles.userDataValue}>
                        {diagnosis.labTests}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Is pregnant?:
                      <Text style={styles.userDataValue}>
                        {diagnosis.isPregnant}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Date of Diagnosis: {'\t'}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(diagnosis.dateOfDiagnosis))}
                      </Text>
                    </Text>
                    <Text style={styles.userDataLabel}>
                      Date for next visit:{'\t'}
                      <Text style={styles.userDataValue}>
                        {formatDate(new Date(diagnosis.followUpDate))}
                      </Text>
                    </Text>
                    {console.log(diagnosis.medicines)}
                    {diagnosis.medicines && diagnosis.medicines.length > 0 && (
                      <View>
                        <Text style={styles.userDataLabel}>MEDICINES</Text>
                        {diagnosis.medicines.map((medicine, medIndex) => (
                          <View key={medIndex}>
                            <Text style={styles.userDataLabel}>
                              Medicine Name:
                              <Text style={styles.userDataValue}>
                                {medicine.name}
                              </Text>
                            </Text>

                            <Text style={styles.userDataLabel}>
                              Additional Notes:
                              <Text style={styles.userDataValue}>
                                {medicine.description}
                              </Text>
                            </Text>

                            <Text style={styles.userDataLabel}>
                              Dosage:
                              <Text style={styles.userDataValue}>
                                {medicine.dosage} X {medicine.frequency} for{' '}
                                {medicine.duration} days
                              </Text>
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={styles.line} />
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity onPress={addData} style={styles.buttonSec}>
              <Text style={styles.buttonText}>Follow Up Patient</Text>
            </TouchableOpacity>
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
      {_header()}
      <View style={styles.container}>
        <Text style={styles.header}>Beneficiary List</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor={COLORS.BLACK}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={fetchUsers}>
            <Icon
              name="search"
              size={20}
              color={COLORS.BLACK}
              style={styles.searchIcon}
            />
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
              keyExtractor={item => item.id.toString()}
              renderItem={renderUserCard}
              contentContainerStyle={styles.flatListContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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

export default PatientList;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  wrapper: {
    flex: 1,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLORS.BLACK,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: COLORS.WHITE,
    elevation: 3,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    borderRadius: 10,
  },
  searchInput: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: COLORS.BLACK,
    fontSize: 16,
  },
  searchIcon: {
    marginHorizontal: 10,
    fontSize: 20,
    color: COLORS.PRIMARY,
  },
  searchSuggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  searchSuggestion: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  searchSuggestionText: {
    color: COLORS.BLACK,
    fontSize: 16,
  },
  noUserFoundText: {
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.BLACK,
    marginTop: 20,
    fontWeight: 'bold',
  },
  userDataLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
    color: COLORS.BLACK,
    paddingHorizontal: 10,
    paddingLeft: 10,
  },
  userDataValue: {
    fontWeight: 'normal',
    fontSize: 15,
    paddingRight: 10,
  },
  userDataLabel1: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.PRIMARY,
  },
  buttonSec: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
    // paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  buttonText: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userDataLabel1: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.PRIMARY,
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

// export default PatientList;
