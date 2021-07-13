import React, { Component } from 'react';
import {
  View,
  Alert,
} from 'react-native';
import { connect } from 'react-redux'
import { SelectionTab } from './routes/index'
import { fetchVersionBooks } from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import ReloadButton from '../../components/ReloadButton';
import { styles } from './styles';
import Color from '../../utils/colorConstants'

class ReferenceSelection extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerStyle: {
        backgroundColor: Color.Blue_Color,
        height: 36,
        elevation: 0,
        shadowOpacity: 0,
      },
    }
  }
  constructor(props) {
    super(props)

    this.state = {
      selectedBookId: this.props.navigation.state.params.bookId,
      selectedBookName: this.props.navigation.state.params.bookName,
      totalChapters: this.props.navigation.state.params.totalChapters,
      selectedChapterIndex: 0,
      selectedChapterNumber: this.props.navigation.state.params.chapterNumber,
      selectedVerseIndex: 0,
      selectedVerseNumber: '',

    }
    this.alertPresent = false

  }

  updateSelectedBook = (item) => {
      this.setState({
        selectedBookId: item.bookId,
        selectedBookName: item.bookName,
        totalChapters: item.numOfChapters,
      })
  }
  // select book or chapter or both and navigate back 
  updateSelectedChapter = (chapter, index) => {
    var chapterNum = chapter == null ? this.state.selectedChapterNumber : chapter
    this.setState({
      selectedChapterNumber: chapterNum,
      selectedChapterIndex: index != null && index,
    }, () => {
      //call back fucntion to update perticular values on back 
        this.props.navigation.state.params.getReference({
          bookId:  this.state.selectedBookId,
          bookName:  this.state.selectedBookName,
          chapterNumber: chapterNum > this.state.totalChapters ? '1' : chapterNum,
          totalChapters: this.state.totalChapters,
        })
      this.props.navigation.goBack()
    })
  }
  // all books to render
  getBooks() {
    if (this.props.navigation.state.params) {
      let params = this.props.navigation.state.params
      this.props.fetchVersionBooks({
        language: params.language, versionCode: params.versionCode,
        downloaded: params.downloaded, sourceId: params.sourceId
      })
    }
  }
  componentDidMount() {
    this.getBooks()
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error !== null) {
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
      } else {
        this.alertPresent = false;
      }
    }
  }
  // if error message or fetch data not available re-render
  reloadBooks = () => {
    this.errorMessage()
    this.getBooks()
  }
  render() {
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
    return (
      this.props.isLoading ?
        <Spinner
          visible={true}
          textContent={'Loading...'}
        /> : (
          this.props.error ?
            <View style={this.styles.mainContainerReloadButton}>
              <ReloadButton
                styles={this.styles}
                reloadFunction={this.reloadBooks}
                message={null}
              />
            </View>
            :
            <SelectionTab
              screenProps={{
                selectedBookIndex: this.state.selectedBookIndex,
                selectedBookId: this.state.selectedBookId,
                selectedChapterIndex: this.state.selectedChapterIndex,
                selectedChapterNumber: this.state.selectedChapterNumber,
                selectedVerseIndex: this.state.selectedVerseIndex,
                selectedVerseNumber: this.state.selectedVerseNumber,
                totalChapters: this.state.totalChapters,
                updateSelectedBook: this.updateSelectedBook,
                updateSelectedChapter: this.updateSelectedChapter,
                onPressCheck: this.onPressCheck

              }} />
        )

    );
  }

};


const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,

    books: state.versionFetch.data,
    error: state.versionFetch.error,
    isLoading: state.versionFetch.loading,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReferenceSelection)