import React, {createContext, useState} from 'react';

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);

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
