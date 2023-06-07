// ProfileStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storing the profile UUID
<<<<<<< HEAD
export const storeProfileUUID = async (uuid) => {
=======
export const storeProfileUUID = async uuid => {
>>>>>>> d033f5045d124de8b0ec64a0fa54b4c1061d1c0b
  try {
    await AsyncStorage.setItem('profileUUID', uuid);
    console.log('Profile UUID stored successfully.');
  } catch (error) {
    console.log('Error storing profile UUID:', error);
  }
};

// Retrieving the profile UUID
export const getProfileUUID = async () => {
  try {
    const uuid = await AsyncStorage.getItem('profileUUID');
    if (uuid !== null) {
      console.log('Profile UUID:', uuid);
      return uuid;
    }
  } catch (error) {
    console.log('Error retrieving profile UUID:', error);
  }
};
