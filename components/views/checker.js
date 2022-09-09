import React, {Component} from 'react'
import {View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableNativeFeedback} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

export default class Check extends Component{
	constructor( props ) {
		super( props )
		this.state = {
			ticketNumber: '',
			valid: '',
			used: '',
			invalid: '',
			showLoader: false,
			status:'',
			showError:false
		}
	}
	 
	_checkTicket = () => {
		let ticket = this.state.ticketNumber
		this.setState({showLoader: true})

		this.setState({used:''})
		this.setState({invalid:''})
		this.setState({valid:''})
		if( ticket != '' && ticket !== 'undefined' ){
			fetch( `https://gagawala.com/api/outbound?method=get_ticket&ticket=${ticket}`).then( (response) => response.json() )
			.then( ( res ) => {
			
				if(res.result == 'success' ) {
					if( res.status == '1' ){
						this.setState({showError:false})
						this.setState({showLoader:false})
						this.setState({used:''})
						this.setState({invalid:''})
						this.setState({valid:res.msg})
					}
					else if( res.status == '2' ){
						this.setState({showError:false})
						this.setState({showLoader:false})
						this.setState({valid:''})
						this.setState({used:res.msg})
						this.setState({invalid:''})
					}
					else if( res.status == '3' ){
						this.setState({showError:false})
						this.setState({showLoader:false})
						this.setState({valid:''})
						this.setState({used:''})
						this.setState({invalid:res.msg})
					}
					else{
						this.setState({showError:false})
						this.setState({showLoader:false})
						this.setState({valid:''})
						this.setState({used:''})
						this.setState({invalid:'Something'})
					}
				}
			})
			.catch((error) => {
				this.setState({showError:false})
				this.setState({showLoader: false})
				this.setState({valid:''})
				this.setState({used:''})
				this.setState({invalid:'Connection error'})
			})
		}
		else{
			this.setState({showLoader: false })
			this.setState({valid:''})
			this.setState({used:''})
			this.setState({invalid:''})			
			this.setState({showError:true})
		}
	}

	static navigationOptions = {
		header:null
	}

	render(){

		let error_message = ( this.state.showError ) ? 'Enter a ticket number':''

		return(
			<View>
				<View style={styles.container}>
					
					<View  style={styles.row1}>

						<Spinner visible={this.state.showLoader} textContent={"Validating..."} overlayColor="rgba(193,40,45, 0.9)" textStyle={{color: '#FFF'}} />
						<Text style={[styles.valid,styles.status]}>{this.state.valid}</Text>	
						<Text style={[styles.invalid, styles.status]}>{this.state.invalid}</Text>
						<Text style={[styles.used,styles.status]}>{this.state.used}</Text>

					</View>

					<View style={styles.row2}>
						<Text style={{color:'#C1282D', marginBottom:5, textAlign:'center' }}>{error_message}</Text>
						<TextInput style={[styles.inputMargin]}
							onChangeText={(ticketNumber) => this.setState({ticketNumber})}
							value={this.state.ticketNumber}
							autoCorrect={false}
							underlineColorAndroid='#DDDAD7'
							placeholder='Enter Ticket Number'
							keyboardType='numeric'
						/>
	
					</View>
					<View style={styles.row3}>

						<TouchableNativeFeedback
							style={styles.submit}
							onPress={this._checkTicket.bind(this)}
							background={TouchableNativeFeedback.SelectableBackground()}>

							<View style={styles.submit}>
								<Text style={styles.submitText}>CHECK</Text>
							</View>
						</TouchableNativeFeedback>

					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	color:{
		color: '#fff'
	},
	container: {
		flexDirection:'column',
		height: '100%'
	},
	btn:{
		padding: 20,
		borderRadius: 0
	},
	row1: {
		flex:4,
		padding:10,
		justifyContent:'center',
		alignItems:'center'
	},
	row2: {
		flex:2,
		padding:10,
	},
	row3: {
		flex:1,
		justifyContent:'flex-end',
	},
	inputMargin:{
		marginBottom:10
	},
	status:{
		textAlign:'center',
		textAlignVertical:'center',
		fontWeight:'bold',
		fontSize: 40
	},
	loading:{
		color: '#7f8c8d',
		textAlign:'center',
		paddingTop:15
	},
	invalid:{
		color: '#e74c3c'
	},
	valid:{
		color: '#2ecc71'
	},
	used:{
		color: '#f39c12'
	},
	submit:{
		marginTop:10,
		backgroundColor:'#C1282D',
	},
	submitText:{
		color:'#fff',
		textAlign:'center',
		paddingTop:15,
		paddingBottom:15
	}
})

