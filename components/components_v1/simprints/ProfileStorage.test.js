import { getProfileUUID } from "../../simprints/ProfileStorage";
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('getProfileUUID', () => {

    // Tests that the function successfully retrieves the profile UUID from AsyncStorage and returns it
    it('should retrieve and return the profile UUID from AsyncStorage', async () => {
        // Mock AsyncStorage.getItem to return a valid UUID
        AsyncStorage.getItem = jest.fn().mockResolvedValue('validUUID');

        const result = await getProfileUUID();

        expect(result).toBe('validUUID');
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('profileUUID');
    });

    // Tests that the function returns null if the profile UUID is not found in AsyncStorage
    it('should return null when the profile UUID is not found in AsyncStorage', async () => {
        // Mock AsyncStorage.getItem to return null
        AsyncStorage.getItem = jest.fn().mockResolvedValue(null);

        const result = await getProfileUUID();

        expect(result).toBeUndefined();
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('profileUUID');
    });

    // Tests that the function logs an error message if AsyncStorage throws an error
    it('should log an error message when AsyncStorage throws an error', async () => {
        // Mock AsyncStorage.getItem to throw an error
        AsyncStorage.getItem = jest.fn().mockRejectedValue(new Error('AsyncStorage error'));

        const consoleSpy = jest.spyOn(console, 'log');

        await getProfileUUID();

        expect(consoleSpy).toHaveBeenCalledWith('Error retrieving profile UUID:', new Error('AsyncStorage error'));
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('profileUUID');
    });

    // Tests that the function returns undefined if no profile UUID is found in AsyncStorage
    it('should return undefined when no profile UUID is found in AsyncStorage', async () => {
        // Mock AsyncStorage.getItem to return undefined
        AsyncStorage.getItem = jest.fn().mockResolvedValue(undefined);

        const result = await getProfileUUID();

        expect(result).toBeUndefined();
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('profileUUID');
    });

    // Tests that the function handles an empty string as a valid profile UUID
    it('should handle an empty string as a valid profile UUID', async () => {
        // Mock AsyncStorage.getItem to return an empty string
        AsyncStorage.getItem = jest.fn().mockResolvedValue('');

        const result = await getProfileUUID();

        expect(result).toBe('');
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('profileUUID');
    });

    // Tests that the function handles special characters in the profile UUID
    it('should handle special characters in the profile UUID', async () => {
        // Mock AsyncStorage.getItem to return a profile UUID with special characters
        AsyncStorage.getItem = jest.fn().mockResolvedValue('!@#$%^&*()');

        const result = await getProfileUUID();

        expect(result).toBe('!@#$%^&*()');
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('profileUUID');
    });
});
