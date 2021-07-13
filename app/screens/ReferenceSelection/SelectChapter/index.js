import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import SelectionGrid from '../../../components/SelectionGrid/';
import { numberSelection } from './styles.js';
import { connect } from 'react-redux'
import {Icon} from 'native-base'

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
    this.props.screenProps.updateSelectedChapter(item, index)
  }
  render() {

    return (
      <View style={{ flex: 1 }}>
        <SelectionGrid
          styles={this.styles}
          onNumPress={(item, index) => { this.onNumPress(item, index) }}
          numbers={this.state.chapterData}
          heighlightedNumber={this.props.screenProps.selectedChapterNumber}
        />
        <Icon type="AntDesign" name="back" onPress={() => this.props.screenProps.updateSelectedChapter(this.props.screenProps.selectedChapterNumber, this.props.screenProps.selectedChapterIndex)} size={64} style={{ position: 'absolute', bottom: 0, right: 0, paddingRight: 20,paddingBottom:10,color:'rgba(62, 64, 149, 0.8)',fontSize:40 }} />
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