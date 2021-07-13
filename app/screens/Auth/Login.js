import React, { Component } from 'react';
import { ActivityIndicator, View, KeyboardAvoidingView, Platform, Text, Alert, TextInput, Button, Image } from 'react-native';
import firebase from 'react-native-firebase'
import { userInfo, userLogedIn } from '../../store/action'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, GoogleSigninButton, statusCodes, } from 'react-native-google-signin';
import { AccessToken, LoginManager, LoginButton } from 'react-native-fbsdk';
import { styles } from './styles.js'
import Color from '../../utils/colorConstants'

class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      user: '',
      isLoading: false,
      passwordVisible: true
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
  }
  //on change text function for textInput
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  login = async () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Please enter email and password !')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          this.props.userLogedIn({ pasLogedIn: true,googleLogIn:false })
          this.props.navigation.navigate("Bible")
          this.setState({
            isLoading: false,
          })
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            Alert.alert("User not found")
          }
          if (error.code === 'auth/wrong-password') {
            Alert.alert("Wrong password")
          }
          if (error.code === 'auth/invalid-email') {
            Alert.alert("Invalid Email")
          }
          if (error.code === 'auth/unknown') {
            Alert.alert("Something went wrong. Please check your internet connection")
          }
          this.setState({ isLoading: false })
        })
    }
  }

  _signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const data = await GoogleSignin.signIn();
      if (data) {
        this.setState({ isLoading: true }, async () => {
          const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
          // Login with the credential
          await firebase.auth().signInWithCredential(credential);
          // console.log(" USER DATA ",data)
          this.props.userLogedIn({ pasLogedIn: false,googleLogIn:true })
          this.setState({ isLoading: false })
          this.props.navigation.navigate("Bible")
        })
      }else{
        console.log("NO DATA ")
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Signin Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google play services not available');
        // play services not available or outdated
      } else {
        // some other error happened
      }
      console.log(" SIGN IN ERROR", error)
    }

  }

  _signInFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject(new Error('The user cancelled the request'));
        }
        // Retrieve the access token
        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        // Login with the credential
        return firebase.auth().signInWithCredential(credential);
      })
      .then((res) => {
        this.setState({ isLoading: true }, () => {
          this.setState({ isLoading: false })
          this.props.navigation.navigate("Bible")
        })

      })
      .catch((error) => {
        const { code, message } = error;
      });
  }
 
  render() {
    if (this.state.isLoading) {
      return (
        <View style={this.styles.preloader}>
          <ActivityIndicator size="large" color={Color.Blue_Color} />
        </View>
      )
    }
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={this.styles.container}
      >
        <View>
          <Icon name='close' size={28} style={this.styles.headerCloseIcon} onPress={() => { this.props.navigation.pop() }} />
        </View>
        <View style={{ padding: 35, flex: 1 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ width: 50, height: 50, marginVertical: 16 }}
              source={require('../../assets/bcs_old_favicon.png')}
            />
            <Text style={{ fontSize: 26, color: Color.Blue_Color, fontWeight: 'bold' }}>Sign In</Text>
          </View>
          <View style={{
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <TextInput
              style={this.styles.inputStyle}
              placeholderTextColor={this.styles.placeholderColor.color}
              placeholder="Email"

              value={this.state.email}
              onChangeText={(val) => this.updateInputVal(val, 'email')}
            />
            <View>
              <TextInput
                style={this.styles.inputStyle}
                placeholder="Password"
                placeholderTextColor={this.styles.placeholderColor.color}
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                maxLength={15}
                secureTextEntry={this.state.passwordVisible}
              />
              <Icon name={this.state.passwordVisible ? 'eye' : 'eye-off'} size={24} style={this.styles.eyeIcon} onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })} />
            </View>
            <Button
              color={Color.Blue_Color}
              title="Sign In"
              onPress={() => this.login()}
            />
            <Text
              style={this.styles.loginText}
              onPress={() => this.props.navigation.navigate('Reset')}>
              Reset password
            </Text>
            <View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={
                  this.styles.dividerLine
                }
              />
              <Text style={this.styles.divider}>Or</Text>
              <View
                style={this.styles.dividerLine}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: 32 }}>
              <GoogleSigninButton
                // style={{ width: 68, height: 68 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signInGoogle}
              />
            </View>
            <Text
              style={this.styles.loginText}
              onPress={() => this.props.navigation.navigate('Register')}>
              Don't have account? Click here to Sign Up
          </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

}

const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,

    email: state.userInfo.email,
    uid: state.userInfo.uid,
    userName: state.userInfo.userName,
    phoneNumber: state.userInfo.phoneNumber,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    userInfo: (payload) => dispatch(userInfo(payload)),
    userLogedIn: (payload) => dispatch(userLogedIn(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)


