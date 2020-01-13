import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Segment,Button,Tab,Tabs} from 'native-base'
import { SelectBookPageStyle } from './styles.js';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import {AsyncStorageConstants} from '../../../utils/AsyncStorageConstants'

import {getBookNameFromMapping,getBookSectionFromMapping,getBookNumberFromMapping,getBookChaptersFromMapping} from '../../../utils/UtilFunctions';
import DbQueries from '../../../utils/dbQueries.js';
import {connect} from 'react-redux'
import {selectedBook,addBookToNote,fetchAPI} from '../../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import {API_BASE_URL} from '../../../utils/APIConstant'

class SelectBook extends Component {
  constructor(props){
    super(props)
    this.state = {
      colorFile:this.props.colorFile,
      sizeFile:this.props.sizeFile,
      colorMode:this.props.colorMode,
      activeTab:true,
      bookList: [],
      // OTSize:this.getOTSize(),
      OTSize: function(){
          var count = 0;
          if(this.bookList.length == 0){
          return 0
          }else{
            for(var i=0 ; i<this.bookList.length ; i++){
              if(this.bookList[i].bookNumber <= 39){
                count ++;
              }
              else{
                break;
              }
            }
          }
   
    return count 
    },
      NTSize:function(){
        var count = 0;
        if(this.bookList.length == 0 ){
          return 0
        }else{
          for(var i=this.bookList.length-1 ; i>=0 ; i--){
            if(this.bookList[i].bookNumber >= 40){
              count++
            }
            else{
              break;
            }
          }
        }
        return count 
      },
      isLoading:false
    }
    this.styles = SelectBookPageStyle(this.state.colorFile, this.state.sizeFile);
    this.navigateToChapter = this.navigateToChapter.bind(this)
    this.viewabilityConfig = {
        itemVisiblePercentThreshold: 100,
        waitForInteraction: true
    }
  }

  toggleButton(value){
    this.setState({activeTab:value})
    if(value == false){
      this.flatlistRef.scrollToIndex({index:this.state.OTSize(),viewPosition:0,animated: false,viewOffset:0})
    }
    else{
      this.flatlistRef.scrollToIndex({index:0,viewPosition:0,animated: false,viewOffset:0})
    }
  }
  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.sourceId!==prevState.sourceId){
      return { sourceId: nextProps.sourceId};
   }
   else return null;
 }
 
  getItemLayout = (data, index) => (
    { length: 48, offset: 48 * index, index }
  )
  async  fetchbookList(){
    var bookListData=[]
    switch(this.props.contentType){
      case 'bible' :
      {
      if(this.props.downloaded == true){
        this.setState({isLoading:true})
        var booksid = await DbQueries.getDownloadedBook(this.props.language,this.props.version)
        // console.log("res ",booksid)
        for(var i = 0; i<=booksid.length-1;i++){
          var bookId = booksid[i]
          var books= {
                bookId:bookId,
                bookName:getBookNameFromMapping(bookId,this.props.language),
                section:getBookSectionFromMapping(bookId),
                bookNumber:getBookNumberFromMapping(bookId),
                languageName: this.props.language, 
                versionCode:this.props.version, 
                // numOfChapters:getBookChaptersFromMapping(bookId)
            }
                bookListData.push(books)
          }
      }
      else{
      this.setState({isLoading:true})
      var apiURL = API_BASE_URL + "bibles" + "/" + this.props.sourceId + "/" + "books"
      await this.props.fetchAPI(apiURL)
      var booksid = await this.props.apiData.json()
      console.log("BOOKS ID BOOKS ",booksid)
      if(booksid.length !==null){
        for(var i =0; i<=booksid[0].books.length-1; i++){
          var bookId = booksid[0].books[i].abbreviation
          var books= {
              bookId:bookId,
              bookName: getBookNameFromMapping(bookId,this.props.language),
              section:getBookSectionFromMapping(bookId),bookNumber:getBookNumberFromMapping(bookId),
              bookNumber:getBookNumberFromMapping(bookId),
              languageName: this.props.language, 
              versionCode:this.props.version, 
              // numOfChapters:getBookChaptersFromMapping(bookId)
          }
          bookListData.push(books)
        }
      }
      }
      var res = bookListData.length == 0 ? [] : bookListData.sort(function(a, b){return a.bookNumber - b.bookNumber})
      console.log("response data ",res)
      this.setState({bookList:res,isLoading:false}) 
      }
      break;
      case 'commentary' :{
        alert("sorry commentary for english available")
      }
      break;
      case 'infographics' :
      {
        alert("sorry infographics not available")
      }
      break;
      default: 
      {
        alert("default ")
      }
    }
    
}
  componentDidMount(){
    this.fetchbookList()
    this.setState({
      colorFile:this.props.colorFile,
      colorMode: this.props.colorMode,
      sizeFile:this.props.sizeFile,
      lastRead:this.props.screenProps.lastRead,
    })
  this.styles = SelectBookPageStyle(this.props.colorFile, this.props.sizeFile);   
  }

  navigateToChapter(item){
    this.props.selectedBook(item.bookId,item.bookName,getBookChaptersFromMapping(item.bookId))
    this.props.addBookToNote(item.bookId,item.bookName,getBookChaptersFromMapping(item.bookId))
    this.props.navigation.navigate('Chapters')
  }
