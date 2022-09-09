import * as React from 'react'
import {
    View,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet, 
    StatusBar,ScrollView
} from 'react-native'

import { ListItem } from 'react-native-elements'

import Icon from 'react-native-vector-icons/Feather'
import { 
    COLORS,
    DIMENS
} from '../constants/styles'

import Loader from '../ui/loader'

import {DiagnosisContext} from '../providers/Diagnosis'

import CustomHeader from '../ui/custom-header'
import { _removeStorageItem } from '../helpers/functions'

const ViewDiagnosis = ({route, navigation}) => {

    const [state, setState] = React.useState({
        isLoading: true,
        diagnosis:{}
    })

    const diagnosisContext = React.useContext(DiagnosisContext)
    const {diagnoses} = diagnosisContext

    const _keyExtractor = (item, index) => index.toString()

    const _renderItem = ({item}) => {
        return (
            <TouchableOpacity>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title style={STYLES.listTitle}>
                            {item.details}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron size={30} />
                </ListItem>
            </TouchableOpacity>
        )
    }

    const _header = () => {

        const {code} = state.diagnosis
        
        return <CustomHeader
                        
            left={
                <TouchableOpacity
                    style={{
                        marginHorizontal:4,
                        width: 35,
                        height: 35,
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                    onPress={()=> navigation.goBack()}
                >
                    <Icon
                        name="arrow-left"
                        size={25}
                        color={COLORS.BLACK}
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
                    Diagnosis {code}
                </Text>
            }

            right={
                <TouchableOpacity
                    onPress={()=> navigation.navigate('FollowUp', {item: code })}
                    style={{
                        marginHorizontal:4,
                        width: 35,
                        height: 35,
                        borderRadius: 100,
                        backgroundColor: COLORS.BLACK,
                        borderColor:COLORS.BLACK,
                        borderStyle:'solid',
                        borderWidth:1,
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                >
                    <Icon
                        name="plus"
                        size={25}
                        color={COLORS.WHITE}
                    />
                </TouchableOpacity>
            }

        />
        }

    React.useEffect(()=> {
        getDiagnosis()
    },[])
    
    const getDiagnosis = async () => {

        try {
            const {code} = route.params
            const diagnosis = diagnoses.filter( _diagnosis => _diagnosis.code == code)[0]
            setState({...state, diagnosis, isLoading: false})

        } catch (err) {
            throw err
        }
    }

    const {
        isLoading,
        code,
        msdn,
        gender,
        age_group,
        condition,
        isPregnant,
        followups 
    } = state.diagnosis

    if(isLoading) return <Loader />

    return(
        <View style={STYLES.wrapper}>
            <StatusBar
                backgroundColor={COLORS.WHITE}
                barStyle="dark-content"
            />

            {_header()}

            <View style={STYLES.body}>
                <FlatList
                    style={{paddingHorizontal:10}}
                    data={followups}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    ListHeaderComponent={
                        <>
                             {msdn != '' &&
                                <View style={{paddingBottom:10}}>
                                    <Text style={{fontWeight:'bold'}}>Phone</Text><Text>{msdn}</Text>
                                </View>
                            }
                            <View style={{paddingBottom:10}}>
                                <Text style={{fontWeight:'bold'}}>Gender </Text><Text>{gender}</Text>
                            </View>
                            <View style={{paddingBottom:10}}>
                                <Text style={{fontWeight:'bold'}}>Age group </Text><Text>{age_group}</Text>
                            </View>
                            <View style={{paddingBottom:10}}>
                                <Text style={{fontWeight:'bold'}}>Condition</Text>
                                <Text>{condition}</Text>
                            </View>
                            {
                                gender == 'Female' &&
                                <View style={{paddingBottom:10}}>
                                    <Text style={{fontWeight:'bold'}}>Pregnant?</Text><Text>{isPregnant == false ? 'No' : 'Yes'}</Text>
                                </View>
                            }
                            <Text style={STYLES.followupsHeader}>Follow ups </Text>
                        </>

                    }
                />
            </View>
        </View>
    )
}
    
export default ViewDiagnosis

const STYLES = StyleSheet.create({
    wrapper : {
        flex:1,
        backgroundColor: COLORS.SECONDARY,
    },
    header : {
        flex:1,
    },
    body : {
        borderRadius: 10,
        backgroundColor: COLORS.WHITE
    },
    subtitle : {
        flexDirection:'row',
        fontSize:10,
        color: COLORS.GREY
    },
    label : {
        fontWeight:'bold',
        marginLeft: 5,
        marginRight:5
    },
    title: {
        fontWeight:'bold',
        color:COLORS.SECONDARY,
        alignItems:'center'
    },
    followupsHeader: {
        fontWeight: 'bold',
        padding: DIMENS.PADDING,
        textTransform:'uppercase',
        backgroundColor: COLORS.GREY
    },
    followupsTitle: {
        padding: DIMENS.PADDING,
        backgroundColor: COLORS.GREY_LIGHTER,
        borderWidth:1,
        borderStyle:'solid',
        borderColor: COLORS.GREY,
        padding: DIMENS.PADDING,
    },
    followupsBody: {
        borderWidth:1,
        borderTopWidth: 0,
        borderStyle:'solid',
        borderColor: COLORS.GREY,
        padding: DIMENS.PADDING,
    },
    mutedText: {
        color: COLORS.GREY
    },
    leftHeader:{
        marginLeft:10,
        flex:1
    },
    centerHeader: {
        flex:2,
        alignItems:'center'
    },
    rightHeader: {
        paddingRight:10
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
        height: 50,
        marginTop: 10,
        justifyContent: 'center',
        alignItems:'center',
        flexDirection: 'row',
        color: COLORS.SECONDARY
    },
    btnText: {
        color: COLORS.SECONDARY,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    icon: {
        marginLeft: 10
    },
    btnSubmit: {
        flexDirection:'row',
        margin: 15,
        backgroundColor: COLORS.BLACK,
        width: 40,
        height: 40,
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        justifyContent: 'center',
        alignItems:'center',
        alignSelf: 'flex-end',
        position: 'absolute',
        zIndex: 9999999
    }
})
