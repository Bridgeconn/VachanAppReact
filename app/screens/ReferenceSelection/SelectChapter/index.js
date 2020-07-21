import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import SelectionGrid from '../../../components/SelectionGrid/';
import { numberSelection } from './styles.js';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'



class ChapterSelection extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chapterData: Array.from(new Array(this.props.screenProps.totalChapters), (x, i) => i + 1),
    }
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return { chapterData: Array.from(new Array(nextProps.screenProps.totalChapters), (x, i) => i + 1) }
  }
  onNumPress = (item, index) => {
    console.log(" VALUE CHAPTER ", item)
    this.props.screenProps.updateSelectedChapter(item, index)
  }
  render() {
    console.log("props navigation", this.props.screenProps.selectedBookId)

    return (
      <View style={{ flex: 1 }}>
        <SelectionGrid
          styles={this.styles}
          onNumPress={(item, index) => { this.onNumPress(item, index) }}
          numbers={this.state.chapterData}
          heighlightedNumber={this.props.screenProps.selectedChapterNumber}
        />
        <Icon name="check-circle" color='rgba(62, 64, 149, 0.8)' onPress={() => this.props.screenProps.updateSelectedChapter(this.props.screenProps.selectedChapterNumber, this.props.screenProps.selectedChapterIndex)} size={64} style={{ position: 'absolute', bottom: 0, right: 0, padding: 20 }} />
      </View>

    )
  }
}
const mapStateToProps = state => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
export default connect(mapStateToProps, null)(ChapterSelection)