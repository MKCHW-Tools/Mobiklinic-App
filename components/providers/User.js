import * as React from 'react'

const UserContext = React.createContext()

const UserProvider = ({children}) => {

    const [accessToken, setAccessToken] = React.useState('')
    const [isRegistering, setIsRegistering] = React.useState('no')
    
    return (
        <UserContext.Provider
            value={{
                accessToken,
                isRegistering,
                setAccessToken,
                setIsRegistering
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext}