import React, {Component} from 'react'
import {View, AsyncStorage, Text, TextInput,StyleSheet, StatusBar,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {COLORS,DIMENS} from '../../constants/styles'
import {URLS} from '../../constants/API'
import {users} from '../../../test-data/data.json'

export default class Login extends Component {

	constructor( props ) {
		super( props )

		this.state = {
			username: '',
			password:'',
			showError:false,
			loggedIn:false,
			users:'',
			msg:''
		}
	}
	
	_doLogin() {
		this.setState({msg:''})
		const {username,password} = this.state

		if( password != undefined || username != undefined ) {
			if ( password.length > 0 && username.length > 0 ) {
				if( users != '' ) {
					

					if ( typeof users != 'undefined' && users.length > 0 ) {

						users.forEach( USER => {
							if( USER.msdn == username && USER.pin == password ) {
								this.setState({showError: false})
								this.setState({loggedIn:true})
								this.setState({msg:''})
								this._moveTo( 'Doctors' )
							} else {
								this.setState({showError: true})
								this.setState({msg: `Wrong username/password`})

							}
						})

					} else {
						this.setState({msg:`App can't find user`})
					}

				} else {

					fetch( URLS.BASE, {
						'username':username,
						'password':password
					}).then( response => {
						console.log( response)
					}).catch( error => {
						console.error( error )
					})

				}
 
			} else {
				this.setState({msg:`Username and password required`})
			}
		} else {
			this.setState({msg:`Username and password required`})
		}
	}

	_moveTo( screen ) {

		this.props.navigation.navigate( screen )
	}
	
	static navigationOptions = {
		header: null
	}

	render(){
		const {msg,username,password} = this.state
		return(
				<View style={styles.container}>

					<StatusBar
						backgroundColor={COLORS.PRIMARY}
						barStyle="light-content"
					/>

					<View style={styles.logoContainer}>
						<Icon name="user" size={120} color={COLORS.SECONDARY} />
						<Text style={styles.title}>MobiClinic</Text>
						<Text style={styles.subTitle}>Sign in</Text>
					</View>

					<View style={styles.formContainer}>
						<View>
							<Text style={styles.errorMsg}>{msg}</Text>
						</View>
						<View>
							
							<TextInput style={styles.input}
								autoCorrect={false}
								underlineColorAndroid={COLORS.WHITE_LOW}
								placeholderTextColor={COLORS.WHITE_LOW}
								selectionColor={COLORS.SECONDARY}
								onChangeText={( username ) => this.setState( {username} )}
								value={username}
								placeholder='E-mail or Phone number'
							/>

							<TextInput style={styles.input}
								password={true}
								secureTextEntry={true}
								autoCorrect={false}
								underlineColorAndroid={COLORS.WHITE_LOW}
								placeholderTextColor={COLORS.WHITE_LOW}
								selectionColor={COLORS.SECONDARY}
								onChangeText={( password ) => this.setState( {password} )}
								value={password}
								placeholder='Password'
							/>

							<TouchableOpacity
								style={styles.submit}
								onPress={ () => this._doLogin() }
							>
								<Text style={styles.submitText}>Sign In</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={ () => this._moveTo( 'signUp' ) }
							>
								<Text style={[styles.textColor,styles.linkItem]}>or, sign up</Text>
							</TouchableOpacity>

						</View>

					</View>
				</View>
		)
		
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:COLORS.PRIMARY,
		paddingLeft:DIMENS.FORM.PADDING,
		paddingRight:DIMENS.FORM.PADDING,
	},
	logoContainer: {
		flexGrow:1,
		alignItems:'center',
		justifyContent:'center'
	},
	title:{
		color: COLORS.WHITE_LOW
	},
	subTitle:{
		color: COLORS.SECONDARY,
		fontWeight:'bold',
		paddingVertical:20
	},
	textColor:{
		color: COLORS.WHITE_LOW
	},
	linkItem:{
		paddingTop: DIMENS.PADDING,
		textAlign:'center'
	},
	formContainer:{
		marginBottom:40
	},
	fieldContainer:{
		flex:1,
		flexDirection:'row',
		alignItems:'flex-end',
		justifyContent:'flex-end'
	},
	inputIcon:{
		
	},
	input: {
		color: COLORS.SECONDARY,
	},
	btn:{
		padding: DIMENS.PADDING,
	},

	errorMsg:{
		color:COLORS.ERRORS
	},
	submit:{
		padding:DIMENS.PADDING,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor: COLORS.ACCENT_1,
	},
	submitText:{
		color:COLORS.SECONDARY,
		textAlign:'center',
	}
})
