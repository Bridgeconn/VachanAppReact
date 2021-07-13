import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text, Touchable } from 'react-native';
import Markdown from 'react-native-markdown-display';
import ModalDropdown from 'react-native-modal-dropdown';
import { Header, Title, Button, Left, Right, Body } from "native-base";
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { OBSStyle } from './styles.js'
import Color from '../../../utils/colorConstants';
import ApiUtils from '../../../utils/ApiUtils'
import { TouchableOpacity } from 'react-native-gesture-handler';
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
      defaultLanguage: '',
      storyList: [],
      bsIndex: '01',
    }
    this.styles = OBSStyle(this.props.colorFile, this.props.sizeFile);

  }
  componentDidMount() {
    this.fetchLangList()
  }
  fetchGitData(url) {
    return fetch(Github_URL + url)
      .then(ApiUtils.checkStatus)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      });
  }
  async fetchLangList() {
    try {
      let urlLan = 'languages.json'
      let lan = await this.fetchGitData(urlLan)
      if (lan) {
        let obslangList = []
        let foundLangCode = false
        for (var key in lan) {
          obslangList.push(lan[key])
          if (key == this.state.langCode) {
            foundLangCode = true
            this.setState({ langCode: key, defaultLanguage: lan[key] })
            this.bibleStoryList()
            this.mdFileFetch()
          }
        }
        if (!foundLangCode) {
          this.setState({ langCode: Object.keys(lan)[0], defaultLanguage: lan[Object.keys(lan)[0]] },
            () => {
              this.bibleStoryList()
              this.mdFileFetch()

            }
          )
        }
        this.setState({ obsLang: obslangList, languagesList: [...this.state.languagesList, lan] })
      }

    } catch (erorr) {
    }

  }
  async mdFileFetch() {
    fetch(Github_URL + this.state.langCode + '/content/' + this.state.bsIndex + '.md')
      .then((response) => response.text())
      .then((json) => { this.setState({ obsData: json }) })
      .catch((error) => { })
  }
  async bibleStoryList() {
    try {
      let url = this.state.langCode + '/manifest.json'
      let data = await this.fetchGitData(url)
      if (data) {
        let storyList = []
        for (var i = 0; i < data.length; i++) {
          storyList.push(i + 1 + ' ' + data[i])
        }
        this.setState({ storyList })
      }
    } catch (error) {

    }
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
    return (
      <View style={this.styles.container}>
        <SafeAreaView >
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => { this._dropdown_1 && this._dropdown_1.show(); }} style={{ padding: 10, margin: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.colorFile.blueText }}>
              <ModalDropdown
                ref={el => this._dropdown_1 = el}
                options={this.state.obsLang} onSelect={this.onSelectLang}
                defaultValue={this.state.defaultLanguage} isFullWidth={true}
                dropdownStyle={{ width: '60%', height: '70%' }} dropdownTextStyle={{ fontSize: 18 }}
                textStyle={{ fontSize: 18, fontWeight: '400', color: '#fff' }} />
              <Icon name="arrow-drop-down" color={'#fff'} size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this._dropdown_2 && this._dropdown_2.show(); }} style={{ padding: 10, margin: 10, borderRadius: 10, width: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.colorFile.blueText }}>
              <ModalDropdown
                ref={el => this._dropdown_2 = el} options={this.state.storyList} onSelect={this.onSelectStory}
                style={{ paddingRight: 20 }} defaultValue={this.state.storyList.length > 0 ? this.state.storyList[0] : ''}
                isFullWidth={true} dropdownStyle={{ width: '60%', height: '70%' }}
                // renderRow={this.renderRow}
                dropdownTextStyle={{ fontSize: 18 }} textStyle={{ paddingHorizontal: 8, fontSize: 18, fontWeight: '400', color: '#fff' }} />
              <Icon name="arrow-drop-down" color={'#fff'} size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{ height: '100%', paddingHorizontal: 8 }}
          >
            <Markdown
              style={this.styles}>
              {this.state.obsData}
            </Markdown>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

};
const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}

export default connect(mapStateToProps, null)(OBS)
