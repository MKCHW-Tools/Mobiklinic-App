import * as React from 'react'
import {
  StyleSheet, 
  View, 
  ActivityIndicator,
  StatusBar
} from  'react-native'

import {COLORS} from '../constants/styles'

const Loader = (props) => {
  return (
    <View style={styles.loader}>
      <StatusBar
        backgroundColor={COLORS.PRIMARY}
        barStyle="dark-content"
      />
      <ActivityIndicator
        color={COLORS.ACCENT_1}
        size={'large'}
      />
        {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
    loader: {
      flex:1,
      backgroundColor:COLORS.PRIMARY,
      flexDirection: 'column',
      justifyContent:'center',
      alignItems: 'center'
    }
})

export default Loader