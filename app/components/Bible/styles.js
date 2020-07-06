import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Color from '../../utils/colorConstants'

export const styles =(colorFile, sizeFile) =>{
    // console.log("color file ",colorFile,sizeFile)
    return StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorFile.backgroundColor
        
    },
    verseWrapperText:{
        fontSize:sizeFile.contentText,
        color:colorFile.textColor,
        justifyContent:'center',
        
    },
    modalContainer:{
        backgroundColor:colorFile.backgroundColor,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
            
    },
    accordionHeader:{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor:colorFile.backgroundColor,
        },
        accordionHeaderText:{
            color:colorFile.textColor,
            fontWeight: "600" 
        },
    chapterList:{
        margin:16
    },
    footerComponent:{
        height:64,
        marginBottom:4
    },
    bottomBar:{
        position:'absolute', 
        bottom:0,
        width: width, 
        height: 62, 
        flexDirection:'row',
        justifyContent:'center'

    },
    bottomOption:{
        flexDirection:'row',
        width:width/3,
        justifyContent:'center',
        alignItems:'center',
    },
 
     
    bottomOptionText:{
        textAlign:'center',
        color:Color.White,   
        fontSize:16

    },
    bottomOptionIcon:{
        alignSelf:'center',
        fontSize:16 
    },
    bottomOptionSeparator:{
        width: 1,
        backgroundColor:Color.White,
        marginVertical:8,
        
    },
    VerseText:{
        // fontFamily:fontfamily, 
        fontWeight:'100'
    },

    textString:{
        fontSize:sizeFile.contentText,
        color:colorFile.textColor,
        fontWeight:'normal',
        lineHeight:sizeFile.lineHeight,
        paddingVertical:4
    },
    sectionHeading:{
        fontWeight:'normal',
        lineHeight:sizeFile.lineHeight,
        fontSize:sizeFile.contentText + 1,
        color:colorFile.sectionHeading,
    },
    bottomBarParallelPrevView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:40,
        width:40,
        borderRadius: 28,
        bottom:36,
        left:8
    },
    bottomBarPrevView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:56,
        width:56,
        borderRadius:32,
        margin:8,
        bottom:20,
        left:0
        
    },
    bottomBarNextParallelView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:40,
        width:40,
        borderRadius: 28,
        bottom:36,
        right:8
    },

    bottomBarNextView:{
        height:56,
        width:56,
        borderRadius:32,
        margin:8,
        bottom:20,
        right:0,
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center'
    },

    bottomBarAudioCenter:{
        borderRadius: 32, 
        margin:8, 
        position:'absolute', 
        bottom:20, 
        left:0,
        // width: 56, 
        // height: 56, 
       
        // backgroundColor: colorFile.backgroundColor,
        // backgroundColor:colorFile.semiTransparentBackground,
        backgroundColor:'rgba(63, 81, 181,0.5)',

        justifyContent:'center'
    },
    
    bottomBarChevrontIcon:{ 
        alignItems:'center',
        zIndex:2, 
        alignSelf:'center',
        color:colorFile.chevronIconColor,
        fontSize: sizeFile.chevronIconSize
    },
    verseNumber:{
        fontSize:sizeFile.contentText,
        // color:colorFile.textColor
    },
    verseChapterNumber:{
        fontSize:sizeFile.titleText,
        color:colorFile.textColor,
        fontWeight:'bold'
    },
  
    verseTextSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        textDecorationLine: 'underline',
    },
    verseTextNotSelectedNotHighlighted:{

    },
    verseTextNotSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor
    },
    verseTextSelectedNotHighlighted:{
        textDecorationLine: 'underline',
    },
    textListFooter:{
        color:colorFile.textColor,
        fontSize:sizeFile.contentText-2,
        textAlign:'center',
        paddingVertical:2
    },
    addToSharefooterComponent:{
        // height: 60, 
        // position:'absolute',
        // bottom:0,
        // padding:12,
        margin:16,
        justifyContent:'center',
        alignItems:'center',
    },
    
    footerText:{
        fontWeight:'bold'
    },
    IconFloatingStyle:{
        position: 'absolute',
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        padding:8,
        top: 10,
      },
      reloadButton:{
        height:40,
        width:120,
        borderRadius:4,
        backgroundColor:Color.Blue_Color,
        justifyContent:'center',
        alignItems:'center'
    },
        reloadText:{fontSize:18,color:Color.White,textAlign:'center'}
    })
}
