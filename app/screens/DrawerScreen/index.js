import React, {Component} from 'react';
import {ScrollView, Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { styles } from './styles.js';
import {connect} from 'react-redux'

import AsyncStorageUtil from '../../utils/AsyncStorageUtil'
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'




class DrawerScreen extends Component {
  constructor(props){
    super(props)
    this.unsubscriber = null
    this.state = {
      initializing:true,
      user:''
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
  }

  // onLogin=()=>{
  //   if (this.state.initializing){this.setState({initializing:false})}
  //   this.unsubscriber = firebase.auth().onAuthStateChanged((user)=>{
  //     this.setState({user})
  //     if (!user) {
  //       this.props.navigation.navigate('Auth') 
  //     }
  //     else{
  //       console.log("user  ",user._user.email)
  //       this.setState({user})
  //       this.props.navigation.navigate('Auth')
  //     }
  //   })
  // }
  async componentDidMount(){
    var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail)
    this.setState({email})
  }
  // componentWillUnmount(){
  //   if(this.unsubscriber) {
  //     this.unsubscriber();
  //   }
  // }
  render () {
    // const valueProps  = this.props.navigation.state.routes[0].index == 1 ? (this.props.navigation.state.routes[0].routes[1].params ? this.props.navigation.state.routes[0].routes[1].params.photorUl : null) : null
 
    const iconName = [
      {icon:'account-circle',pressIcon:'Auth',text:this.props.email ? 'Profile' : 'LogIn/SignUp'},
      {icon:'bookmark',pressIcon:'BookMarks',text:'BookMarks'},
      {icon:'border-color',pressIcon:'Highlights',text:'Highlights'},
      {icon:'note',pressIcon:'Notes',text:'Notes'},
      {icon:'history',pressIcon:'History',text:'History'},
      {icon:'search',pressIcon:'Search',text:'Search'},
      {icon:'settings',pressIcon:'Settings',text:'Settings'},
      {icon:'info',pressIcon:'About',text:'About us'},
    ]
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
    
    return (
      <View style={this.styles.container}>
      <ScrollView style={this.styles.container}> 
          <View style={this.styles.headerContainer}>
                <ImageBackground source={require('../../assets/headerbook.jpeg')} style={{flex:1,width: 280,}} >
                    <View style={{position:'absolute',bottom:0,margin:8}}>
                    <Image
                      style={this.styles.imageStyle}
                      source={require('../../assets/bcs_old_favicon.png')}
                    />
                    {/* <View style={this.styles.goToLogin}> */}
                    <Text style={{size:20,color:'#fff'}}>
                      Vachan Go
                    </Text>
                    {/* <Image source={require('../../assets/logo.png')} style={{padding:4,width:136,height:30}}/> */}
                    {/* </View> */}
                    </View>
                </ImageBackground>
            </View>
        {
          iconName.map((iconName,index)=>
                <TouchableOpacity 
                onPress={()=>{this.props.navigation.navigate(iconName.pressIcon)}} 
                style={
                  this.styles.drawerItem
                }>
                    <View 
                    style={{
                      flexDirection:"row",
                  }}>
                      <Icon name={iconName.icon} size={20}  style={this.styles.iconStyleDrawer}/>
                      <Text 
                        style={this.styles.textStyle}>
                        {iconName.text}
                      </Text>
                    </View>
                    <Icon name='chevron-right' size={20} style={this.styles.iconStyleDrawer}/>
              </TouchableOpacity>
          )
        }
      </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state =>{
  return{
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    email:state.userInfo.email,
  }
}


export  default connect(mapStateToProps,null)(DrawerScreen)