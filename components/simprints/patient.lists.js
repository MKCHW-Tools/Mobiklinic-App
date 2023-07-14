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

const PatientLists = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // searching users by name
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isNoUserFound, setIsNoUserFound] = useState(false);
  const {patientId, setPatientId} = useContext(DataResultsContext);

  // user context
  const {userLog} = useContext(DataResultsContext);

  // formate date
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
  // header
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

  // fetch users from api
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://mobi-be-production.up.railway.app/${userLog}/patients`,
      );

      if (response.status === 200) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        const filteredData = sortedData.filter(item => {
          const fullName = `${item.firstName} ${item.lastName}`;
          const fullNameLower = fullName.toLowerCase();
          const searchQueryLower = searchQuery.toLowerCase();

          for (let i = 0; i < searchQueryLower.length; i++) {
            const letter = searchQueryLower[i];
            if (!fullNameLower.includes(letter)) {
              return false;
            }
          }

          return true;
        });

        setUsers(filteredData);
        await AsyncStorage.setItem('patientList', JSON.stringify(filteredData));
        setIsNoUserFound(filteredData.length === 0);
      } else {
        const storedData = await AsyncStorage.getItem('patientList');

        if (storedData) {
          setUsers(JSON.parse(storedData));
        }
      }
    } catch (error) {
      console.error(error);

      const storedData = await AsyncStorage.getItem('patientList');

      if (storedData) {
        setUsers(JSON.parse(storedData));
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
  }, [userLog]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };
  // handle search results
  const handleSearch = async query => {
    setSearchQuery(query);
    try {
      const response = await axios.get(
        `https://mobi-be-production.up.railway.app/search?query=${query}`,
      );
      setSearchSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const [expandedUserId, setExpandedUserId] = useState(null);

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

    // ADD DATA
    const addData = () => {
      setPatientId(item.id); // Set the patientId using setPatientId
      console.log('Adding data for patient ID:', patientId.id);

      navigation.navigate('SelectActivity', {
        patientId: patientId,
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
            <Text style={styles.label}>Sex: {item.sex}</Text>
            <Text style={styles.label}>
              Date Of Birth:
              {formatDate(new Date(item.ageGroup))}
            </Text>
            <Text style={styles.label}>
              Phone Number: {formatPhoneNumber(item.phoneNumber)}
            </Text>
            <Text style={styles.label}>
              Primary Language: {item.primaryLanguage}
            </Text>
            <Text style={styles.label}>Country: {item.country}</Text>
            <Text style={styles.label}>District: {item.district}</Text>
            <Text style={styles.label}>Sex: {item.sex}</Text>
            <Text style={styles.label}>Weight: {item.weight}</Text>
            <Text style={styles.label}>Height: {item.height}</Text>
            <View style={styles.line} />

            {item.vaccinations && item.vaccinations.length > 0 && (
              <View>
                <Text style={styles.userDataLabel1}>VACCINATION</Text>
                {item.vaccinations.map((vaccination, index) => (
                  <View key={index}>
                    <Text style={styles.label}>
                      Vaccination Name: {vaccination.vaccineName}
                    </Text>
                    <Text style={styles.label}>Dosage: {vaccination.dose}</Text>
                    <Text style={styles.label}>
                      Vaccination Date:
                      {formatDate(new Date(vaccination.dateOfVaccination))}
                    </Text>
                    <Text style={styles.label}>
                      Next Dose Date:
                      {formatDate(new Date(vaccination.dateForNextDose))}
                    </Text>
                    <Text style={styles.label}>
                      Site Administered:{vaccination.siteAdministered}
                    </Text>
                    <Text style={styles.label}>
                      Facility: {vaccination.facility}
                    </Text>
                    <Text style={styles.label}>
                      {' '}
                      Card Number: {vaccination.units}
                    </Text>
                    <View style={styles.line} />
                  </View>
                ))}
              </View>
            )}
            {item.antenantals && item.antenantals.length > 0 && (
              <View>
                <Text style={styles.userDataLabel1}>ANTENATAL CARE</Text>
                {item.antenantals.map((antenantal, index) => (
                  <View key={index}>
                    <Text style={styles.label}>
                      Pregnacy Status: {antenantal.pregnancyStatus}
                    </Text>

                    <Text style={styles.label}>
                      Expected Date for Delivery:
                      {formatDate(new Date(antenantal.expectedDateOfDelivery))}
                    </Text>

                    <Text style={styles.label}>
                      Date for routine visit:
                      {formatDate(new Date(antenantal.routineVisitDate))}
                    </Text>

                    <Text style={styles.label}>
                      Blood Group:
                      {antenantal.bloodGroup}
                    </Text>

                    <Text style={styles.label}>
                      Prescriptions:
                      {antenantal.prescriptions}
                    </Text>
                    <Text style={styles.label}>
                      Current Weight:
                      {antenantal.weight}kg
                    </Text>

                    <Text style={styles.label}>
                      Next of Kin:
                      {antenantal.nextOfKin}
                    </Text>

                    <Text style={styles.label}>
                      Next of Kin Contact:
                      {antenantal.nextOfKinContact}
                    </Text>

                    <Text style={styles.label}>
                      Additional Notes:
                      {antenantal.drugNotes}
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
                    <Text style={styles.label}>
                      Condition: {diagnosis.condition}
                    </Text>
                    <Text style={styles.label}>
                      Date Of Diagnosis:
                      {formatDate(new Date(diagnosis.dateOfDiagnosis))}
                    </Text>
                    <Text style={styles.label}>
                      Impression: {diagnosis.impression}
                    </Text>
                    <Text style={styles.label}>
                      Drugs Prescribed: {diagnosis.drugsPrescribed}
                    </Text>
                    <Text style={styles.label}>
                      Dosage: {diagnosis.dosage} X {diagnosis.frequency} for{' '}
                      {diagnosis.duration}
                    </Text>
                    <Text style={styles.label}>
                      Is Pregnant: {diagnosis.isPregnant}
                    </Text>
                    <Text style={styles.label}>
                      Follow Up Date:
                      {formatDate(new Date(diagnosis.followUpDate))}
                    </Text>
                    <Text style={styles.label}>
                      Lab Tests: {diagnosis.labTests}
                    </Text>
                    <View style={styles.line} />
                  </View>
                ))}
              </View>
            )}
            {/* Add the button to add data */}
            <TouchableOpacity onPress={addData} style={styles.buttonSec}>
              <Text style={styles.buttonText}>Add Data</Text>
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
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.BLACK,
  },
  userDataValue: {
    fontWeight: 'normal',
    fontSize: 16,
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

export default PatientLists;
