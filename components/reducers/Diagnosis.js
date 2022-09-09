
export const initialState = {
    diagnoses:[],
    diagnosis:{},
    followup:{}
}

export const reducer = (state, action) => {
    switch(action.type) {
        case 'NEW_DIAGNOSIS':
            return {
                ...state,
                diagnosis
            }
        case 'FOLLOW_UP':
            return {
                ...state,
                followup
            }
        case 'DIAGNOSES':
            return {
                ...state,
                diagnoses
            }
        default:
            return state
    }
}