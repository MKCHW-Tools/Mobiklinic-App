
import { reducerAuth } from "../../reducers/Auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Auth Reducer', () => {

    // Tests that the state object is returned with accessToken, isLoading, and user properties when the action type is 'RESTORE_TOKEN'
    it('should return state object with accessToken, isLoading, and user properties when action type is RESTORE_TOKEN', () => {
        const action = {
            type: 'RESTORE_TOKEN',
            accessToken: 'token',
            user: { name: 'Sangmin Silas' }
        };
        const state = reducerAuth({}, action);
        expect(state).toEqual({
            accessToken: 'token',
            isLoading: false,
            user: { name: 'Sangmin Silas' }
        });
    });

    // Tests that the state object is returned with isSignout, accessToken, isLoading, and user properties when the action type is 'SIGN_IN'
    it('should return state object with isSignout, accessToken, isLoading, and user properties when action type is SIGN_IN', () => {
        const action = {
            type: 'SIGN_IN',
            accessToken: 'token',
            user: { name: 'Sangmin Silas' }
        };
        const state = reducerAuth({}, action);
        expect(state).toEqual({
            isSignout: false,
            accessToken: 'token',
            isLoading: false,
            user: { name: 'Sangmin Silas' }
        });
    });

    // Tests that the state object is returned with isSignout, accessToken, isLoading, and user properties set to null and tokens are removed from AsyncStorage when the action type is 'SIGN_OUT'
    it('should return state object with user properties set to null and tokens are removed from AsyncStorage when action type is SIGN_OUT', async () => {
        AsyncStorage.removeItem = jest.fn();
        const action = {
            type: 'SIGN_OUT'
        };
        const state = await reducerAuth({ accessToken: 'token', user: { name: 'Sangmin Silas' } }, action);
        expect(state).toEqual({
            isSignout: true,
            accessToken: null,
            isLoading: false,
            user: null
        });
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('tokens');
    });

    // Tests that the state object is returned with accessToken, isSignout, and isLoading properties set to null when the action type is 'VERIFY'
    it('should return state object with accessToken, isSignout, and isLoading properties set to null when action type is VERIFY', () => {
        const action = {
            type: 'VERIFY'
        };
        const state = reducerAuth({}, action);
        expect(state).toEqual({
            accessToken: null,
            isSignout: true,
            isLoading: false
        });
    });

    // Tests that the state object passed as an argument is returned when the action type is not recognized
    it('should return the state object passed as an argument when action type is not recognized', () => {
        const action = {
            type: 'UNKNOWN'
        };
        const state = reducerAuth({ accessToken: 'token' }, action);
        expect(state).toEqual({
            accessToken: 'token'
        });
    });

    // Tests that the state object is returned with isLoading property set to false when the action type is 'RESTORE_TOKEN' and accessToken is undefined
    it('should return state object with isLoading property set to false when action type is RESTORE_TOKEN and accessToken is undefined', () => {
        const action = {
            type: 'RESTORE_TOKEN',
            user: { name: 'Sangmin Silas' }
        };
        const state = reducerAuth({}, action);
        expect(state).toEqual({
            isLoading: false,
            user: { name: 'Sangmin Silas' }
        });
    });
});


