"use strict";
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { Accordion } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { HeaderBackButton, NavigationActions } from 'react-navigation';
import DbQueries from '../../utils/dbQueries'
import { styles } from './styles.js';
import { getBookSectionFromMapping } from '../../utils/UtilFunctions'
import { connect } from 'react-redux';
import { updateVersion, fetchVersionBooks, fetchAllContent, updateMetadata } from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import ReloadButton from '../../components/ReloadButton';
import vApi from '../../utils/APIFetch';
import Color from '../../utils/colorConstants'


class LanguageList extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Languages',
    headerLeft: (<HeaderBackButton tintColor={Color.White} onPress={() => navigation.state.params.handleBack()} />),

  });
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      text: '',
      languages: [],
      startDownload: false,
      index: -1,
      language: this.props.language,
      versionCode: this.props.versionCode,
      downloaded: this.props.downloaded,
      sourceId: this.props.sourceId,
      updateLanguageList: false,

      colorFile: this.props.colorFile,
      sizeFile: this.props.sizeFile,

    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
    this.alertPresent = false
  }

  componentDidMount() {
    this.props.fetchAllContent()
    this.fetchLanguages()
    this.props.navigation.setParams({ handleBack: this.onBack })
    // BackHandler.addEventListener('hardwareBackPress', this.onBack);
    this._interval = setInterval(async () => {
      await DbQueries.deleteLangaugeList()
      this.fetchLanguages()
    }, 604800 * 1000)
  }
  componentDidUpdate(prevProps){
    if(prevProps.bibleContent !=this.props.bibleContent){
      this.fetchLanguages()
    }
  }
  componentWillUnmount() {
    // BackHandler.addEventListener('hardwareBackPress', this.onBack);
    clearInterval(this._interval);
  }
  onBack = () => {
    let updateSourceId = false
    let updatedObj = {}
    let lanVer = this.state.languages
    if (this.state.updateLanguageList) {
      for (var i = 0; i < lanVer.length; i++) {
        for (var j = 0; j < lanVer[i].versionModels.length; j++) {
          if (lanVer[i].versionModels[j].sourceId == this.props.sourceId) {
            updateSourceId = true
            updatedObj = {
              sourceId: lanVer[i].versionModels[j].sourceId,
              languageName: lanVer[i].languageName, languageCode: lanVer[i].languageCode,
              versionCode: lanVer[i].versionModels[j].versionCode, downloaded: lanVer[i].versionModels[j].downloaded,
              books: lanVer[i].bookNameList,
              metadata: lanVer[i].versionModels[j].metaData
            }
          }
        }
      }
      com.bridgeconn.vachangotest("updatedObj ",Object.keys(updatedObj).length,updateSourceId)
      if (updateSourceId) {
        if(Object.keys(updatedObj).length>0){
          this.props.navigation.state.params.updateLangVer(updatedObj)
        }
      } else {
        this.props.navigation.state.params.updateLangVer({
          sourceId: lanVer[0].versionModels[0].sourceId, languageName: lanVer[0].languageName,
          languageCode: lanVer[0].languageCode, versionCode: lanVer[0].versionModels[0].versionCode,
          downloaded: lanVer[0].versionModels[0].downloaded, books: lanVer[0].bookNameList,
          metadata: lanVer[0].versionModels[0].metaData
        })
      //can add alert for showing user that previous version you were reafding not available set a default one
      }
    }
    this.props.navigation.dispatch(NavigationActions.back())
  }
  errorMessage = () => {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.state.languages.length == 0) {
        this.fetchLanguages()
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
      } else {
        this.alertPresent = false;
      }
    }
  }
  //refetch data if internet connection lost 
  updateData = () => {
    this.props.fetchAllContent()
    this.errorMessage()
  }

  addLanguagesToDb = async () => {
    try {
      let books = await vApi.get("booknames")
      if (this.props.bibleLanguages.length > 0) {
        let languages = this.props.bibleLanguages[0].content
        if (languages && books) {
          await DbQueries.addLangaugeList(languages, books)
        }
      } else {
        this.updateData()
      }
    }
    catch (error) {
    }
  }
  async fetchLanguages() {
    var languageList = await DbQueries.getLangaugeList()
    var lanVer = []
    let update = false
    try {
      if (languageList == null) {
        await this.addLanguagesToDb()
        languageList = await DbQueries.getLangaugeList()
      }
      else {
        if (this.props.bibleLanguages.length > 0) {
          let languages = this.props.bibleLanguages[0].content
          for (var i = 0; i < languageList.length; i++) {
            for (var j = 0; j < languages.length; j++) {
              if (i === j) {
                if (languages[j].languageName != languageList[i].languageName) {
                  update = true
                  break
                }
              }
            }
          }
          if (update) {
            await DbQueries.deleteLangaugeList()
            await this.addLanguagesToDb()
            languageList = await DbQueries.getLangaugeList()
          }
        } else {
          this.updateData()
        }
      }
      if (languageList) {
        for (var i = 0; i < Object.keys(languageList).length; i++) {
          lanVer.push(languageList[i])
        }
        this.setState({
          languages: lanVer,
          updateLanguageList: update
        })
      }
    }
    catch (error) {
    }
  }

  downloadBible = async (langName, verCode, books, sourceId) => {
    try {
      this.setState({ startDownload: true })
      let bookModels = []
      let content = await vApi.get("bibles" + "/" + parseInt(sourceId) + "/" + "json")
      if (content.bibleContent && books) {
        for (var i = 0; i < books.length; i++) {
          bookModels.push({
            languageName: langName,
            versionCode: verCode,
            bookId: books[i].bookId,
            bookName: books[i].bookName,
            bookNumber: books[i].bookNumber,
            chapters: this.getChapters(content.bibleContent, books[i].bookId),
            section: getBookSectionFromMapping(books[i].bookId),
          })
        }
      }
      await DbQueries.addNewVersion(langName, verCode, bookModels, sourceId)
      await this.fetchLanguages()
      this.setState({ startDownload: false })
    } catch (error) {
      this.setState({ startDownload: false })
      Alert.alert("", "Something went wrong. Try Again", [{ text: 'OK', onPress: () => { return } }], { cancelable: false });

    }
  }
  // this function is calling in downloadbible function
  getChapters = (content, bookId) => {
    let chapterModels = []
    let chapterHeading = null
    for (var id in content) {
      if (content != null && id == bookId) {
        for (var c = 0; c < content[id].chapters.length; c++) {
          var verseModels = []
          chapterHeading = content[id].chapters[c].metadata && (content[id].chapters[c].metadata[0].section) ? content[id].chapters[c].metadata[0].section.text : null
          for (var v = 0; v < content[id].chapters[c].verses.length; v++) {
            let verseData = content[id].chapters[c].verses[v]
            verseModels.push({
              text: verseData.text,
              number: verseData.number,
              section: (verseData.metadata && verseData.metadata[0].section) ? verseData.metadata[0].section.text : null,
            })
          }
          let chapterModel = {
            chapterNumber: parseInt(content[id].chapters[c].header.title),
            numberOfVerses: parseInt(content[id].chapters[c].verses.length),
            chapterHeading: chapterHeading,
            verses: verseModels,
          }
          chapterModels.push(chapterModel)
        }
        return chapterModels
      }
    }
  }
  // this is useful for reusing code as this page is calling at other places
  navigateTo(langName, langCode, booklist, verCode, sourceId, metadata, downloaded) {
    if (this.props.navigation.state.params.updateLangVer) {
      //call back fucntion to update perticular values on back
      this.props.navigation.state.params.updateLangVer({
        sourceId: sourceId, languageName: langName, languageCode: langCode,
        versionCode: verCode, downloaded: downloaded,
        books: booklist,
        metadata: metadata
      })
      this.props.navigation.pop()
    } else {
      // for downloading bible from settings page no need to navigate
      Alert.alert("To download bible click on download icon.")
    }
  }
  deleteBible(languageName, languageCode, versionCode, sourceId, downloaded) {
    DbQueries.deleteBibleVersion(languageName, versionCode, sourceId, downloaded)
    this.fetchLanguages()
  }

  _renderHeader = (item, expanded) => {
    return (
      <View style={{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Text
          style={this.styles.headerText}
        >
          {item.languageName}
        </Text>
        <Icon style={this.styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} />
      </View>
    )
  }
  _renderContent = (item) => {
    return (
      <View>
        {/*Content under the header of the Expandable List Item*/}
        {item.versionModels.map((element, index, key) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 8 }}
            onPress={() => { this.navigateTo(item.languageName, item.languageCode, item.bookNameList, element.versionCode, element.sourceId, element.metaData, element.downloaded) }}>
            <View>
              <Text style={[this.styles.text, { marginLeft: 8, fontWeight: 'bold' }]} >{element.versionCode} </Text>
              <Text style={[this.styles.text, { marginLeft: 8 }]} >{element.versionName}</Text>
            </View>
            <View style={{padding:20}}>
              {
                element.downloaded === true ?
                  item.languageName.toLowerCase() === 'english' ? null :
                    <Icon style={[this.styles.iconStyle, { marginRight: 8 }]} name="delete" size={24} onPress={() => { this.deleteBible(item.languageName, item.languageCode, element.versionCode, element.sourceId, element.downloaded) }}
                    />
                  :
                  item.languageName.toLowerCase() === 'english' ? null :
                    <Icon style={[this.styles.iconStyle, { marginRight: 12 }]} name="file-download" size={24} onPress={() => { this.downloadBible(item.languageName, element.versionCode, item.bookNameList, element.sourceId) }} />
              }
            </View>
          </TouchableOpacity>
        ))}
      </View>

    )
  }
  render() {
    return (
      <View style={this.styles.MainContainer}>
        {
          this.props.isLoading ?
            <Spinner
              visible={true}
              textContent={'Loading...'}
            />
            : null}
        {
          this.state.startDownload ?
            <Spinner
              visible={true}
              textContent={'DOWNLOADING BIBLE...'}
            />
            : null}
        {
          this.state.languages.length == 0 ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ReloadButton
                reloadFunction={this.updateData}
                styles={this.styles}
                message={null}
              />

            </View>
            :
            <Accordion
              dataArray={this.state.languages}
              animation={true}
              expanded={true}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
            />
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
    downloaded: state.updateVersion.downloaded,
    bookId: state.updateVersion.bookId,
    chapterNumber: state.updateVersion.chapterNumber,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    bibleLanguages: state.contents.contentLanguages,
    books: state.versionFetch.data,
    baseAPI: state.updateVersion.baseAPI

  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateVersion: (value) => dispatch(updateVersion(value)),
    fetchAllContent: () => dispatch(fetchAllContent()),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    updateMetadata: (payload) => dispatch(updateMetadata(payload)),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LanguageList)