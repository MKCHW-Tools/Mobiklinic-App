import React, {Component} from "react";
import { View, StyleSheet } from "react-native";
import {COLORS} from '../constants/styles'

const CustomHeader = (props) => {

    const {left,title, right} = props

    if(left && right && title) {
      return (
        <View style={[STYLES.wrapper]}>
          {left}
          {title}
          {right}
        </View>
      )

    } else if(left && title && !right ) {

      return (
        <View style={[STYLES.wrapper]}>
          {left}
          {title}
        </View>
      )

    } else if(left && !title && !right ) {

      return (
        <View style={[STYLES.wrapper]}>
          {left}
        </View>
      ) 
    } else if(!left && title && !right ) {

        return (
          <View style={[STYLES.wrapper]}>
            {title}
          </View>
        )

    } else if(!left && !title && right ) {
      return (
        <View style={[
          STYLES.wrapper,
          STYLES.right
        ]}>
          {right}
        </View>
      )

  }

  return (
    <View style={[STYLES.wrapper]}>
      <View></View>
    </View> 
  )
}

const STYLES = StyleSheet.create({
    wrapper: {
      backgroundColor: COLORS.WHITE,
      flexDirection:'row',
      paddingTop:5,
      paddingBottom:5,
      alignItems:'center',
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderBottomColor: COLORS.GREY
    },
    rightAlign : {
      justifyContent:'flex-end'
    }
})

export default CustomHeader;