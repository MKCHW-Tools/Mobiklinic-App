import * as React from 'react'

import { 
    View, 
    Linking,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
    StatusBar
} from 'react-native'

import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather'

import {
    COLORS,
    DIMENS
} from '../constants/styles'

import {health} from '../../test-data/data.json'
import CustomHeader from '../parts/custom-header'

const Health = ({navigation}) => {

    const [state, setState ] = React.useState({data:[]})
   
    React.useEffect(()=>{
        setState({data: health})

    },[])

    _keyExtractor = (item,index) => index.toString()

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${item.msdn}`)}
            >
                <ListItem

                    title={
                        <Text style={STYLES.listTitle}>{item.name}</Text>
                    }

                    subtitle={(

                        <View style={STYLES.wrapper}>
                            <View style={STYLES.subtitle}>
                                <Text style={STYLES.label}>Specilisation</Text><Text>{item.specialisation}</Text>
                            </View>
                            <View style={STYLES.subtitle}>
                                <Text style={STYLES.label}>Hospital</Text><Text>{item.hospital}</Text>
                            </View>
                            <View style={STYLES.subtitle}>
                                <Text style={STYLES.label}>District</Text><Text>{item.district}</Text>
                            </View>
                            <View style={STYLES.subtitle}>
                                <Text style={STYLES.label}>Languages</Text><Text>{item.languages}</Text>
                            </View>
                        </View>

                    )}
                    leftAvatar={
                        <Icon
                            name="circle"
                            size={25}
                            color={(item.status ==1 ? 'green' : item.status == 2 ? COLORS.PRIMARY :'#f00')}
                        />                        
                    }
                    rightAvatar= {
                        <Icon
                            name="phone"
                            size={25}
                            color='rgba(0,0,0,.3)'
                        />
                    }
                    bottomDivider={true}
                />  
            </TouchableOpacity>
        )
    }
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
                        color={COLORS.SECONDARY}
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
                    Health Info
                </Text>
            }

            right={
                <TouchableOpacity
                    style={{paddingRight:10}}
                >
                    <Icon
                        name="heart"
                        size={25}
                        color={COLORS.SECONDARY}
                    />
                </TouchableOpacity>
            }
        />
    )

    let {data} = state

    return(

        <View style={STYLES.wrapper}>
            {_header()}
            <View style={STYLES.body}>
                <StatusBar
                        backgroundColor={COLORS.PRIMARY}
                        barStyle="light-content"
                />
                <Icon
                    name="smile"
                    size={60}
                    color={COLORS.GREY}
                />
                <Text style={STYLES.textColor}>Health info not available.</Text>
            </View>
        </View>

    )
}


const STYLES = StyleSheet.create({
    wrapper : {
        flex:1,
        backgroundColor:COLORS.SECONDARY,
    },
    header : {
        flex:1,
    },
    body : {
        flex:2,
        justifyContent:'center',
        alignItems:'center',
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
    listTitle: {
        fontSize:16,
        fontWeight:'bold'
    },
    subtitle : {
        flexDirection:'row',
        fontSize:10,
        opacity:0.5
    },
    label : {
        fontWeight:'bold',
        marginRight: 5,
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

export default Health