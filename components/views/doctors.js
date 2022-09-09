import React, {Component} from 'react'
import {View, FlatList,TouchableHighlight, AsyncStorage, Text,StyleSheet, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/Feather';
import {COLORS,DIMENS} from '../constants/styles'
import {users} from '../../test-data/data.json'

export default class Doctors extends Component{

	constructor( props ) {
		super( props )
    }
    
    static navigationOptions = {
        headerStyle:{
            borderBottomWidth: 0,
            elevation:0,
            shadowColor:'transparent',
            backgroundColor:COLORS.PRIMARY,
        }
    }

	render() {
        
        if(typeof users === 'object' && users.length == 0) {

            return(

                <View style={STYLES.container}>
                    <View>
                        <StatusBar
                                backgroundColor={COLORS.PRIMARY}
                                barStyle="light-content"
                            />
                        <Text style={STYLES.textColor}>Doctors loading...</Text>
                    </View>
                </View>

            )

        } else {
            return (
                <View>
                    <FlatList
                        //ItemSeparatorComponent={(Platform.OS !== 'android' && ({highlighted}) ) => (<View style={[style.separator, highlighted && {marginLeft: 0}]} />)}
                        //data={users[{title: 'David Wampamba', key: 'item1'},{title: 'Calvin Were', key: 'item2'},{title: 'Francis Kyambadde', key: 'item3'}]}
                        data={users}
                        
                        renderItem={({user, index, separators}) => (

                            <TouchableHighlight
                                onPress={() => this._moveTo(user.key)}
                                onShowUnderlay={separators.highlight}
                                onHideUnderlay={separators.unhighlight}>
                                <View style={{backgroundColor: 'white'}}>
                                    <Text>{user.title}</Text>
                                </View>
                            </TouchableHighlight>

                        )}
                    />
                </View>
            )
        }
    }
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
