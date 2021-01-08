import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import { fetchParallelBible, fetchVersionBooks } from '../../store/action'
import { styles } from './styles';
import { connect } from 'react-redux'
import { getResultText } from '../../utils/UtilFunctions'
import { Header, Button, Right, Title } from 'native-base'
import Color from '../../utils/colorConstants'
import ReloadButton from '../ReloadButton';
import vApi from '../../utils/APIFetch';

class BibleChapter extends Component {
    constructor(props) {
        super(props)
        this.styles = styles(this.props.colorFile, this.props.sizeFile);
        this.state = {
            currentParallelViewChapter: JSON.parse(this.props.currentChapter),
            bookId: this.props.bookId,
            bookName: this.props.bookName,
            bookNameList: [],
            shortbookName: '',
            totalChapters: this.props.totalChapters,
            error: null,
            message: null
        }
        this.alertPresent = false
    }
    queryParallelBible = (val) => {
        this.setState({ currentParallelViewChapter: val != null ? this.state.currentParallelViewChapter + val : this.props.currentChapter }, () => {
            this.props.fetchParallelBible({
                isDownloaded: false, sourceId: this.props.parallelLanguage.sourceId,
                language: this.props.parallelLanguage.languageName,
                version: this.props.parallelLanguage.versionCode,
                bookId: this.props.bookId,
                chapter: this.state.currentParallelViewChapter
            })
        })
    }
    getRef = async (item) => {
        try {
            let response = await vApi.get('booknames')
            this.setState({ bookNameList: response })
            if (response) {
                for (var i = 0; i <= response.length - 1; i++) {
                    if (response[i].language.name === this.props.parallelLanguage.languageName.toLowerCase()) {
                        for (var j = 0; j <= response[i].bookNames.length - 1; j++) {
                            let bId = response[i].bookNames[j].book_code
                            if (bId == item.bookId) {
                                let shortbookName = item.bookName != null && (item.bookName.length > 10 ? item.bookName.slice(0, 9) + "..." : item.bookName)
                                this.setState({
                                    currentParallelViewChapter: item.chapterNumber,
                                    bookId: item.bookId,
                                    bookName: item.bookName,
                                    totalChapters: item.totalChapters,
                                    shortbookName
                                }, () => {
                                    this.props.fetchParallelBible({
                                        isDownloaded: false, sourceId: this.props.parallelLanguage.sourceId,
                                        language: this.props.parallelLanguage.languageName, version: this.props.parallelLanguage.versionCode,
                                        bookId: item.bookId, chapter: item.chapterNumber
                                    })

                                })
                            } else {
                                if (response[i].bookNames[j].bookNumber >= 39) {
                                    if (bId == 'gen') {
                                        let bookName = response[i].bookNames[j].short
                                        let shortbookName = bookName != null && (bookName.length > 10 ? bookName.slice(0, 9) + "..." : bookName)
                                        this.setState({
                                            currentParallelViewChapter: item.chapterNumber,
                                            bookId: bId,
                                            bookName: bookName,
                                            totalChapters: item.totalChapters,
                                            shortbookName
                                        }, () => {
                                            this.props.fetchParallelBible({
                                                isDownloaded: false, sourceId: this.props.parallelLanguage.sourceId,
                                                language: this.props.parallelLanguage.languageName, version: this.props.parallelLanguage.versionCode,
                                                bookId: bId, chapter: item.chapterNumber
                                            })

                                        })
                                    }
                                } else {
                                    if (bId == 'mat') {
                                        let bookName = response[i].bookNames[j].short
                                        let shortbookName = bookName != null && (bookName.length > 10 ? bookName.slice(0, 9) + "..." : bookName)
                                        this.setState({
                                            currentParallelViewChapter: item.chapterNumber,
                                            bookId: bId,
                                            bookName: bookName,
                                            totalChapters: item.totalChapters,
                                            shortbookName
                                        }, () => {
                                            this.props.fetchParallelBible({
                                                isDownloaded: false, sourceId: this.props.parallelLanguage.sourceId,
                                                language: this.props.parallelLanguage.languageName, version: this.props.parallelLanguage.versionCode,
                                                bookId: bId, chapter: item.chapterNumber
                                            })

                                        })
                                    }

                                }
                            }
                        }

                    }
                }
            } else {
                return
            }
        } catch (error) {

        }

    }
    updateBook = async () => {
        try {
            let response = await vApi.get('booknames')
            this.setState({ bookNameList: response })
            let bookName = null
            if (response) {
                for (var i = 0; i <= response.length - 1; i++) {
                    if (response[i].language.name === this.props.parallelLanguage.languageName.toLowerCase()) {
                        for (var j = 0; j <= response[i].bookNames.length - 1; j++) {
                            let bId = response[i].bookNames[j].book_code
                            if (bId == this.state.bookId) {
                                bookName = response[i].bookNames[j].short
                                this.setState({ message: null })

                            } else {
                                this.setState({ message:'This will be available Soon '})
                            }
                        }

                    }
                }
            } else {
                return
            }
            let shortbookName = bookName != null && (bookName.length > 10 ? bookName.slice(0, 9) + "..." : bookName)
            this.setState({ shortbookName })
        } catch (error) {
            this.setState({ error: error, bookNameList: [] });
        }
    }
    componentDidMount() {
        this.queryParallelBible(null)
        this.updateBook()
    }
    componentWillUnmount() {
        // to get the books name in language for single reading page
        this.props.books.length = 0;
        this.props.fetchVersionBooks({
            language: this.props.language,
            versionCode: this.props.versionCode,
            downloaded: this.props.downloaded, sourceId: this.props.sourceId
        })
    }
    errorMessage() {
        if (!this.alertPresent) {
            this.alertPresent = true;
            if (this.props.error || this.state.error) {
                Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
            } else {
                this.alertPresent = false;
            }
        }
    }

