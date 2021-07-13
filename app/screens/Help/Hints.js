
import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { HelpStyle } from './styles.js';
import { connect } from 'react-redux'
import { constantFont } from '../../utils/dimens'
import Icon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const width = Dimensions.get('window').width;

class Help extends Component {
  static navigationOptions = {
    headerTitle: 'Hints',
  };
  constructor(props) {
    super(props)
    this.state = {
      index: null,
      iconName: [
        { icon: 'menu', pressIcon: 'Menu', hint: 'See all available functionality from left drawer', visible: false },
        { icon: 'volume-up', pressIcon: 'Audio', hint: 'Listen to audio Bible', visible: false },
        { icon: 'videocam', pressIcon: 'Video', hint: 'Watch Bible videos', visible: false },
        { icon: 'image', pressIcon: 'Image', hint: 'Infographic Images', visible: false },
        { icon: 'search', pressIcon: 'Search', hint: 'Search for text', visible: false },
        { icon: 'bookmark', pressIcon: 'Bookmarks', hint: 'Manage your bookmarks', visible: false },
        { icon: 'history', pressIcon: 'history', hint: 'See all your reading history', visible: false },
        { icon: 'note', pressIcon: 'Notes', hint: 'Manage your notes', visible: false },
        { icon: 'border-color', pressIcon: 'Highlights', hint: 'Manage your highlights', visible: false },
        { icon: 'settings', pressIcon: 'Settings', hint: 'Manage app settings', visible: false },
        { icon: 'book', pressIcon: 'Book', hint: 'Checkout Dictionary', visible: false },
        { icon: 'info', pressIcon: 'About', hint: 'Information about application', visible: false },
        { icon: 'book-open-variant', pressIcon: 'Multi-Content', hint: 'View content parallelly', visible: false },
        { icon: 'receipt', pressIcon: 'Bible-Stories', hint: 'Read Bible stories', visible: false },
        { icon: 'event', pressIcon: 'Reading-Plans', hint: 'Access Reading Plan', visible: false },

      ],
    }
    this.showHints = this.showHints.bind(this)
    this.styleFile = HelpStyle(this.props.colorFile, this.props.sizeFile);
    this.animatedValue = new Animated.Value(0)
  }
  showHints(icon, index) {
    let visibility = [...this.state.iconName];
    visibility[index] = { ...visibility[index], visible: true };
    this.setState({ iconName: visibility });
  }
  componentWillMount() {
    this.animatedValue = new Animated.Value(1);
  }


  handlePressIn = (index) => {

    this.setState({ index })
    Animated.spring(this.animatedValue, {
      toValue: 0
    }).start()
  }

  handlePressOut() {
    Animated.spring(this.animatedValue, {
      toValue: 1,
    }).start()
  }
  renderItem = ({ item, index }) => {
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }]
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <TouchableWithoutFeedback
          style={{
            width: width / 5,
          }}
          onPress={() => this.showHints(item.pressIcon, index)}
          onPressIn={() => this.handlePressIn(index)}
          onPressOut={() => this.handlePressOut()}
        >
          <Animated.View style={[this.styleFile.AnimatedViewCustom, { alignItems: 'center' }, this.props.doAnimate == true && index == this.state.index ? animatedStyle : null]}>

            {item.icon == 'book-open-variant' ? <MaterialCommunityIcons
              name={item.icon} size={constantFont.iconLarge}
              style={this.styleFile.iconColor}
            /> :
              <Icon name={item.icon} size={constantFont.iconLarge}
                style={this.styleFile.iconColor}
              />
            }
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={[this.styleFile.textView, { alignItems: 'flex-start' }]}>
          <View style={this.styleFile.textRow}>
            <Text style={this.styleFile.textStyle}>{item.visible ? item.hint : null}</Text>
          </View>
        </View>
      </View>
    )
  }
  render() {

    return (
      <View style={this.styleFile.container}>
        <FlatList
          data={this.state.iconName}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}


const mapStateToProps = state => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}

export default connect(mapStateToProps, null)(Help)