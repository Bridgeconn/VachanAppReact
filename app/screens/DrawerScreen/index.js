import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { styles } from './styles.js';
import { connect } from 'react-redux'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil'
import { AsyncStorageConstants } from '../../utils/AsyncStorageConstants'
import { fetchVersionBooks } from '../../store/action/'
import VersionCheck from 'react-native-version-check'

class DrawerScreen extends Component {
  constructor(props) {
    super(props)
    this.unsubscriber = null
    this.state = {
      initializing: true,
      user: '',
      currentVersion:"1.0.0"
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
  }

  async componentDidMount() {
    let currentVersion = await VersionCheck.getCurrentVersion();
    this.props.fetchVersionBooks({
      language: this.props.language, versionCode: this.props.versionCode,
      downloaded: this.props.downloaded, sourceId: this.props.sourceId
    })
    var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail)
    this.setState({ email,currentVersion })
  }

  render() {
    const iconName = [
      { icon: 'account-circle', pressIcon: 'Auth', text: this.props.email ? 'Profile' : 'LogIn/SignUp' },
      { icon: 'bookmark', pressIcon: 'BookMarks', text: 'BookMarks' },
      { icon: 'border-color', pressIcon: 'Highlights', text: 'Highlights' },
      { icon: 'note', pressIcon: 'Notes', text: 'Notes' },
      { icon: 'video-library', pressIcon: 'Video', text: 'Video' },
      { icon: 'book', pressIcon: 'Dictionary', text: 'Dictionary' },
      { icon: 'history', pressIcon: 'History', text: 'History' },
      { icon: 'search', pressIcon: 'Search', text: 'Search' },
      { icon: 'settings', pressIcon: 'Settings', text: 'Settings' },
      { icon: 'info', pressIcon: 'About', text: 'About Us' },
      { icon: 'help', pressIcon: 'Help', text: 'Help' },
    ]
    this.styles = styles(this.props.colorFile, this.props.sizeFile);

    return (
      <View style={this.styles.container}>
        <ScrollView style={this.styles.container}>
          <View style={this.styles.headerContainer}>
            <ImageBackground source={require('../../assets/headerbook.jpg')} style={{ flex: 1, width: 280, }} >
              <View style={{ position: 'absolute', bottom: 0, margin: 8 }}>
                <Image
                  style={this.styles.imageStyle}
                  source={require('../../assets/bcs_old_favicon.png')}
                />
                <View style={this.styles.goToLogin}>
                  <Image source={require('../../assets/logo.png')} style={{ padding: 4, width: 136, height: 30 }} />
                </View>
              </View>
            </ImageBackground>
          </View>
          {
            iconName.map((iconName, index) =>
              <TouchableOpacity
                onPress={() => { this.props.navigation.navigate(iconName.pressIcon) }}
                style={
                  this.styles.drawerItem
                }>
                <View
                  style={{
                    flexDirection: "row",
                  }}>
                  <Icon name={iconName.icon} size={20} style={this.styles.iconStyleDrawer} />
                  <Text
                    style={this.styles.textStyle}>
                    {iconName.text}
                  </Text>
                </View>
                <Icon name='chevron-right' size={20} style={this.styles.iconStyleDrawer} />
              </TouchableOpacity>
            )
          }
        </ScrollView>
        <Text style={this.styles.versionText}>APP VERSION {this.state.currentVersion}</Text>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    email: state.userInfo.email,

    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchVersionBooks: (value) => dispatch(fetchVersionBooks(value)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen)
