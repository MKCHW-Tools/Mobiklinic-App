import * as React from 'react'
import {
    View, 
    Text,
    StyleSheet
} from 'react-native'

import Icon from 'react-native-vector-icons/Feather';
import {COLORS, DIMENS} from '../constants/styles'

const Result = (props) => {
    return (
        <View style={styles.container}>
            {/* {props.type == 'success' ? <Text>Success</Text> : <Text>Failure</Text>} */}
            {props.type == 'success' ? <Icon name="check-circle" size={100} color="#900" />: <Icon name="check-circle" size={100} color="#900" />}
            {props.children}
        </View>
    )
}

export default Result

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:COLORS.BACKGROUND,
        paddingHorizontal: DIMENS.PADDING
    }
})

