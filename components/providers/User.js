import * as React from "react";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
	const [accessToken, setAccessToken] = React.useState("");
	const [user, setUser] = React.useState({});
	const [isRegistering, setIsRegistering] = React.useState("no");

	return (
		<UserContext.Provider
			value={{
				accessToken,
				isRegistering,
				user,
				setUser,
				setAccessToken,
				setIsRegistering,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export { UserProvider, UserContext };
