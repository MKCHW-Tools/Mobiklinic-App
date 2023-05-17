import * as React from 'react'

import {
    View, 
    TouchableOpacity,
    Text, 
    StyleSheet,
    StatusBar
} from 'react-native'

import Icon from 'react-native-vector-icons/Feather'

import {
    COLORS,
    DIMENS
} from '../constants/styles'

import CustomHeader from '../parts/custom-header'

const Settings = ({navigation}) => {

    /*static navigationOptions = () => {
        return {
            headerStyle: {
                backgroundColor: COLORS.SECONDARY,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                marginTop: (Platform.OS === 'ios') ? 0 : 2
            },
            headerTintColor: COLORS.BLACK ,
                headerRight: (
                <TouchableOpacity
                    onPress = {_save()}
                    style={{paddingRight:10}}
                >
                    <Icon
                        name="check"
                        size={25}
                        color={COLORS.SECONDARY}
                    />
                </TouchableOpacity>
            ),
        }     
    }
    */

    _header = () => (
        <CustomHeader
                        
            left={
                <TouchableOpacity
                    style={{paddingLeft:10}}
                    onPress={()=>this.props.navigation.openDrawer()}
                >
                    <Icon
                        name="menu"
                        size={25}
                        // color={COLORS.SECONDARY}
                    />
                </TouchableOpacity>
            }

            title={
                <Text
                    style={[
                        STYLES.centerHeader,
                        STYLES.title
                    ]}
                >
                    Settings
                </Text>
            }

            right={
                <TouchableOpacity
                    style={{paddingRight:10}}
                >
                    <Icon
                        name="settings"
                        size={25}
                        // color={COLORS.SECONDARY}
                    />
                </TouchableOpacity>
            }
        />
    )
        
    return(

        <View style={STYLES.wrapper}>
            <StatusBar
                backgroundColor={COLORS.SECONDARY}
                barStyle="dark-content"
            />
            {_header()}
            <View style={STYLES.body}>

                <Icon
                    name="sliders"
                    size={60}
                    color={COLORS.GREY}
                />

                <Text style={[STYLES.alert,STYLES.heading]}>Reminers</Text>
                <Text style={[STYLES.alert,STYLES.desc]}>Be reminded about</Text>

                <Text style={STYLES.alert}>Workouts</Text>
                <Text style={STYLES.alert}>Meals</Text>
                <Text style={STYLES.alert}>Sleeping</Text>
                <Text style={STYLES.alert}>Meditation </Text>
                <Text style={STYLES.alert}>Medication </Text>

                <Text style={[STYLES.alert,STYLES.heading]}>Notifications</Text>
                <Text style={[STYLES.alert,STYLES.desc]}>Choose the type of notifications and how you want to be notified</Text>

                <Text style={STYLES.alert}>Sounds or Vibration</Text>
                <Text style={STYLES.alert}>Health tips</Text>
                <Text style={STYLES.alert}>Health events.</Text>

            </View>

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
    },
    wrapper : {
        flex:1,
        backgroundColor:COLORS.SECONDARY,
    },
    body : {
        flex:2,
        justifyContent:'center',
        alignItems:'center',
    },
    heading:{
        fontWeight:'bold'
    },
    desc: {
        fontStyle:'italic',
        marginTop:5,
        marginBottom: 10
    },
    title: {
        fontWeight:'bold',
        color:COLORS.SECONDARY,
        textAlign:'center'
    },
    alert : {
        color: COLORS.GREY,
        textAlign:'center',
        marginTop:15,
    },
    leftHeader:{
        flex:1,
        paddingLeft:10
    },
    centerHeader: {
        flex:2,
        flexDirection:'row'
    },
    rightHeader: {
        flex: 1,
        flexDirection:'row',
        justifyContent:'flex-end'
    }
})

export default Settings