import {StyleSheet,Dimensions} from 'react-native'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export const downloadPageStyle = (colorFile, sizeFile) =>{
    return StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:colorFile.backgroundColor
        },
        containerMargin:{
            flex:1,
            margin:8,
            justifyContent:'center'
        },
        cardItemStyle:{
            backgroundColor:colorFile.backgroundColor,
            padding:8            
        },
        cardStyle:{
             margin:16,
        },
        textStyle:{
            color: colorFile.textColor,   
            fontSize:sizeFile.titleText,
            marginLeft:4,
        },
        loaderStyle:{
            flex:1, 
            alignItems:'center', 
            justifyContent:'center', 
            flexDirection:'row'
        },
        textLoader:{
            color: colorFile.textColor,   
            fontSize:sizeFile.contentText,
        },
       
        emptyMessageIcon:{
            textAlign:'center',
            alignItems:'center',
            fontSize:sizeFile.emptyIconSize,
            color:colorFile.iconColor,
        },
        messageEmpty:{
            textAlign:'center',
            fontSize:sizeFile.titleText,
            color:colorFile.textColor,
        },
        emptyMessageContainer:{
            flexDirection:'column',
            justifyContent:'center'
        },
    
        
})
}

