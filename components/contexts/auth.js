import * as React from "react";
export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
	const [isLoading, setIsLoading] = React.useState(false);
	const [user, setUser] = React.useState(null);
	const [tokens, setTokens] = React.useState(null);
	return (
		<AuthContext.Provider
			value={{
				isLoading,
				setIsLoading,
				user,
				setUser,
				tokens,
				setTokens,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
