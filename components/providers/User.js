import * as React from "react";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
	const [accessToken, setAccessToken] = React.useState({});
	const [user, setUser] = React.useState({});
	const [isRegistering, setIsRegistering] = React.useState('no');

	const value = React.useMemo(() => ({
		accessToken,
		isRegistering,
		user,
		setUser,
		setAccessToken,
		setIsRegistering,
	}), [accessToken, isRegistering, user]);

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};

export { UserProvider, UserContext };
