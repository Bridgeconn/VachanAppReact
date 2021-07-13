import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import { updateVersionBook } from '../../../store/action/'
import { getBookChaptersFromMapping } from '../../../utils/UtilFunctions'
import { GIT_BASE_API } from '../../../utils/APIConstant'
import { Agenda } from '../../../lib/react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { OBSStyle } from './styles.js'
import Color from '../../../utils/colorConstants'
var moment = require('moment');
const windowHeight = Dimensions.get('window').height
const width = Dimensions.get('window').width

class BRP extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    if (Object.keys(params).length > 0) {
      return {
        headerRight: (
          <TouchableOpacity style={{marginRight: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor:Color.white }}>
            <ModalDropdown
              options={params.plans}
              onSelect={params.onSelect}
              defaultValue={params.plans.length > 0 ? params.plans[0] : ''}
              isFullWidth={true}
              dropdownStyle={{ padding: 10, width: '60%', height: 'auto' }}
              adjustFrame={style => { params.plans.length > 2 ? 80 : -1; return style; }}
              dropdownTextStyle={{ fontSize: 18 }}
              textStyle={{ fontSize: 18, fontWeight: '800', color: '#fff' }}
            />
            <Icon name="arrow-drop-down" color={'#fff'} size={20} />
          </TouchableOpacity>
        )
      }
    }

  }
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      chapterNumber: null,
      planSelected: null,
      planList: [],
      monthItems: [],
      manifestData: [],
      readingPlan: [],
      calendarOpened: false
    }
    this.styles = OBSStyle(this.props.colorFile, this.props.sizeFile);
    this._dropdown_1  = null
  }
  laodMonthItem(day) {
    if (Object.keys(this.state.items).length > 0) {
      // let validDate = false
      for (var key in this.state.items) {
        if (day.dateString != 'undefined' && day.dateString == key) {
          // validDate = true
          let val = this.state.items
          val.key = val[key]
          this.setState({ monthItems: val })
        }
      }
      // if(!validDate){
      //   this.setState({ monthItems: [] })
      // }
    }

  }
  loadItems() {
    var currentYear = new Date().getFullYear();
    this.state.items = []
    if (this.state.readingPlan) {
      for (var i = 0; i < this.state.readingPlan.length; i++) {
        let planDate = currentYear + '-' + this.state.readingPlan[i].date
        if (!this.state.items[planDate]) {
          this.state.items[planDate] = []
          this.state.items[planDate].push({
            reading: this.state.readingPlan[i].reading,
            height: Math.max(50, Math.floor(Math.random() * 80))
          });
        }
      }
    }
    const newItems = {};
    if (this.state.items.length > 0) {
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems
      });
    }
  }
  navigateTo(item) {
    var words = item.split(" ");
    let bookId = words[0]
    let chapterNumber = words[1].match(/\d+/g)
    let bookName = null
    let bookNumber = null
    if (this.props.books) {
      if (this.props.books.length > 0) {
        for (var i = 0; i < this.props.books.length; i++) {
          if (this.props.books[i].bookId == bookId) {
            bookName = this.props.books[i].bookName
            bookNumber = this.props.books[i].bookNumber
          }
        }
      }
    }
    if (bookNumber && bookName) {
      this.props.updateVersionBook({
        bookId: bookId,
        bookName: bookName,
        chapterNumber: chapterNumber[0],
        totalChapters: getBookChaptersFromMapping(bookId)
      })
      this.props.navigation.navigate('Bible')
    } else {
      let language = this.props.languageName && this.props.languageName.charAt(0).toUpperCase() + this.props.languageName.slice(1)
      Alert.alert("", "Book is unvailable in " + language)
    }
  }
  renderItem(item) {
    return item.reading.map((val) => {
      return (
        <TouchableOpacity
          style={[this.styles.item, { height: item.height }]}
          onPress={() => this.navigateTo(val.ref)}
        >
          <Text style={this.styles.textStyle}>{val.text}</Text>
        </TouchableOpacity>
      )
    });

  }

  rowHasChanged(r1, r2) {
    r1.reading.filter((val1) => {
      r2.reading.filter((val2) => {
        return val1.ref !== val2.ref
      })
    })
  }
  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  componentDidMount() {
    try {
      this.props.navigation.setParams({
        plans: this.state.planList,
        onSelect: this.onSelect,
      })
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      let selectedDate = yyyy + "-" + mm + '-' + dd
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      let currentMonth = monthNames[mm - 1] + ' ' + yyyy
      this.setState({ selectedDate, currentMonth })
      fetch(GIT_BASE_API + 'bible_reading_plans/manifest.json',)
        .then((response) => response.json())
        .then((json) => {
          let planList = []
          for (var i = 0; i < json.length; i++) {
            planList.push(json[i].name)
          }
          this.setState({ planList, manifestData: json })
          this.props.navigation.setParams({
            plans: planList,
          })
          fetch(GIT_BASE_API + 'bible_reading_plans/' + this.state.manifestData[0].file)
            .then((response) => response.json())
            .then((json) => {
              this.setState({ readingPlan: json }, () => {
                this.loadItems()
              })
              this.laodMonthItem({ dateString: selectedDate })
            })
        })
    } catch (error) {
    }
  }
  onSelect = (value) => {
    try {
      let val = this.state.manifestData[value].file
      fetch(GIT_BASE_API + 'bible_reading_plans/' + val)
        .then((response) => response.json())
        .then((json) => {
          this.setState({ planSelected: (String(this.state.planList[value])), readingPlan: json }, () => {
            this.props.navigation.setParams({
              plans: this.state.planList,
            })
            this.loadItems()
          })
        })
    } catch (error) {

    }
  }

  onDayPress(date) {
    // var today = new Date();
    // var currentYear = today.getFullYear()
    // if(date.year ===currentYear){
    this.agenda.onDayChange(date.dateString);
    this.setState({ currentMonth: `${moment(date.dateString).format('MMMM')}` + ' ' + date.year })
    // }

  }
  renderCustomHeader(date) {
    const header = date.toString('MMMM yyyy');
    const [month, year] = header.split(' ');
    const textStyle = {
      fontSize: 18,
      fontWeight: 'bold',
      paddingTop: 10,
      paddingBottom: 10,
      color: '#3E4095',
      paddingRight: 5
    };

    return (
      <View style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
      }}>
        <Text style={[{ marginLeft: 5 }, textStyle]}>{`${month}`}</Text>
        <Text style={[{ marginLeft: 5 }, textStyle]}>{year}</Text>
      </View>
    );
  }
  onUpdateSelectedDate = (date, f = true) => {
    this.setState({ currentMonth: `${moment(date.dateString).format('MMMM')}` + ' ' + date.year })
  }
  renderKnob = () => {
    return (
      <Icon name='keyboard-arrow-down' size={24} color={this.props.colorFile.blueText} />
    )
  }
  renderEmptyData() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: '#3E4095' }}>Plan is available only for current year{'\n'}</Text>
      </View>
    )
  }
  render() {
    const themeStyle = {
      calendarBackground: this.props.colorFile.backgroundColor, //agenda background
      agendaKnobColor: this.props.colorFile.blueText, // knob color
      backgroundColor: this.props.colorFile.backgroundColor, // background color below agenda
      agendaDayTextColor: this.props.colorFile.textColor, // day name
      agendaDayNumColor: this.props.colorFile.textColor, // day number
      agendaTodayColor: this.props.colorFile.textColor, // today in list
      monthTextColor: this.props.colorFile.textColor, // name in calendar
      textDefaultColor: this.props.colorFile.textColor,
      todayBackgroundColor: this.props.colorFile.backgroundColor,
      textSectionTitleColor: this.props.colorFile.textColor,
      selectedDayBackgroundColor: this.props.colorFile.blueText, // calendar sel date
      dayTextColor: this.props.colorFile.textColor, // calendar day
      dotColor: this.props.colorFile.blueText, // dots
      textDisabledColor: this.props.colorFile.textColor,
    }
    return (
      <View style={this.styles.container}>
        {Object.keys(this.state.items).length > 0 ?
          <View style={{ flex: 1 }}>
            <Text style={[this.styles.agendaDate, { color: this.state.calendarOpened ? this.props.colorFile.backgroundColor : this.props.colorFile.textColor }]}>{this.state.currentMonth}</Text>
            <Agenda
              style={[this.styles.agendaBackgroundColor]}
              items={this.state.monthItems}
              ref={ref => {
                this.agenda = ref;
              }}
              renderEmptyData={this.renderEmptyData.bind(this)}
              loadItemsForMonth={this.laodMonthItem.bind(this)}
              // onMonthChange={(month) => {console.log('month changed', month)}}
              selected={this.state.selectedDate}
              renderItem={this.renderItem.bind(this)}
              rowHasChanged={this.rowHasChanged.bind(this)}
              pastScrollRange={new Date().getMonth()}
              futureScrollRange={12 - parseInt(new Date().getMonth() + 1)}
              renderKnob={this.renderKnob}
              onDayPress={this.onUpdateSelectedDate}
              onCalendarToggled={(calendarOpened) => { this.setState({ calendarOpened }) }}
              theme={themeStyle}
            />
          </View>
          : <ActivityIndicator animate={true} style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }} />}
      </View>
    );
  }

};

const mapStateToProps = state => {
  return {
    books: state.versionFetch.data,
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BRP)
