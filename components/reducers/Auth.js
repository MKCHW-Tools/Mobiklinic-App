import AsyncStorage from "@react-native-async-storage/async-storage";

export const initialStateAuth = {
	isLoading: true,
	isSignout: false,
	accessToken: null,
	user: null,
};

export const reducerAuth = (state, action) => {
	switch (action.type) {
		case "RESTORE_TOKEN":
			return {
				accessToken: action.accessToken,
				isLoading: false,
				user: action.user,
			};
		case "SIGN_IN":
			return {
				isSignout: false,
				accessToken: action.accessToken,
				isLoading: false,
				user: action.user,
			};
		case "SIGN_OUT":
			AsyncStorage.removeItem("tokens");
			return {
				isSignout: true,
				accessToken: null,
				isLoading: false,
				user: null,
			};
		case "VERIFY":
			return {
				accessToken: null,
				isSignout: true,
				isLoading: false,
			};
		default:
			return state;
	}
};
