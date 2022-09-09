/* import * as React from 'react'
import SplashScreen from 'react-native-splash-screen'

import {
	createStackNavigator,
	createAppContainer
} from 'react-navigation'

import Home from './views/home'
import Login from './views/forms/login'
import signUp from './views/forms/signup'
import Doctors from './views/doctors'
import Tabs from './config/tabs'
import {COLORS} from './constants/styles'

const AppNavigation = createStackNavigator({

	Home: Home,
	Login: Login,
	signUp: signUp,
	Doctors: Doctors,
	
    Tabs: {
        screen: Tabs,
        defaultNavigationOptions: {
			headerLeft: null,
            headerStyle:{
				borderBottomWidth: 0,
				elevation:0,
				shadowColor:'transparent',
                backgroundColor:COLORS.PRIMARY,
            }
        }
    }
})

const AppCreateAppContainer = createAppContainer(AppNavigation)

const Splash = () => {

  React.useEffect(() => {
    SplashScreen.hide()
  })

  return <AppCreateAppContainer/>

}

export default Splash */