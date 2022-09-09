import React, {Component} from 'react';
import {View, Text, StyleSheet } from 'react-native';

export default class Info extends Component{
	render(){
		return(
			<View style={styles.wrapper}>
				<Text>App by Gagawala Graphics Ltd.</Text>
				<Text>Need help help</Text>
				<Text>Call 0704255401</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper:{
		margin: 20
	},
})