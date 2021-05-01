import React, { Component } from 'react';
import {
  Text,
  Alert
} from 'react-native';
import { connect } from 'react-redux'
import { selectContent } from '../../store/action/'
import { getResultText } from '../../utils/UtilFunctions'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Color from '../../utils/colorConstants'
class VerseView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unableSelection: false
    }
  }
  onPress() {
    this.props.getSelection(
      this.props.index,
      this.props.chapterNumber,
      this.props.verseData.verseNumber,
      this.props.verseData.verseText
    );
    this.setState({ unableSelection: false })
  }

  has(selectedReferences, obj) {
    for (var i = 0; i < selectedReferences.length; i++) {
      if (selectedReferences[i] == obj) {
        if (this.props.visibleParallelView) {
          this.props.selectContent({
            modalVisible: false,
            parallelMetaData: null,
            visibleParallelView: false,
            parallelLanguage: null
          })
          Alert.alert("", "Your text is selected, please choose any option from the bottom bar or unselect the text.")
        }
        return true;
      }
    }
    return false;
  }
  getColor = (colorConst) => {
    let value = Color.highlightColorA.const
    switch (colorConst) {
      case Color.highlightColorA.const:
        // code 
        value = Color.highlightColorA.code
        break;
      case Color.highlightColorB.const:
        // code 
        value = Color.highlightColorB.code
        break;
      case Color.highlightColorC.const:
        // code 
        value = Color.highlightColorC.code
        break;
      case Color.highlightColorD.const:
        // code 
        value = Color.highlightColorD.code
        break;
      case Color.highlightColorE.const:
        // code 
        value = Color.highlightColorE.code
        break;
      default:
        value = Color.highlightColorA.code
      // code 
    }
    return value
  }
  isHighlight() {
    for (var i = 0; i <= this.props.HightlightedVerse.length; i++) {
      if (this.props.HightlightedVerse[i]) {
        let regexMatch = /(\d+)\:([a-zA-Z]+)/;
        let match = this.props.HightlightedVerse[i].match(regexMatch)
        if (match) {
          if (parseInt(match[1]) == this.props.verseData.verseNumber) {
            return this.getColor(match[2])
          }
        }
      }
    }
    return false
  }
  isNoted() {
    var arr = []
    for (var i = 0; i <= this.props.notesList.length - 1; i++) {
      for (var j = 0; j <= this.props.notesList[i].verses.length - 1; j++) {
        var index = arr.indexOf(this.props.notesList[i].verses[j])
        if (index == -1) {
          arr.push(this.props.notesList[i].verses[j])
        }
      }
    }
    var value = arr.filter(v => v == this.props.verseData.number)
    if (value[0]) {
      return true
    }
    else {
      return false
    }
  }
  goToNote = (verse_num) => {
    this.props.navigation.navigate("Notes", {
      chapterNumber: this.props.chapterNumber,
      bookId: this.props.bookId, verseNumber: verse_num
    })
  }

  render() {
    let verseNumber = this.props.downloaded ? this.props.verseData.number : this.props.verseData.verseNumber
    let verseText = this.props.downloaded ? this.props.verseData.text : this.props.verseData.verseText
    let sectionHeading = this.props.downloaded ? this.props.verseData.section : this.props.sectionHeading
    let obj = this.props.chapterNumber + '_' + this.props.index + '_' + verseNumber + '_' + verseText;
    let isSelect = this.has(this.props.selectedReferences, obj)
    let isHighlight = this.isHighlight()
    let isNoted = this.isNoted()

    if (verseNumber == 1) {
      return (
        <Text style={this.props.styles.textStyle}>
          {
            this.props.chapterHeader ?
              <Text style={this.props.styles.sectionHeading}>
                {this.props.chapterHeader} {"\n"}
              </Text>
              :
              null
          }
          <Text onPress={() => { this.props.downloaded ? null : this.onPress() }}>
            <Text style={this.props.styles.verseChapterNumber}>
              {this.props.chapterNumber}{" "}
            </Text>
            <Text
              style={[this.props.styles.textHighlight,
              isSelect && isHighlight ?
                {
                  backgroundColor: isHighlight,
                  textDecorationLine: 'underline'
                }
                : !isSelect && !isHighlight
                  ? this.props.styles.textHighlight
                  : !isSelect && isHighlight ? { backgroundColor: isHighlight }
                    : { textDecorationLine: 'underline' }]}

            >
              {getResultText(verseText)}
            </Text>
            {isNoted ? <Icon onPress={() => this.goToNote(verseNumber)} name="note-outline" size={20} style={{ padding: 8 }} /> : null}
          </Text>
          {
            sectionHeading ?
              <Text style={this.props.styles.sectionHeading}>
                {"\n"} {sectionHeading}
              </Text>
              : null
          }
        </Text>
      )
    }
    return (
      <Text style={this.props.styles.textStyle} onPress={() => { this.props.downloaded ? null : this.onPress() }} >
        <Text>
          <Text style={this.props.styles.verseNumber}>
            {verseNumber}{" "}
          </Text>
          <Text
            style={[this.props.styles.textHighlight,
            isSelect && isHighlight ?
              {
                backgroundColor: isHighlight,
                textDecorationLine: 'underline'
              }
              : !isSelect && !isHighlight
                ? this.props.styles.textHighlight
                : !isSelect && isHighlight ? { backgroundColor: isHighlight }
                  : { textDecorationLine: 'underline' }]}
          >
            {getResultText(verseText)}
          </Text>
          {isNoted ? <Icon onPress={() => this.goToNote(verseNumber)} name="note-outline" size={20} style={{ padding: 8 }} /> : null}
        </Text>
        {
          sectionHeading ?
            <Text style={this.props.styles.sectionHeading}>
              {"\n"} {sectionHeading}
            </Text>
            : null
        }
      </Text>
    )
  }
}

const mapStateToProps = state => {
  return {
    bookId: state.updateVersion.bookId,
    sourceId: state.updateVersion.sourceId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    visibleParallelView: state.selectContent.visibleParallelView,
    downloaded: state.updateVersion.downloaded
  }
}
const mapDispatchToProps = dispatch => {
  return {
    selectContent: (payload) => dispatch(selectContent(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerseView)