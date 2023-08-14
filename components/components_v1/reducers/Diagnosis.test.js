import { reducer } from "../../reducers/Diagnosis";

describe('reducer/Diagnosis', () => {

    // Tests that the state is returned as is when no action is passed
    it('should return the state as is when no action is passed', () => {
        const state = { diagnosis: 'flu', followup: 'next week', diagnoses: [] }
        const action = {}
        expect(reducer(state, action)).toEqual(state)
    });

    // Tests that the state is updated with a new diagnosis when 'NEW_DIAGNOSIS' action is passed
    it('should update the state with a new diagnosis when NEW_DIAGNOSIS action is passed', () => {
        const state = { diagnosis: 'flu', followup: 'next week', diagnoses: [] }
        const action = { type: 'NEW_DIAGNOSIS', diagnosis: 'cold' }
        const expectedState = { diagnosis: 'cold', followup: 'next week', diagnoses: [] }
        expect(reducer(state, action)).toEqual(expectedState)
    });

    // Tests that the state is updated with a follow-up when 'FOLLOW_UP' action is passed
    it('should update the state with a follow-up when FOLLOW_UP action is passed', () => {
        const state = { diagnosis: 'flu', followup: 'next week', diagnoses: [] }
        const action = { type: 'FOLLOW_UP', followup: 'in two weeks' }
        const expectedState = { diagnosis: 'flu', followup: 'in two weeks', diagnoses: [] }
        expect(reducer(state, action)).toEqual(expectedState)
    });

    // Tests that the state is updated with diagnoses when 'DIAGNOSES' action is passed
    it('should update the state with diagnoses when DIAGNOSES action is passed', () => {
        const state = { diagnosis: 'flu', followup: 'next week', diagnoses: [] }
        const action = { type: 'DIAGNOSES', diagnoses: ['cold', 'fever'] }
        const expectedState = { diagnosis: 'flu', followup: 'next week', diagnoses: ['cold', 'fever'] }
        expect(reducer(state, action)).toEqual(expectedState)
    });


    // Tests that the function returns the state as is when an unknown action is passed
    it('should return the state as is when an unknown action is passed', () => {
        const state = { diagnosis: 'flu', followup: 'next week', diagnoses: [] }
        const action = { type: 'UNKNOWN_ACTION' }
        expect(reducer(state, action)).toEqual(state)
    });
});
