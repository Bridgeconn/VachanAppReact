import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Alert,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux'
import { Body, Header, Right, Title, Button } from 'native-base'
import { fetchCommentaryContent, fetchVersionBooks } from '../../../store/action/index'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles'
import Color from '../../../utils/colorConstants'
import ReloadButton from '../../../components/ReloadButton';
import HTML from 'react-native-render-html';
import APIFetch from '../../../utils/APIFetch'

class Commentary extends Component {

  constructor(props) {
    super(props)
    this.state = {
      commentary: [],
      error:null,
      bookName:this.props.bookName,
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    this.alertPresent = false
  }
  async fetchBookName(){
    try {
          let bookName
          let response = await APIFetch.fetchBookInLanguage()
          for (var i = 0; i <= response.length-1; i++) {
              if (this.props.parallelLanguage.languageName.toLowerCase() == response[i].language.name) {
                  for (var j = 0; j <= response[i].bookNames.length - 1; j++) {
                      if (response[i].bookNames[j].book_code == this.props.bookId) {
                          bookName = response[i].bookNames[j].short
                      }
                  }
              }
          }
          this.setState({ bookName: bookName })
  } catch (error) {
      console.log("error ",console)
      
      this.setState({ error: error });
  }
  }
  componentDidMount() {
    this.props.fetchCommentaryContent({ parallelContentSourceId: this.props.parallelLanguage.sourceId, bookId: this.props.bookId, chapter: this.props.currentVisibleChapter })
    this.fetchBookName()
  }
  componentDidUpdate(prevProps,prevState) {
    if (this.props.bookId != prevProps.bookId || prevProps.currentVisibleChapter != this.props.currentVisibleChapter) {
      this.props.fetchCommentaryContent({ parallelContentSourceId: this.props.parallelLanguage.sourceId, bookId:this.props.bookId, chapter: this.props.currentVisibleChapter })
      this.fetchBookName()
    }
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error || this.state.error) {
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        this.props.fetchCommentaryContent({ parallelContentSourceId: this.props.parallelLanguage.sourceId, bookId: this.props.bookId, chapter: this.props.currentVisibleChapter })
      } else {
        this.alertPresent = false;
      }
    }
  }
  updateData = () => {
    this.errorMessage()
  }
  renderItem=({ item })=> {
    console.log("ITEM ", item)
    return (
      <View style={{ padding: 10 }}>
        {item.verse &&
          (item.verse == 0 ?
            <Text style={this.styles.commentaryHeading}>Chapter Intro</Text> :
            <Text style={this.styles.commentaryHeading}>Verse Number : {item.verse}</Text>
          )}
        <HTML
          baseFontStyle={this.styles.textString}
          tagsStyles={{ p: this.styles.textString }} html={item.text} />
      </View>
    )
  }
  ListHeaderComponent = () => {
    return (
      <View>
        {this.props.commentaryContent.bookIntro == '' ? null :
          <View style={this.styles.cardItemBackground}>
            <Text style={this.styles.commentaryHeading}>Book Intro</Text>
            <HTML
              baseFontStyle={this.styles.textString}
              tagsStyles={{ p: this.styles.textString }} html={this.props.commentaryContent.bookIntro} />
          </View>}
      </View>
    )

  }
  render() {
    console.log(" book name ",this.state.bookName)
    return (
      <View style={this.styles.container}>
        <Header style={{backgroundColor: Color.Blue_Color, height: 40, borderLeftWidth: 0.5, borderLeftColor: Color.White }} >
          <Body>
            <Title style={{ fontSize: 16 }}>{this.props.parallelLanguage.versionCode}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.toggleParallelView(false)}>
              <Icon name='cancel' color={Color.White} size={20} />
            </Button>
          </Right>
        </Header>

        {
          (this.props.error) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ReloadButton
                styles={this.styles}
                reloadFunction={this.updateData}
              />
            </View>
            :
            <View style={{ flex: 1 }}>
              <Text style={[this.styles.commentaryHeading, { margin: 10 }]}>{this.state.bookName} {} {this.props.commentaryContent.chapter}</Text>
              <FlatList
                data={this.props.commentaryContent.commentaries}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, margin: 16 }}
                renderItem={this.renderItem}
                ListFooterComponent={<View style={{ height: 40, marginBottom: 40 }}></View>}
                ListHeaderComponent={this.ListHeaderComponent}
              />
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
    downloaded: state.updateVersion.downloaded,
    bookId: state.updateVersion.bookId,
    bookName:state.updateVersion.bookName,



    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,

    contentType: state.updateVersion.contentType,
    books: state.versionFetch.data,

   
    commentaryContent: state.commentaryFetch.commentaryContent,
    error: state.commentaryFetch.error,
  }

}
const mapDispatchToProps = dispatch => {
  return {

    fetchCommentaryContent: (payload) => dispatch(fetchCommentaryContent(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Commentary)