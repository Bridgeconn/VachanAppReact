import { StyleSheet, Dimensions } from 'react-native'
import { Icon } from 'native-base';
import colorConstants from '../../../utils/colorConstants';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export const OBSStyle = (colorFile, sizeFile) => {
    return StyleSheet.create({
        container: {
            flex:1,
            backgroundColor: colorFile.backgroundColor,
        },
        agendaBackgroundColor: {
            backgroundColor: colorFile.backgroundColor,
        },
        textStyle: {
            fontSize: sizeFile.contentText,
            color: colorFile.textColor,
            fontWeight: '400',
        },
        dropdownTextStyle: {
            fontSize: sizeFile.titleText,
            color: colorFile.iconColor
        },
        calenderHeader: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 10
        },
        headerStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            paddingTop: 10,
            paddingBottom: 10,
            color: colorFile.blueText,
            paddingRight: 5,
            marginLeft: 5
        },
        item: {
            backgroundColor: colorFile.backgroundColor,
            shadowColor: colorFile.textColor,
            shadowOpacity: 0.26,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            elevation: 3,
            marginRight: 10,
            marginTop: 32,
            paddingLeft:16,
            justifyContent:'center'
        },
        agendaDate: {
            alignSelf: 'center',
            color: '#fff',
            fontSize: 18,
            paddingVertical: 8,
            // backgroundColor: colorFile.backgroundColor
        },
        emptyDate: {
            height: 15,
            flex: 1,
            paddingTop: 30,
            backgroundColor: colorFile.backgroundColor
        },
        dropdownStyle: {
            padding: 10,
            width: '60%',
            height: '70%',
            backgroundColor: colorFile.backgroundColor,
        },
        emptyMessageContainer: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        messageEmpty: {
            fontSize: sizeFile.titleText,
            color: colorFile.textColor,
        },
        emptyMessageIcon: {
            fontSize: sizeFile.emptyIconSize,
            margin: 16,
            color: colorFile.iconColor,
        },
        centerEmptySet: {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
    })
}