    updateData = () => {
        if (this.props.error) {
            this.errorMessage()
            this.queryParallelBible(null)
        }
        else {
            return
        }
    }
    goToSelectionTab = () => {
        this.props.navigation.navigate("SelectionTab", {
            getReference: this.getRef, parallelContent: true, bookId: this.state.bookId, bookName: this.state.bookName,
            chapterNumber: this.state.currentParallelViewChapter, totalChapters: this.state.totalChapters,
            language: this.props.parallelLanguage.languageName, version: this.props.parallelLanguage.versionCode,
            sourceId: this.props.parallelLanguage.sourceId, downloaded: false,
        })

    }
    render() {
        this.styles = styles(this.props.colorFile, this.props.sizeFile);
        return (
            <View style={this.styles.container}>
                <Header style={{ backgroundColor: Color.Blue_Color, height: 40, borderLeftWidth: 0.2, borderLeftColor: Color.White }}>
                    <Button transparent onPress={this.goToSelectionTab}>
                        <Title style={{ fontSize: 16 }}>{this.state.shortbookName} {this.state.currentParallelViewChapter}</Title>
                        <Icon name="arrow-drop-down" color={Color.White} size={20} />
                    </Button>
                    <Right style={{ position: 'absolute', right: 4 }}>
                        <Button transparent onPress={() => this.props.toggleParallelView(false)}>
                            <Icon name='cancel' color={Color.White} size={20} />
                        </Button>
                    </Right>
                </Header>
                {this.props.isLoading &&
                    <Spinner
                        visible={true}
                        textContent={'Loading...'}
                    />}
                {
                    (this.props.error) ?
                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                            <ReloadButton
                                styles={this.styles}
                                reloadFunction={this.queryParallelBible}
                                message={this.state.message}
                            />
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false} ref={(ref) => { this.scrollViewRef = ref; }} >
                                {this.props.parallelBible.map((verse, index) =>
                                    <View style={{ marginHorizontal: 16, paddingTop: 8 }}>
                                        {verse.number == 1 ?
                                            <Text letterSpacing={24}
                                                style={this.styles.verseWrapperText}>
                                                {this.props.parallelBibleHeading != null ?
                                                    <Text style={this.styles.sectionHeading}>
                                                        {this.props.parallelBibleHeading} {"\n"}
                                                    </Text> : null}
                                                <Text>
                                                    <Text style={this.styles.verseChapterNumber}>
                                                        {this.state.currentParallelViewChapter}{" "}
                                                    </Text>
                                                    <Text style={this.styles.textString}>
                                                        {getResultText(verse.text)}
                                                    </Text>
                                                </Text>
                                                {
                                                    (verse.metadata && verse.metadata[0].section)
                                                        ?
                                                        <Text style={this.styles.sectionHeading}>
                                                            {"\n"}{verse.metadata[0].section.text}
                                                        </Text>
                                                        : null
                                                }
                                            </Text>
                                            :
                                            <Text letterSpacing={24}
                                                style={this.styles.verseWrapperText}>
                                                <Text>
                                                    <Text style={this.styles.verseNumber} >
                                                        {verse.number}{" "}
                                                    </Text>
                                                    <Text style={this.styles.textString}
                                                    >
                                                        {getResultText(verse.text)}
                                                    </Text>
                                                </Text>
                                                {
                                                    (verse.metadata && verse.metadata[0].section)
                                                        ?
                                                        <Text style={this.styles.sectionHeading}>
                                                            {"\n"}{verse.metadata[0].section.text}
                                                        </Text>
                                                        : null
                                                }
                                            </Text>

                                        }
                                    </View>
                                )}
                                <View style={this.styles.addToSharefooterComponent}>
                                    {
                                        <View style={this.styles.footerView}>
                                            {(this.props.parallelMetaData.revision !== null && this.props.parallelMetaData.revision !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Copyright:</Text>{' '}{this.props.parallelMetaData.revision}</Text>}
                                            {(this.props.parallelMetaData.license !== null && this.props.parallelMetaData.license !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>License:</Text>{' '}{this.props.parallelMetaData.license}</Text>}
                                            {(this.props.parallelMetaData.technologyPartner !== null && this.props.parallelMetaData.technologyPartner !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Technology partner:</Text>{' '}{this.props.parallelMetaData.technologyPartner}</Text>}
                                        </View>
                                    }
                                </View>

                            </ScrollView>

                            <View style={{ justifyContent: (this.state.currentParallelViewChapter != 1 && this.state.currentParallelViewChapter == this.state.currentParallelViewChapter != this.state.totalChapters) ? 'center' : 'space-around', alignItems: 'center' }}>
                                {
                                    this.state.currentParallelViewChapter == 1 ? null :
                                        <View style={this.styles.bottomBarParallelPrevView}>
                                            <Icon name={'chevron-left'} color={Color.Blue_Color} size={16}
                                                style={this.styles.bottomBarChevrontIcon}
                                                onPress={() => this.queryParallelBible(-1)}
                                            />
                                        </View>
                                }
                                {
                                    this.state.currentParallelViewChapter == this.state.totalChapters ? null :
                                        <View style={this.styles.bottomBarNextParallelView}>
                                            <Icon name={'chevron-right'} color={Color.Blue_Color} size={16}
                                                style={this.styles.bottomBarChevrontIcon}
                                                onPress={() => this.queryParallelBible(1)}
                                            />
                                        </View>
                                }
                            </View>
                        </View>

                }
            </View>
        )
    }

}


const mapStateToProps = state => {
    return {
        sizeFile: state.updateStyling.sizeFile,
        colorFile: state.updateStyling.colorFile,
        books: state.versionFetch.data,
        language: state.updateVersion.language,
        versionCode: state.updateVersion.versionCode,
        sourceId: state.updateVersion.sourceId,
        downloaded: state.updateVersion.downloaded,
        bookId: state.updateVersion.bookId,
        bookName: state.updateVersion.bookName,
        parallelBible: state.parallel.parallelBible,
        parallelBibleHeading: state.parallel.parallelBibleHeading,
        error: state.parallel.error,
        loading: state.parallel.loading,
        parallelLanguage: state.selectContent.parallelLanguage,
        parallelMetaData: state.selectContent.parallelMetaData,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchParallelBible: (data) => dispatch(fetchParallelBible(data)),
        fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BibleChapter)