import React, {Component} from 'react';
import {View, Text, StyleSheet } from 'react-native';

export default class Stats extends Component{

	render(){
		return(
			<View style={styles.wrapper}>
				<Text>Stats</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper:{
		margin: 20
	}
})