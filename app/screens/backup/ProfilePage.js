import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import AsyncStorageUtil from '../../utils/AsyncStorageUtil'
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'
import Login from './Login';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux'
import {userInfo} from '../../store/action/'


 class ProfilePage extends Component {
    constructor(props){
        super(props)
        this.unsubscriber = null
        this.state = {
          initializing:true,
          user:'',
          userData:''
        }
      }
    componentDidMount(){
        if (this.state.initializing){this.setState({initializing:false})}
        this.unsubscriber = firebase.auth().onAuthStateChanged((user)=>{
          if (!user) {
              return
            // this.props.navigation.navigate('Login')
          }
          else{
            this.setState({user:user._user.email,userData:user})
          }

        
        })
    }
    componentWillUnmount(){
        if(this.unsubscriber) {
            this.unsubscriber();
          }  
    }
    logOut=()=>{
        firebase.auth().signOut()
        // AsyncStorageUtil.removeItem(AsyncStorageConstants.Keys.BackupRestoreEmail)
        this.props.userInfo({email:null,uid:null,userName:''})
        this.setState({user:null})
    }

    render() {
    if(!this.state.user){
        return <Login navigation={this.props.navigation}/>
    }
    return (
      <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.state.userData.email}</Text>
              <Text style={styles.info}>UX Designer / Mobile developer</Text>
              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
              
              <TouchableOpacity onPress={this.logOut} style={styles.buttonContainer}>
                <Text>LOG OUT</Text>  
              </TouchableOpacity>              
             
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});

const mapStateToProps = state =>{
  return{
      email:state.userInfo.email,
      uid:state.userInfo.uid,
      userName:state.userInfo.userName
  }
}
const mapDispatchToProps = dispatch =>{
  return {
   userInfo:(payload)=>dispatch(userInfo(payload))
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(ProfilePage)