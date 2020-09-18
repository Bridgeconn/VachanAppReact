

import React, { Component } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  Alert,
  View
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'
import { Accordion, Body, Header, Right, Title, Button } from 'native-base'
import { fetchDictionaryContent } from '../../../store/action/index'
import Icon from 'react-native-vector-icons/MaterialIcons';
import APIFetch from '../../../utils/APIFetch'
import { styles } from './styles'
import Color from '../../../utils/colorConstants'
import ReloadButton from '../../../components/ReloadButton'

class DictionaryWords extends Component {
  static navigationOptions = () => {
    return {
      headerTitle: 'Dictionary',
    }
  }
  constructor(props) {
    super(props)

    this.state = {
      modalVisibleDictionary: false,
      dictionarySourceId:this.props.navigation.state.params ? this.props.navigation.state.params.dictionarySourceId : null,
      wordDescription: [],
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    this.alertPresent = false

  }
  componentDidMount() {
    this.props.fetchDictionaryContent({ parallelContentSourceId: this.state.dictionarySourceId })
  }
  fetchWord = async (word) => {
    try {
      var wordDescription = await APIFetch.fetchWord(this.state.dictionarySourceId, word.wordId)
      this.setState({
        wordDescription: wordDescription.meaning,
        modalVisibleDictionary: true
      })
    }
    catch (error) {
      this.setState({
        wordDescription: [],
        modalVisibleDictionary: false
      })
    }

  }
  _renderHeader = (item, expanded) => {
    return (
      <View style={this.styles.headerStyle}>
        <Text style={this.styles.headerText} >
          {" "}{item.letter}
        </Text>
        <Icon style={this.styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} />
      </View>
    )
  }
  _renderContent = (item) => {
    return (
      item.words.map(w =>
        <TouchableOpacity
          style={{
            padding: 20,
          }}
          onPress={() => this.fetchWord(w)}
        >
          <Text style={this.styles.textDescription}>{w.word}</Text>
        </TouchableOpacity>
      )
    )
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.dictionaryContent.length === 0) {
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        this.props.fetchDictionaryContent({ parallelContentSourceId: this.props.dictionarySourceId })
      } else {
        this.alertPresent = false;
      }
    }
  }
  updateData = () => {
    if(this.props.error){
    this.errorMessage()
    }
    else{
      return
    }
  }


  render() {
    console.log(" props dictionary ",this.props.dictionaryContent,this.props.dictionarySourceId)
    return (
      <View style={this.styles.container}>
        {/* <Header style={{ backgroundColor: Color.Blue_Color, height: 40, borderLeftWidth: 0.5, borderLeftColor: Color.White }} >
          <Body>
            <Title style={{ fontSize: 16 }}>{this.props.parallelLanguage.versionCode}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.toggleParallelView(false)}>
              <Icon name='cancel' color={Color.White} size={20} />
            </Button>
          </Right>
        </Header> */}
        {this.state.isLoading &&
          <Spinner
            visible={true}
            textContent={'Loading...'}
          />}
        {
          (this.props.error) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ReloadButton
                styles={this.styles}
                reloadFunction={this.updateData}
              />
            </View>
            :
            <View>
              <Accordion
                dataArray={this.props.dictionaryContent}
                animation={true}
                expanded={true}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
              />
              <Modal
                animated={true}
                transparent={true}
                visible={this.state.modalVisibleDictionary}>
                <View style={this.styles.dictionaryModalView}>
                  <View style={{ width: '70%', height: '70%', position: 'absolute', zIndex: 0, }}>
                    <Icon
                      name='cancel' onPress={() => this.setState({ modalVisibleDictionary: false })}
                      size={28} color={Color.Blue_Color} style={{ position: 'absolute', right: 0, zIndex: 1 }}
                    />
                    <ScrollView style={this.styles.scrollViewModal}>
                      <Text style={this.styles.textString}>Description: {this.state.wordDescription.definition}</Text>
                      <Text style={this.styles.textString}>Keyword: {this.state.wordDescription.keyword}</Text>
                      {this.state.wordDescription.seeAlso != '' && <Text style={this.styles.textString}>See Also: {this.state.wordDescription.seeAlso}</Text>}
                      <View style={{ marginBottom: 8 }} />
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </View>
        }

      </View>
    )
  }
}


const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    dictionaryContent: state.dictionaryFetch.dictionaryContent,
    error: state.dictionaryFetch.error,
  }

}
const mapDispatchToProps = dispatch => {
  return {
    fetchDictionaryContent: (payload) => dispatch(fetchDictionaryContent(payload)),
    fetchWordId: (payload) => dispatch(fetchWordId(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DictionaryWords)