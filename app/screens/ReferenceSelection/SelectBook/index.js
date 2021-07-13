import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Segment, Button } from 'native-base'
import { SelectBookPageStyle } from './styles.js';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';
import Color from '../../../utils/colorConstants'
import { color } from 'react-native-reanimated';
const width = Dimensions.get('window').width;

//OT- old-testment
//NT- new-testment
class SelectBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: true,
      NTSize: 0,
      OTSize: 0,
      isLoading: false,
    }
    this.styles = SelectBookPageStyle(this.props.colorFile, this.props.sizeFile);
    this.navigateTo = this.navigateTo.bind(this)
    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 100,
      waitForInteraction: true
    }
  }
  toggleButton(value) {
    this.setState({ activeTab: value })
    if (value == false) {
      this.flatlistRef.scrollToIndex({ index: this.state.OTSize, viewPosition: 0, animated: false, viewOffset: 0 })
    }
    else {
      this.flatlistRef.scrollToIndex({ index: 0, viewPosition: 0, animated: false, viewOffset: 0 })
    }
  }
  getItemLayout = (data, index) => (
    { length: 48, offset: 48 * index, index }
  )
  navigateTo(item) {
    this.props.screenProps.updateSelectedBook(item)
    this.props.navigation.navigate('Chapters')
  }

  getOTSize = () => {
    var count = 0;
    if (this.props.books) {
      if (this.props.books.length == 0) {
        this.setState({ OTSize: 0 })
      } else {
        for (var i = 0; i < this.props.books.length; i++) {
          if (this.props.books[i].bookNumber <= 39) {
            count++;
          }
          else {
            break;
          }
        }
      }
    }
    this.setState({ OTSize: count })
  }

  getNTSize = () => {
    var count = 0;
    if (this.props.books) {
      if (this.props.books.length == 0) {
        this.setState({ NTSize: 0 })
      } else {
        for (var i = this.props.books.length - 1; i >= 0; i--) {
          if (this.props.books[i].bookNumber >= 40) {
            count++
          }
          else {
            break;
          }
        }
      }
    }

    this.setState({ NTSize: count })
  }

  componentDidMount() {
    this.getOTSize()
    this.getNTSize()
    this.selectTab()
  }
  selectTab(){
    let bookData = null
    let bookIndex = -1
    if (this.props.books.length > 0) {
      for (var i = 0; i < this.props.books.length; i++) {
        if(this.props.books[i].bookId == this.props.screenProps.selectedBookId){
          bookData = this.props.books[i]
          bookIndex = i
        }
      }
      if(bookData && bookIndex != -1){
        if (bookData.bookNumber >= 40) {
          this.setState({ activeTab: false })
        } else {
          this.setState({ activeTab: true })
        }
        let wait = new Promise((resolve) => setTimeout(resolve, 500)); 
        wait.then( () => {
        this.flatlistRef.scrollToIndex({ index: bookIndex, viewPosition: 0, animated: false, viewOffset: 0 })
        });
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.books !== this.props.books) {
      this.getOTSize()
      this.getNTSize()
      this.selectTab()
    }
  }
  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.navigateTo(item)}>
        <View
          style={this.styles.bookList}>
          <Text
            style={[this.styles.textStyle,
            { fontWeight: item.bookId == this.props.screenProps.selectedBookId ? "bold" : "normal",
            color: item.bookId == this.props.screenProps.selectedBookId ?  this.props.colorFile.blueText : this.props.colorFile.textColor
           }
            ]}
          >
            {item.bookName}
          </Text>
          <Icon
            name='chevron-right'
            color={Color.Gray}
            style={this.styles.iconCustom}
          />
        </View>
      </TouchableOpacity>
    );
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      if (viewableItems[0].index < this.state.OTSize) {
        // toggel to OT
        this.setState({ activeTab: true })
      } else {
        // toggle to NT
        this.setState({ activeTab: false })
      }
    }
  }

  render() {
    return (
      <View style={this.styles.container}>
        {this.props.isLoading ?
          <Spinner
            visible={true}
            textContent={'Loading...'}
          />
          :
          <View style={this.styles.bookNameContainer}>
            <Segment>
              {
                this.state.OTSize > 0
                  ?
                  <Button
                    active={this.state.activeTab}
                    style={[{
                      width: this.state.NTSize == 0 ? width : width * 1 / 2,
                    },
                    this.state.activeTab ? this.styles.activeBgColor : this.styles.inactiveBgColor,
                    this.styles.segmentButton]}
                    onPress={this.toggleButton.bind(this, true)
                    }
                  >
                    <Text
                      style={
                        this.state.activeTab ? this.styles.inactivetabText : this.styles.activetabText
                      }>
                      Old Testament
                </Text>
                  </Button>
                  : null}
              {
                this.state.NTSize > 0
                  ?
                  <Button
                    active={!this.state.activeTab}
                    style={[{
                      width: this.state.OTSize == 0 ? width : width * 1 / 2,
                    },
                    !this.state.activeTab ? this.styles.activeBgColor : this.styles.inactiveBgColor,
                    this.styles.segmentButton]}
                    onPress={this.toggleButton.bind(this, false)}>
                    <Text
                      active={!this.state.activeTab}
                      style={[
                        !this.state.activeTab ? this.styles.inactivetabText : this.styles.activetabText,
                        this.styles.buttonText]
                      }>
                      New Testament
                    </Text>
                  </Button>
                  : null}
            </Segment>
            <FlatList
              ref={ref => this.flatlistRef = ref}
              data={this.props.books}
              getItemLayout={this.getItemLayout}
              onScroll={this.handleScroll}
              renderItem={this.renderItem}
              extraData={this.styles}
              keyExtractor={item => item.bookNumber}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={this.viewabilityConfig}
              contentContainerStyle={{ paddingBottom: 60 }}
              ListFooterComponent={<View style={{ marginBottom: 84 }} />}
            />
          </View>
        }
        {/* {(this.props.books && this.props.books.length > 0) && <Icon name="check-circle" color='rgba(62, 64, 149, 0.8)' onPress={() => this.props.screenProps.updateSelectedChapter(null, null)} size={64} style={{ position: 'absolute', bottom: 0, right: 0, paddingRight: 20,paddingBottom:10}} />} */}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    books: state.versionFetch.data,
    isLoading: state.versionFetch.isLoading,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
export default connect(mapStateToProps, null)(SelectBook)