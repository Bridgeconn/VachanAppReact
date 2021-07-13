import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import ModalDropdown from 'react-native-modal-dropdown';
import { Header, Title, Button, Left, Right, Body } from "native-base";
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Github_URL = 'https://raw.githubusercontent.com/Bridgeconn/vachancontentrepository/master/obs/'

class OBS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languagesList: [],
      langCode: this.props.languageCode,
      langCodeObj: {},
      obsData: null,
      obsLang: [],
      storyList: [],
      bsIndex: '01',
    }
  }
  componentDidMount() {
    this.filterLangCode()
    this.mdFileFetch()
    this.fetchLangList()
    this.bibleStoryList()
  }
  filterLangCode() {
    for (var lang in this.state.languagesList[0]) {
      if (this.state.languagesList[0][lang] == this.props.languageCode) {
        console.log(" LANG CODE ON FILTER ", lang)
        this.setState({ langCode: lang })
      }
    }
  }
  mdFileFetch() {
    // console.log(" bs index ", this.state.bsIndex,this.state.langCode)
    fetch(Github_URL + this.state.langCode + '/content/' + this.state.bsIndex + '.md')
      .then((response) => response.text())
      .then((json) => this.setState({ obsData: json }))
      .catch((error) => console.error(error))
  }
  fetchLangList() {
    fetch(Github_URL + 'languages.json')
      .then((response) => response.json())
      .then((json) => {
        let obslangList = []
        for (var key in json) {
          obslangList.push(json[key])
        }
        this.setState({ obsLang: obslangList, languagesList: [...this.state.languagesList, json] })
      })
      .catch((error) => console.error(error))
  }
  bibleStoryList() {
    fetch(Github_URL + this.state.langCode + '/manifest.json')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ storyList: json })
      })
      .catch((error) => console.error(error))
  }
  onSelectLang = (index, lang) => {
    for (var key in this.state.languagesList[0]) {
      if (this.state.languagesList[0][key] == lang) {
        this.setState({ langCode: key }, () => {
          this.mdFileFetch()
          this.bibleStoryList()
          let selectedStoryIndex = this.state.bsIndex.replace(/^0+/, '')
          this._dropdown_2.select(parseInt(selectedStoryIndex - 1))
        })
      }
    }
  }
  onSelectStory = (index, val) => {
    let num = index + 1
    let bsIndex = ('0' + num).slice(-2)
    this.setState({ bsIndex }, () => {
      this.mdFileFetch()
    })
  }
  componentDidUpdate(prevState) {
    if (prevState.storyList != this.state.storyList) {
      let selectedStoryIndex = this.state.bsIndex.replace(/^0+/, '')
      this._dropdown_2.select(parseInt(selectedStoryIndex - 1))
    }
  }
  render() {
    // console.log(" BIBLE STORY LIST ", this.state.storyList)
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Header>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' onPress={() => { this.props.navigation.pop() }} />
            </Button>
          </Left>
          <Body>
            <Title>Bible Story</Title>
          </Body>
          <Right>
            <ModalDropdown options={this.state.obsLang} onSelect={this.onSelectLang} defaultValue={this.props.languageName} isFullWidth={true} style={{ width: '60%', }} dropdownStyle={{ padding: 10 }} dropdownTextStyle={{ fontSize: 16 }} textStyle={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }} />
            <ModalDropdown ref={el => this._dropdown_2 = el} options={this.state.storyList} onSelect={this.onSelectStory} defaultValue={this.state.storyList[0]} isFullWidth={true} style={{ width: '60%', }} dropdownStyle={{ padding: 10 }} dropdownTextStyle={{ fontSize: 16 }} textStyle={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }} />
          </Right>
        </Header>
        {this.state.langCode &&
          <SafeAreaView style={{ marginHorizontal: 8 }}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{ height: '100%' }}
            >
              <Markdown>
                {this.state.obsData}
              </Markdown>
            </ScrollView>
          </SafeAreaView>
        }
      </>
    );
  }

};
const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
  }
}

export default connect(mapStateToProps, null)(OBS)
