
import { reducerAuth } from "../../reducers/Auth";

describe('Auth Reducer', () => {

    // Tests that the state object is returned with accessToken, isLoading, and user properties when the action type is 'RESTORE_TOKEN'
    it('should return state object with accessToken, isLoading, and user properties when action type is RESTORE_TOKEN', () => {
        const action = {
            type: 'RESTORE_TOKEN',
            accessToken: 'token',
            user: { name: 'John Doe' }
        };
        const state = reducerAuth({}, action);
        expect(state).toEqual({
            accessToken: 'token',
            isLoading: false,
            user: { name: 'John Doe' }
        });
    });

    // Tests that the state object is returned with isSignout, accessToken, isLoading, and user properties when the action type is 'SIGN_IN'
    it('should return state object with isSignout, accessToken, isLoading, and user properties when action type is SIGN_IN', () => {
        const action = {
            type: 'SIGN_IN',
            accessToken: 'token',
            user: { name: 'John Doe' }
        };
        const state = reducerAuth({}, action);
        expect(state).toEqual({
            isSignout: false,
            accessToken: 'token',
            isLoading: false,
            user: { name: 'John Doe' }
        });
    });

});