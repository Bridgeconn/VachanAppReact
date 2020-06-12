
import React, {Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, ImagePicker,TextInput,Image,Button} from 'react-native';
// import { , Input, Icon } from 'react-native-elements';
// import {Button} from 'native-base'
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'
import {userInfo} from '../../store/action/'
import {connect} from 'react-redux'
// import ImagePicker from 'react-native-image-picker';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';


class Register extends Component {
    constructor(props){
        super(props)
        this.state ={
            // email:'',
            // password:'',
            // showLoading:'',
            displayName: '',
            email: '', 
            password: '',
            cpassword:'',
            passwordVisible:true,
            isLoading: false,
            filePath: {},
        }
    }
    updateInputVal = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    }
    registerUser = () => {
      console.log(" photo url ",this.state.filePath)
      // if(this.state.email === '' && this.state.password === '') {
      //   Alert.alert('Enter details to signup!')
      // } else {
      //   this.setState({
      //     isLoading: true,
      //   })
      //   if(this.state.cpassword === this.state.password){
      //   firebase
      //   .auth()
      //   .createUserWithEmailAndPassword(this.state.email, this.state.password)
      //   .then((res) => {
      //       res.user.updateProfile({
      //         displayName: this.state.displayName,
      //         // photoURL:this.state.filePath
      //         // phoneNumber:
      //       })
      //       this.props.userInfo({email:res.user._user.email,uid:res.user._user.uid,userName:res.user._user.displayName,phoneNumber:null,photo:null})
      //       // this.props.navigation.navigate('Bible')
      //       // this.setState({
      //       //   isLoading: false,
      //       //   displayName: '',
      //       //   email: '', 
      //       //   password: ''
      //       // })
      //     // this.props.navigation.navigate('Login')
      //   })
      //   .catch(error =>{
      //     if(error.code === 'auth/weak-password'){
      //       Alert.alert("Weak password")

      //     }
      //     if(error.code === 'auth/email-already-in-use'){
      //       Alert.alert("Email already in use")

      //     }
      //     if(error.code === 'auth/invalid-email'){
      //       Alert.alert("Invalid Email")
      //     }
      //     this.setState({isLoading:false })
      //   })   
      // }
      // else{
      //   Alert.alert("Password and confirm password donot match")
      //   this.setState({isLoading:false})
      // }   
      // }
    }

    chooseFile = () => {
      var options = {
        title: 'Select Image',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          let source = response;
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            filePath: source,
          });
        }
      });
    };
  
    render(){
      console.log(" FILE   ",this.state.filePath)
          if(this.state.isLoading){
            return(
              <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#3E4095"/>
              </View>
            )
          }    
          return (
            <View style={styles.container}>  
              <View style={{alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={this.chooseFile} >
              <Image
                style={{width: 50,height: 50,marginVertical:16}}
                source={Object.keys(this.state.filePath).length == 0 ? require('../../assets/bcs_old_favicon.png') :{uri:this.state.filePath.uri}}
              />
              {/* <Image
                style={{width: 50,height: 50,marginVertical:16}}
                source={require('../../assets/bcs_old_favicon.png')}
              /> */}
              </TouchableOpacity>
                <Text style={{fontSize:26,color:'#3E4095',fontWeight:'bold'}}>Sign Up</Text>
              </View> 
              <View style={{
                flexDirection: "column",
                justifyContent: "center",
                }}> 
              <TextInput
                style={styles.inputStyle}
                placeholder="Name"
                value={this.state.displayName}
                onChangeText={(val) => this.updateInputVal(val, 'displayName')}
              />      
              <TextInput
                style={styles.inputStyle}
                placeholder="Email"
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, 'email')}
              />
              <View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                maxLength={15}
                secureTextEntry={this.state.passwordVisible}
              />   
            <Icon name={this.state.passwordVisible ? 'eye-off' : 'eye'} size={24} style={{alignSelf:'flex-end',position: 'absolute', right: 10, bottom:30}} onPress={()=>this.setState({passwordVisible:!this.state.passwordVisible})}/>
            </View>
            <View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Confirm Password"
                value={this.state.cpassword}
                onChangeText={(val) => this.updateInputVal(val, 'cpassword')}
                maxLength={15}
                secureTextEntry={this.state.passwordVisible}
              />   
            <Icon name={this.state.passwordVisible ? 'eye-off' : 'eye'} size={24} style={{alignSelf:'flex-end',position: 'absolute', right: 10, bottom:30}} onPress={()=>this.setState({passwordVisible:!this.state.passwordVisible})}/>
            </View>
              <Button
                color="#3E4095"
                title="Signup"
                onPress={() => this.registerUser()}
              />
              <Text 
                style={styles.loginText}
                onPress={() => this.props.navigation.goBack()}>
                Already Registered? Click here to Sign In
              </Text>                          
            </View>
            </View>
          );
    }
    
}

const mapStateToProps = state =>{
  return{
      language: state.updateVersion.language,
      versionCode:state.updateVersion.versionCode,

      email:state.userInfo.email,
      uid:state.userInfo.uid,
      userName:state.userInfo.userName,
      phoneNumber:state.userInfo.phoneNumber
  }
}
const mapDispatchToProps = dispatch =>{
  return {
   userInfo:(payload)=>dispatch(userInfo(payload))
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(Register)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});