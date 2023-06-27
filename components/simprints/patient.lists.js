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

  const {userLog} = useContext(DataResultsContext);

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
            <Text style={styles.label}>Sex: {item.sex}</Text>
            <Text style={styles.label}>Age Group: {item.ageGroup}</Text>
            <Text style={styles.label}>
              Phone Number: {formatPhoneNumber(item.phoneNumber)}
            </Text>
            <Text style={styles.label}>
              Primary Language: {item.primaryLanguage}
            </Text>

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
                      Card Number: {vaccination.units}
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
});

export default PatientLists;
