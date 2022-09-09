import * as React from 'react'
import Icon from 'react-native-vector-icons/Feather'
import {COLORS, DIMENS} from '../constants/styles'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native'

const Tips = ({navigation}) => {
    return (
        <View style={STYLES.container}>
            <TouchableOpacity
                style={STYLES.leftHeader}
            >
                <Icon
                    name="menu"
                    size={25}
                    color={COLORS.WHITE}
                    onPress={() => navigation.openDrawer()}
                />
            </TouchableOpacity>
            <Text style={[STYLES.whiteText,STYLES.heading]}>General Health Tips</Text>
            <Text style={STYLES.whiteText}>Coming soon. Check back later</Text>
            <Text style={STYLES.whiteText}>Stay safe.</Text>
        </View>
    )
}

const STYLES = StyleSheet.create({

    leftHeader :{
        position:'absolute',
        top: 10,
        right: 10,
        backgroundColor: COLORS.ACCENT_1,
        borderRadius: 50,
        padding: 4,
        width: 40,
        height: 40,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.BLACK,
        shadowOffset:{
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.40,
        shadowRadius: 1.41,
        elevation: 2,
    },
    container: {
        flex:1,
        backgroundColor: COLORS.PRIMARY,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'center'
    },
    heading: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    whiteText: {
        color: COLORS.WHITE
    }
})

export default Tips

