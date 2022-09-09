export const initialStateAuth =  {
  isLoading: true,
  isSignout: false,
  accessToken: null,
}

export const reducerAuth = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          accessToken: action.accessToken,
          isLoading: false,
        }
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          accessToken: action.accessToken,
        }
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          accessToken: null,
        }
      case 'VERIFY':
        return {
          ...prevState,
          accessToken: null,
          isSignout: true,
        }
      
    }
}