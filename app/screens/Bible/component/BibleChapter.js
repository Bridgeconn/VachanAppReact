import React, { Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import VerseView from '../VerseView'
// import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
// import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'
import Player from '../Navigate/Audio/Player';
// import {getResultText} from '../../utils/UtilFunctions';
import {getBookNameFromMapping,getBookChaptersFromMapping} from '../../../utils/UtilFunctions';
import {selectedChapter,fetchVersionLanguage,fetchVersionContent,fetchAudioUrl,fetchParallelBible} from '../../../store/action/'
import { styles } from '../styles';
import {connect} from 'react-redux'
import {Body,Header, Button,Right,Title} from 'native-base'
class BibleChapter extends Component {
    constructor(props){
        super(props)
        this.styles = styles(this.props.colorFile, this.props.sizeFile);    
    }
    queryParallelBible =(val)=>{
        this.props.fetchParallelBible({isDownloaded:this.props.downloaded,sourceId:this.props.contentSourceId,language:this.props.contentLanguageCode,version:this.props.contentVersionCode,bookId:this.props.bookId,chapter:val != null ? this.props.currentVisibleChapter + val: this.props.chapterNumber})
    }
    componentDidMount(){
        this.queryParallelBible(null)
    }
    render(){
        console.log(" PARALLEL BIBLE ",this.props.parallelBible)
        return(
            <View>
                <Header style={{height:40,borderLeftWidth:0.5,borderLeftColor:'#fff'}}>
                <Body styel={{flexDirection:"row"}}>
                    <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab")}}>
                        <Title style={{fontSize:16}}>{getBookNameFromMapping(this.props.bookId,this.props.language).length > 8 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language)} {this.props.currentVisibleChapter}</Title>
                        <Icon name="arrow-drop-down" color="#fff" size={20}/>
                    </Button>
                </Body>
                <Right>
                <Button transparent onPress={()=>this.props.toggleParallelView(false)}>
                    <Icon name='close' color={'#fff'} size={20}/>
                </Button>
                </Right>
                </Header>
              <ScrollView ref={(ref) => { this.scrollViewRef = ref; }} >
                <View style={this.styles.chapterList}>
                    {this.props.parallelBible.map((verse, index) => 
                    <View>
                        <Text letterSpacing={24}
                            style={this.styles.verseWrapperText}>
                            <Text style={this.styles.verseNumber} >
                            {verse.number}{" "}
                            </Text>
                            <Text style={{fontFamily:'NotoSans-Regular'}}
                            >
                            {verse.text}
                        </Text>         
                        </Text>
                        {index == this.props.parallelBible.length - 1  && ( this.props.showBottomBar ? <View style={{height:64, marginBottom:4}} />: null ) }
                    </View>
                    )}
                </View>
                    
                </ScrollView>
                <View style={{justifyContent:(this.props.currentVisibleChapter != 1 &&  this.props.currentVisibleChapter != this.props.totalChapters) ? 'center' : 'space-around',alignItems:'center'}}>
                    {
                    this.props.currentVisibleChapter == 1 ? null :
                    <View style={this.styles.bottomBarPrevView}>
                        <Icon name={'chevron-left'} color="#3F51B5" size={32} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.queryParallelBible(-1)}
                        />
                    </View>
                    }
                    {
                    this.props.currentVisibleChapter == this.props.totalChapters.length ? null :
                    <View style={this.styles.bottomBarNextView}>
                        <Icon name={'chevron-right'} color="#3F51B5" size={32} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.queryParallelBible(1)}
                        />
                    </View>
                    }
                </View>
            </View>
        )
    }

}


const mapStateToProps = state =>{
    return{
        language: state.updateVersion.language,
        languageCode:state.updateVersion.languageCode,
        version:state.updateVersion.version,
        sourceId:state.updateVersion.sourceId,
        downloaded:state.updateVersion.downloaded,
        contentType:state.updateVersion.contentType,
    
        chapterNumber:state.updateVersion.chapterNumber,
        bookName:state.updateVersion.bookName,
        bookId:state.updateVersion.bookId,
        fontFamily:state.updateStyling.fontFamily,
    
        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
        close:state.updateSplitScreen.close,
  
        fetchedData:state.versionFetch,
        totalVerses:state.versionFetch.totalVerses,
  
        audioURL:state.audioFetch.url,
        availableCommentaries:state.commentaryFetch.availableCommentaries,
        commentary:state.commentaryFetch.commentaryContent,
        contentType:state.updateVersion.contentType,
        contentSourceId:state.updateVersion.contentSourceId,
        contentVersionCode:state.updateVersion.contentVersionCode,
        contentLanguageCode:state.updateVersion.contentLanguageCode,

        parallelBible:state.parallel.parallelBible
    }
  }

const mapDispatchToProps = dispatch =>{
    return {
      selectedChapter: (chapterNumber,totalVerses)=>dispatch(selectedChapter(chapterNumber,totalVerses)),
      fetchParallelBible:(data)=>dispatch(fetchParallelBible(data))
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(BibleChapter)