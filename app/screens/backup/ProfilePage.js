import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import Login from './Login';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux'
import {userInfo} from '../../store/action/'
import DbQueries from '../../utils/dbQueries'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';                        


 class ProfilePage extends Component {
    constructor(props){
        super(props)
        this.unsubscriber = null
        this.state = {
          initializing:true,
          user:this.props.email,
          imageUrl:this.props.photo,
          userData:'',
          isLoading:false
        }
      }
    async componentDidMount(){
        if (this.state.initializing){
          this.setState({initializing:false})}
        this.unsubscriber  = firebase.auth().onAuthStateChanged((user)=>{
          if (!user) {
              return
            // this.props.navigation.navigate('Login')
          }
          else{

            console.log(" USER AUTH STATE CHANGED  ",user._user)
            this.setState({user:user._user.email,userData:user,isLoading:false,imageUrl:user._user.photoURL})
            this.props.userInfo({email:user._user.email,uid:user._user.uid,
            userName:user._user.displayName,phoneNumber:null,photo:user._user.photoURL})
            this.setState({isLoading:true})

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
        this.props.userInfo({email:null,uid:null,userName:'',phoneNumber:null,photo:null})
        this.setState({user:null})
        DbQueries.deleteBookmark()
        
    }
  
    render() {
      console.log(" photo ",this.state.imageUrl)
    if(!this.state.user){
        return <Login navigation={this.props.navigation} user={this.state.user}/>
    }
    return(
      <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri:this.state.imageUrl}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.state.user}</Text>
              {/* <Text style={styles.info}>UX Designer / Mobile developer</Text> */}
              {/* <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text> */}
              <TouchableOpacity onPress={this.logOut} style={styles.buttonContainer}>
                <Text style={{color:"#fff"}}>LOG OUT</Text>  
              </TouchableOpacity>              
             
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    // backgroundColor: "#00BFFF",
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
    borderRadius:10,
    backgroundColor: "#3E4095",
  },
});

const mapStateToProps = state =>{
  return{
      email:state.userInfo.email,
      uid:state.userInfo.uid,
      photo:state.userInfo.photo,
      userName:state.userInfo.userName
  }
}
const mapDispatchToProps = dispatch =>{
  return {
   userInfo:(payload)=>dispatch(userInfo(payload))
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(ProfilePage)


