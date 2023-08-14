
export const initialState = {
    diagnoses: [],
    diagnosis: {},
    followup: {}
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'NEW_DIAGNOSIS':
            return {
                ...state,
                diagnosis: action.diagnosis
            }
        case 'FOLLOW_UP':
            return {
                ...state,
                followup: action.followup
            }
        case 'DIAGNOSES':
            return {
                ...state,
                diagnoses: action.diagnoses
            }
        default:
            return state
    }
}