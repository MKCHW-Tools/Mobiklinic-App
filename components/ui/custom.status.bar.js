import React from 'react'
import {StatusBar} from 'react-native'
import {COLORS} from '../constants/styles'

export const CustomStatusBar = () => {
    return <StatusBar
        backgroundColor={COLORS.WHITE}
        barStyle="dark-content"
    />
}

