import React, {useEffect, useState, useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, DIMENS} from '../constants/styles';
import Icon from 'react-native-vector-icons/Feather';
import Loader from '../ui/loader';
import CustomHeader from '../ui/custom-header';
import DataResultsContext from '../contexts/DataResultsContext';
import {AuthContext} from '../contexts/auth';
import CopyRight from '../simprints/copyright';




const Profile = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {userNames, patientId} = useContext(DataResultsContext);
  const [counts, setCounts] = useState({
    patientsEnrolledCount: 0,
    patientsEnrolledCountt: 0,
    dailyEnrollmentsCount: 0,
    monthlyEnrollmentsCount: 0,
    weeklyEnrollmentsCount: 0,
    totalVaccinations: 0,
    totalDiagnosis: 0,
    totalAntenatal: 0,
  });
  const {
    patientsEnrolledCount,
    patientsEnrolledCountt,
    dailyEnrollmentsCount,
    monthlyEnrollmentsCount,
    weeklyEnrollmentsCount,
    totalVaccinations,
    totalDiagnosis,
    totalAntenatal,
  } = counts;

  const {user} = useContext(AuthContext);
  useEffect(() => {
    console.log(user);
  });

  const {userLog} = useContext(DataResultsContext);

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={COLORS.BLACK} />
        </TouchableOpacity>
      }
      title={<Text style={[styles.centerHeader, styles.title]}>Profile</Text>}
    />
  );

  const getWeekNumber = () => {
    const currentDate = new Date();
    const target = new Date(currentDate.valueOf());
    target.setDate(target.getDate() - 7);
    const dayNr = (target.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);

    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }

    return 1 + Math.ceil(target.getTime() / (7 * 24 * 60 * 60 * 1000)); // Corrected line
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://mobi-be-production.up.railway.app/patients`,
      );

      if (response.status === 200) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setCounts(prevCounts => ({
          ...prevCounts,
          patientsEnrolledCount: sortedData.length,
        }));

        const currentDate = new Date();

        // Last 30 days filtering
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        const monthlyEnrollments = sortedData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= thirtyDaysAgo && itemDate <= currentDate;
        });
        setCounts(prevCounts => ({
          ...prevCounts,
          monthlyEnrollmentsCount: monthlyEnrollments.length,
        }));

        // Last 7 days filtering
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        const weeklyEnrollments = sortedData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= sevenDaysAgo && itemDate <= currentDate;
        });
        setCounts(prevCounts => ({
          ...prevCounts,
          weeklyEnrollmentsCount: weeklyEnrollments.length,
        }));

        // DAILY ENROLLMENTS count
        const dailyEnrollments = sortedData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return (
            itemDate >= thirtyDaysAgo &&
            itemDate <= currentDate &&
            itemDate.getDate() === currentDate.getDate() &&
            itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear()
          );
        });
        setCounts(prevCounts => ({
          ...prevCounts,
          dailyEnrollmentsCount: dailyEnrollments.length,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVaccinationData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://mobi-be-production.up.railway.app/vaccinations/all`,
      );
  
      if (response.status === 200) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
  
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
  
  
        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);
  
        const monthlyVaccinations = sortedData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });
        
  
        setCounts(prevCounts => ({
          ...prevCounts,
          totalVaccinations: monthlyVaccinations.length,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDiagnosis = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://mobi-be-production.up.railway.app/diagnosis/all`,
      );

      if (response.status === 200) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);

        const monthlyDiagnosis = sortedData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });

        setCounts(prevCounts => ({
          ...prevCounts,
          totalDiagnosis: monthlyDiagnosis.length,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAntenatal = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://mobi-be-production.up.railway.app/antenantals/all`,
      );

      if (response.status === 200) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);

        const monthlyAntenatal = sortedData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });

        setCounts(prevCounts => ({
          ...prevCounts,
          totalAntenatal: monthlyAntenatal.length,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchUsers();
        await fetchVaccinationData();
        await fetchDiagnosis();
        await fetchAntenatal();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <View style={styles.wrapper}>
      {_header()}
      {isLoading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <Text style={styles.header}>General Report</Text>
          <View style={styles.column}>
            <View style={styles.row}>
              <View style={styles.full}>
                <Text style={styles.cardIcon}>{patientsEnrolledCount}</Text>
                <Text style={[styles.cardTitle, {fontSize: 18}]}>
                  Total Patients
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.cardIcon}>{dailyEnrollmentsCount}</Text>
                <Text style={styles.cardTitle}>Daily Enrollments </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardIcon}>{weeklyEnrollmentsCount}</Text>
                <Text style={styles.cardTitle}>Weekly Enrollments </Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.cardIcon}>{monthlyEnrollmentsCount}</Text>
                <Text style={styles.cardTitle}>Month Enrollments </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardIcon}>{totalVaccinations}</Text>
                <Text style={styles.cardTitle}>Monthly Vaccinations </Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.cardIcon}>{totalDiagnosis}</Text>
                <Text style={styles.cardTitle}>Monthly Diagnosis </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardIcon}>{totalAntenatal}</Text>
                <Text style={styles.cardTitle}>Monthly Antenatal </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <CopyRight />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  card: {
    width: 180,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    paddingVertical: 30,
    marginVertical: 10,
    // shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  full: {
    width: 375,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    paddingVertical: 30,
    marginVertical: 10,
    // shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  // column: {marginVertical: 8},
  cardTitle: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.BLACK,
    fontSize: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
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
  cardIcon: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    color: COLORS.PRIMARY,
  },
});
