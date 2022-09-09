import * as React from 'react'
import {
    View, 
    TouchableHighlight,
    Text,
    StyleSheet,
    StatusBar 
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather';
import {
    COLORS,
    DIMENS
} from '../constants/styles'

const Profile = ({navigation}) => {

    return (
        <View>
            <Text>Member Profile</Text>
        </View>
    )
}

const STYLES = StyleSheet.create({
	textColor:{
		color: COLORS.PRIMARY
	},
	container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
		flexDirection:'column',
		height: '100%',
		backgroundColor:COLORS.SECONDARY,
	}
})

export default Profile