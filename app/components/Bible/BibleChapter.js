import React, { Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import {fetchParallelBible} from '../../store/action'
import { styles } from './styles';
import {connect} from 'react-redux'
import {Header, Button,Right,Title} from 'native-base'

class BibleChapter extends Component {
    constructor(props){
        super(props)
        this.styles = styles(this.props.colorFile, this.props.sizeFile);    
        this.state={
            currentParallelViewChapter:JSON.parse(this.props.currentChapter),
            id:this.props.id,
            bookName:this.props.bookName,
            totalChapters:this.props.totalChapters,
            totalVerses:this.props.totalVerses
        }
        this.alertPresent = false
    }
    queryParallelBible =(val)=>{
         console.log(" qQUERYBIBLE PARALLEL ",val,"totalChapters ",this.props.totalChapters)
        this.setState({currentParallelViewChapter:val != null ? this.state.currentParallelViewChapter + val : this.props.currentChapter},()=>{
        this.props.fetchParallelBible({isDownloaded:false,sourceId:this.props.parallelContentSourceId,language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,bookId:this.state.id,
            chapter:this.state.currentParallelViewChapter})
            // this.setState({currentParallelViewChapter:this.state.currentParallelViewChapter
            // })
        })
    }
    getRef=(item)=>{
        console.log(" QUERYBIBLE PARALLEL ITEM",item)
        this.setState({currentParallelViewChapter:item.chapterNumber},()=>{
            this.props.fetchParallelBible({isDownloaded:false,sourceId:this.props.parallelContentSourceId,
                language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,
                bookId:item.bookId,chapter:item.chapterNumber})
                this.setState({
                    currentParallelViewChapter:item.chapterNumber,
                    id:item.bookId,
                    bookName:item.bookName,
                    totalChapters:item.totalChapters
                })
            })
    }
    componentWillUnmount(){
        console.log( "component UN Mount  ")
    }
    componentDidMount(){
        console.log( "componentDidMount  ",this.props.books)
        this.queryParallelBible(null)
    }
    //for updating bible content 
    // componentWillUpdate(nextProps) {
    //     console.log(" PREV PROP ",this.props.currentVisibleChapter,nextProps.currentVisibleChapter)
    //     if (this.props.bookId != nextProps.bookId || nextProps.currentVisibleChapter != this.props.currentVisibleChapter) {
    //     this.props.fetchCommentaryContent({parallelContentSourceId:this.props.parallelContentSourceId,bookId:nextProps.bookId,chapter:nextProps.currentVisibleChapter})
    //     // bar prop has changed
    //     }
    // }

    errorMessage(){
        console.log("props ",this.props.error)
        if (!this.alertPresent) {
            this.alertPresent = true;
            if (this.props.error) {
                Alert.alert("", "Check your internet connection", [{text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
            } else {
                this.alertPresent = false;
            }
        }
    }

    updateData = ()=>{
      if(this.props.error){
        this.errorMessage()
        this.queryParallelBible(null)
      }
      else{
        return
      }
    }
   
    render(){
        console.log(" FETCH VERSION BOOKS ",this.props.books)

        const bookId = this.state.id
        const value = this.props.books.length !=0 && this.props.books.filter(function (entry){
            return  entry.bookId == bookId
         })
         console.log("VALUE ",value,this.state.bookName)
        const bookName = value ?  value[0].bookName : this.state.bookName
        this.styles = styles(this.props.colorFile, this.props.sizeFile);    
        return(
            <View style={this.styles.container}>
                <Header style={{height:40, borderLeftWidth:0.2, borderLeftColor:'#fff'}}>
                {/* <Left>  */}
                    <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab",{getReference:this.getRef,parallelContent:true,bookId:this.state.id,bookName:this.state.bookName,chapterNumber:this.state.currentParallelViewChapter,totalChapters:this.state.totalChapters,totalVerses:this.state.totalVerses})}}>
                        <Title style={{fontSize:16}}>{bookName.length > 8 ? bookName.slice(0,7)+"..." : bookName} {this.state.currentParallelViewChapter}</Title>
                        <Icon name="arrow-drop-down" color="#fff" size={20}/>
                    </Button>
                {/* </Left>  */}
                <Right>
                <Button transparent onPress={()=>this.props.toggleParallelView(false)}>
                    <Icon name='cancel' color={'#fff'} size={20}/>
                </Button>
                </Right>
                </Header>
                {this.props.isLoading &&
                    <Spinner
                    visible={true}
                    textContent={'Loading...'}
                    //  textStyle={styles.spinnerTextStyle}
                />}
                {(this.props.error) ?
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity 
                    onPress={()=>this.updateData()}
                    style={{height:40,width:120,borderRadius:4,backgroundColor:'#3F51B5',
                    justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:18,color:'#fff'}}>Reload</Text>
                    </TouchableOpacity>
                    </View>
                :
                <ScrollView showsVerticalScrollIndicator={false} ref={(ref) => { this.scrollViewRef = ref; }} >
                <View style={this.styles.chapterList}>
                    {this.props.parallelBible.map((verse, index) => 
                    <View>
                        {verse.number == 1 ? 
                        <Text letterSpacing={24}
                        style={this.styles.verseWrapperText}>
                        <Text style={this.styles.sectionHeading}>
                            {verse.metadata ? (verse.metadata[0].section && verse.metadata[0].section.text+"\n"): null }
                        </Text>
                        <Text style={this.styles.verseChapterNumber} >
                        {this.state.currentParallelViewChapter}{" "}
                        </Text>
                        <Text style={this.styles.textString}
                        >
                        {verse.text}
                        </Text>         
                        </Text>
                        :
                        <Text letterSpacing={24}
                            style={this.styles.verseWrapperText}>
                                <Text style={this.styles.sectionHeading}>
                            {verse.metadata ? (verse.metadata[0].section && verse.metadata[0].section.text+"\n"): null }
                                </Text>
                            <Text style={this.styles.verseNumber} >
                            {verse.number}{" "}
                            </Text>
                            <Text style={this.styles.textString}
                            >
                            {verse.text}
                        </Text>         
                        </Text>
                        }
                    {index == this.props.parallelBible.length - 1  && ( this.props.showBottomBar ? <View style={{height:64, marginBottom:4}} />: null ) }
                    </View>
                    )}
                </View>
                </ScrollView> 
            //     <FlatList
            //     data={this.props.parallelBible}
            //     contentContainerStyle={{flexGrow:1,margin:16}}
            //     extraData={this.state}
            //     // showsHorizontalScrollIndicator={false}
            //     showsVerticalScrollIndicator={false}
            //     renderItem={({verse, index}) => 
            //     <View>
            //         <Text letterSpacing={24}
            //             style={this.styles.verseWrapperText}>
            //             <Text style={this.styles.verseNumber} >
            //             {verse.number}{" "}
            //             </Text>
            //             <Text style={{fontFamily:'NotoSans-Regular'}}
            //             >
            //             {verse.text}
            //         </Text>         
            //         </Text>
            //     {/* {index == this.props.parallelBible.length - 1  && ( this.props.showBottomBar ? <View style={{height:64, marginBottom:4}} />: null ) } */}
            //     </View>
            //     }
            //     keyExtractor={this._keyExtractor}
            //     ListFooterComponent={<View style={this.styles.addToSharefooterComponent}></View>}
            //     // ListFooterComponentStyle={}

            //   />
            }
                {/* <View> */}
                    {
                    this.state.currentParallelViewChapter == 1 ? null :
                    <View  style={this.styles.bottomBarParallelPrevView}>
                        <Icon name={'chevron-left'} color="#3F51B5" size={16} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.queryParallelBible(-1)}
                        />
                    </View>
                    }
                    {
                    this.state.currentParallelViewChapter == this.state.totalChapters   ? null :
                    <View style={this.styles.bottomBarNextParallelView}>
                        <Icon name={'chevron-right'} color="#3F51B5" size={16} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.queryParallelBible(1)}
                        />
                    </View>
                    }
                {/* </View> */}
            </View>
        )
    }

}


const mapStateToProps = state =>{
    return{
        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
        books:state.versionFetch.data,
        // downloaded:false,

        parallelContentSourceId:state.updateVersion.parallelContentSourceId,
        parallelContentVersionCode:state.updateVersion.parallelContentVersionCode,
        parallelContentLanguage:state.updateVersion.parallelContentLanguage,
        parallelContentLanguageCode:state.updateVersion.parallelContentLanguageCode,
        parallelBible:state.parallel.parallelBible,
        parallelContentType:state.updateVersion.parallelContentType,

        error:state.parallel.error,
        loading:state.parallel.loading
    }
  }

const mapDispatchToProps = dispatch =>{
    return {
      fetchParallelBible:(data)=>dispatch(fetchParallelBible(data))
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(BibleChapter)