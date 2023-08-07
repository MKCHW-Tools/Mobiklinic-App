import * as React from "react";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
    //The accessToken was initilly assinged empty object, rather than null. This might lead type error
	const [accessToken, setAccessToken] = React.useState(null);
    //The user was initally set to empty object: it could lead to type erros and also a user who's login could have empty object
	const [user, setUser] = React.useState(null);
    //String Was intially used, rather then stating the state to False (Boolean reduces the risk of bufs caused by type mismatches)
	const [isRegistering, setIsRegistering] = React.useState(false);


    //object Litteral as prob vs useMemo: useMemo is Less re-rendering
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