renderItem = ({item, index})=> {
    return (
      <TouchableOpacity 
          onPress={()=>{this.navigateToChapter(item,index)}}>
          <View 
            style={this.styles.bookList}>
            <Text
              style={
                [this.styles.textStyle,{fontWeight:item.bookName == this.props.bookName ? "bold" : "normal"}]
              }
              >
              {item.bookName}
            </Text>
            <Icon 
              name='chevron-right' 
              color="gray" 
              style={this.styles.iconCustom}
              />
          </View>
        </TouchableOpacity>
    );
  }

  getOTSize(){
    console.log("book list in ot ",this.state.bookList)
    var count = 0;
    if(this.state.bookList.length == 0){
     return
    }else{
      for(var i=0 ; i<this.state.bookList.length ; i++){
        if(this.state.bookList[i].bookNumber <= 39){
          count ++;
        }
        else{
          break;
        }
      }
    }
   
    return count 
  }

  getNTSize(){

    var count = 0;
    if(this.state.bookList.length == 0 ){
      return
    }else{
      for(var i=this.state.bookList.length-1 ; i>=0 ; i--){
        if(this.state.bookList[i].bookNumber >= 40){
          count++
        }
        else{
          break;
        }
      }
    }
    
    return count 
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
      if (viewableItems.length > 0) {
        if (viewableItems[0].index < this.state.OTSize()) {
          // toggel to OT
          this.setState({activeTab:true})
        } else {
          // toggle to NT
          this.setState({activeTab:false})
        }
      }
  }


  render(){
    console.log(" this.props.contentType " ,this.props.apiData)
    let activeBgColor = this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#3F51B5' : '#fff'
    let inactiveBgColor =  this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#fff' : '#3F51B5'
    return (
      <View style={this.styles.container}>
      { this.props.isFetching && 
         <Spinner
         visible={true}
         textContent={'Loading...'}
        //  textStyle={styles.spinnerTextStyle}
          />
      }
        <View style={this.styles.bookNameContainer}>
        <Segment>
              {
                this.state.OTSize() > 0 
              ?
              <Button 
                active={this.state.activeTab} 
                style={[{
                  backgroundColor: this.state.activeTab ? activeBgColor : inactiveBgColor,
                  width: this.state.NTSize() == 0 ? width : width*1/2,
                  },this.styles.segmentButton]} 
                onPress={this.toggleButton.bind(this,true)
                }
              >
                <Text 
                  style={{color:this.state.activeTab ? inactiveBgColor : activeBgColor
                  }}>
                  Old Testament
                </Text>
              </Button>
              : null}
              {
                this.state.NTSize() > 0 

              ?
              <Button 
                active={!this.state.activeTab} 
                style={[{
                  backgroundColor: !this.state.activeTab ? activeBgColor : inactiveBgColor,
                  width: this.state.OTSize() == 0 ? width : width*1/2,                  
                },this.styles.segmentButton]} 
                onPress={this.toggleButton.bind(this,false)}>
                <Text 
                  active={!this.state.activeTab} 
                  style={[
                    {
                      color:!this.state.activeTab ? inactiveBgColor : activeBgColor
                    },this.styles.buttonText]
                  }>
                  New Testament
                </Text>
              </Button>
              :null}
            </Segment>
            <FlatList
              ref={ref => this.flatlistRef = ref}
              data={this.state.bookList}
              getItemLayout={this.getItemLayout}
              onScroll={this.handleScroll}
              renderItem={this.renderItem}
              extraData={this.styles}
              keyExtractor={item => item.bookNumber}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={this.viewabilityConfig}
            />
        </View> 
      
      </View>
    );
  }

}


const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    version:state.updateVersion.version,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    contentType:state.updateVersion.contentType,
    
    bookId:state.updateVersion.bookId,
    bookName:state.updateVersion.bookName,

    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    colorMode:state.updateStyling.colorMode,

    apiData:state.APIFetch.data,
    isFetching:state.APIFetch.isFetching,

    error:state.APIFetch.error
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedBook:(bookId,bookName,totalChapters) =>dispatch(selectedBook(bookId,bookName,totalChapters)),
    addBookToNote:(bookId,bookName,totalChapters)=>dispatch(addBookToNote(bookId,bookName,totalChapters)),
    fetchAPI:(api) =>dispatch(fetchAPI(api))
  
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(SelectBook)