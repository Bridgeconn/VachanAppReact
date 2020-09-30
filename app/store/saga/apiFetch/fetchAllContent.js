
import { FETCH_ALL_CONTENT, FECTH_ALL_LANGUAGE } from '../../action/actionsType'
import { allContentFailure, allContentSuccess, allLanguageFailure, allLanguageSuccess } from '../../action/'
import { put, takeLatest, call, fork, all } from 'redux-saga/effects'
import securityVaraibles  from './../../../../securityVaraibles.js'
import fetchApi from '../../api';
const API_BASE_URL = 'https://api.vachanonline.net/v1/'

//fetch audio available book ,audio file 
function* fetchAllContent() {
  try {
    const commentaryKey = securityVaraibles.COMMENTARY_KEY ? '?key='+securityVaraibles.COMMENTARY_KEY : ''
    const bibleAPI = API_BASE_URL + 'bibles'
    const commentaryAPI = API_BASE_URL + 'commentaries'+commentaryKey
    // const dictionaryAPI = API_BASE_URL + 'dictionaries'
    const [bibleLanguage, commentaryLanguage, dictionariesLanguage] = yield all([
      call(fetchApi, bibleAPI),
      call(fetchApi, commentaryAPI),
      // call(fetchApi, dictionaryAPI)
    ])

    const bible = []
    const commentary = []
    // const dictionary = []

    for (var i = 0; i < bibleLanguage.length; i++) {
      var versions = []
      const language = bibleLanguage[i].language.charAt(0).toUpperCase() + bibleLanguage[i].language.slice(1)
      let languageCode = ''
      for (var j = 0; j < bibleLanguage[i].languageVersions.length; j++) {
        languageCode = bibleLanguage[i].languageVersions[j].language.code
        const { version } = bibleLanguage[i].languageVersions[j]
        const metaD = bibleLanguage[i].languageVersions[j].metadata
        var mData = [{
          abbreviation: metaD && (metaD.hasOwnProperty("Abbreviation") ? metaD["Abbreviation"] : ''),
          contact: metaD && (metaD.hasOwnProperty("Contact") ? metaD["Contact"] : ''),
          contentType: metaD && (metaD.hasOwnProperty("Content Type") ? metaD["Content Type"] : ''),
          copyrightHolder: metaD && (metaD.hasOwnProperty("Copyright Holder") ? metaD["Copyright Holder"] : ''),
          description: metaD && (metaD.hasOwnProperty("Description") ? metaD["Description"] : ''),
          languageCode: metaD && (metaD.hasOwnProperty("Language Code") ? metaD["Language Code"] : ''),
          languageName: metaD && (metaD.hasOwnProperty("Language Name") ? metaD["Language Name"] : ''),
          license: metaD && (metaD.hasOwnProperty("License") ? metaD["License"] : ''),
          licenseURL: metaD && (metaD.hasOwnProperty("License URL") ? metaD["License URL"] : ''),
          NTURL: metaD && (metaD.hasOwnProperty("NT URL") ? metaD["NT URL"] : ''),
          OTURL: metaD && (metaD.hasOwnProperty("OT URL") ? metaD["OT URL"] : ''),
          publicDomain: metaD && (metaD.hasOwnProperty("Public Domain") ? metaD["Public Domain"] : ''),
          revision: metaD && (metaD.hasOwnProperty("Revision (Name & Year)") ? metaD["Revision (Name & Year)"] : ''),
          source: metaD && (metaD.hasOwnProperty("Source (Name & Year)") ? metaD["Source (Name & Year)"] : ''),
          technologyPartner: metaD && (metaD.hasOwnProperty("Technology Partner") ? metaD["Technology Partner"] : ''),
          versionName: metaD && (metaD.hasOwnProperty("Version Name (in Eng)") ? metaD["Version Name (in Eng)"] : ''),
          versionNameGL: metaD && (metaD.hasOwnProperty("Version Name (in GL)") ? metaD["Version Name (in GL)"] : ''),
        }]
        versions.push({ sourceId: bibleLanguage[i].languageVersions[j].sourceId, versionName: version.name, versionCode: version.code, metaData: mData, downloaded: false })
      }
      bible.push({ languageName: language, languageCode: languageCode, versionModels: versions })
    }
    for (var i = 0; i < commentaryLanguage.length; i++) {
      var versions = []
      const language = commentaryLanguage[i].language.charAt(0).toUpperCase() + commentaryLanguage[i].language.slice(1)
      const languageCode = commentaryLanguage[i].languageCode
      for (var j = 0; j < commentaryLanguage[i].commentaries.length; j++) {
        const metaD = commentaryLanguage[i].commentaries[j].metadata
        var mData = [{
          abbreviation: metaD && (metaD.hasOwnProperty("Abbreviation") ? metaD["Abbreviation"] : ''),
          contact: metaD && (metaD.hasOwnProperty("Contact") ? metaD["Contact"] : ''),
          contentType: metaD && (metaD.hasOwnProperty("Content Type") ? metaD["Content Type"] : ''),
          copyrightHolder: metaD && (metaD.hasOwnProperty("Copyright Holder") ? metaD["Copyright Holder"] : ''),
          description: metaD && (metaD.hasOwnProperty("Description\u00a0") ? metaD["Description\u00a0"] : ''),
          languageCode: metaD && (metaD.hasOwnProperty("Language Code\u00a0") ? metaD["Language Code\u00a0"] : ''),
          languageName: metaD && (metaD.hasOwnProperty("Language Name\u00a0") ? metaD["Language Name\u00a0"] : ''),
          license: metaD && (metaD.hasOwnProperty("License") ? metaD["License"] : ''),
          licenseURL: metaD && (metaD.hasOwnProperty("License URL\u00a0") ? metaD["License URL\u00a0"] : ''),
          NTURL: metaD && (metaD.hasOwnProperty("NT URL") ? metaD["NT URL"] : ''),
          OTURL: metaD && (metaD.hasOwnProperty("OT URL") ? metaD["OT URL"] : ''),
          publicDomain: metaD && (metaD.hasOwnProperty("Public Domain") ? metaD["Public Domain"] : ''),
          revision: metaD && (metaD.hasOwnProperty("Revision (Name & Year)") ? metaD["Revision (Name & Year)"] : ''),
          source: metaD && (metaD.hasOwnProperty("Source (Name & Year)") ? metaD["Source (Name & Year)"] : ''),
          technologyPartner: metaD && (metaD.hasOwnProperty("Technology Partner") ? metaD["Technology Partner"] : ''),
          versionName: metaD && (metaD.hasOwnProperty("Version Name (in Eng)") ? metaD["Version Name (in Eng)"] : ''),
          versionNameGL: metaD && (metaD.hasOwnProperty("Version Name (in GL)") ? metaD["Version Name (in GL)"] : ''),
        }]
        versions.push({ sourceId: commentaryLanguage[i].commentaries[j].sourceId, versionName: commentaryLanguage[i].commentaries[j].name, versionCode: commentaryLanguage[i].commentaries[j].code, metaData: mData, downloaded: false })
      }
      commentary.push({ languageName: language, languageCode: languageCode, versionModels: versions })
    }
    // for (var i = 0; i < dictionariesLanguage.length; i++) {
    //   var versions = []
    //   const language = dictionariesLanguage[i].language.charAt(0).toUpperCase() + dictionariesLanguage[i].language.slice(1)
    //   const languageCode = dictionariesLanguage[i].languageCode
    //   for (var j = 0; j < dictionariesLanguage[i].dictionaries.length; j++) {
    //     const metaD = dictionariesLanguage[i].dictionaries[j].metadata
    //     var mData = [{
    //       abbreviation: metaD && (metaD.hasOwnProperty("Abbreviation") ? metaD["Abbreviation"] : ''),
    //       contact: metaD && (metaD.hasOwnProperty("Contact") ? metaD["Contact"] : ''),
    //       contentType: metaD && (metaD.hasOwnProperty("Content Type") ? metaD["Content Type"] : ''),
    //       copyrightHolder: metaD && (metaD.hasOwnProperty("Copyright Holder") ? metaD["Copyright Holder"] : ''),
    //       description: metaD && (metaD.hasOwnProperty("Description\u00a0") ? metaD["Description\u00a0"] : ''),
    //       languageCode: metaD && (metaD.hasOwnProperty("Language Code\u00a0") ? metaD["Language Code\u00a0"] : ''),
    //       languageName: metaD && (metaD.hasOwnProperty("Language Name\u00a0") ? metaD["Language Name\u00a0"] : ''),
    //       license: metaD && (metaD.hasOwnProperty("License") ? metaD["License"] : ''),
    //       licenseURL: metaD && (metaD.hasOwnProperty("License URL\u00a0") ? metaD["License URL\u00a0"] : ''),
    //       NTURL: metaD && (metaD.hasOwnProperty("NT URL") ? metaD["NT URL"] : ''),
    //       OTURL: metaD && (metaD.hasOwnProperty("OT URL") ? metaD["OT URL"] : ''),
    //       publicDomain: metaD && (metaD.hasOwnProperty("Public Domain") ? metaD["Public Domain"] : ''),
    //       revision: metaD && (metaD.hasOwnProperty("Revision (Name & Year)") ? metaD["Revision (Name & Year)"] : ''),
    //       source: metaD && (metaD.hasOwnProperty("Source (Name & Year)") ? metaD["Source (Name & Year)"] : ''),
    //       technologyPartner: metaD && (metaD.hasOwnProperty("Technology Partner") ? metaD["Technology Partner"] : ''),
    //       versionName: metaD && (metaD.hasOwnProperty("Version Name (in Eng)") ? metaD["Version Name (in Eng)"] : ''),
    //       versionNameGL: metaD && (metaD.hasOwnProperty("Version Name (in GL)") ? metaD["Version Name (in GL)"] : ''),
    //     }]
    //     versions.push({ sourceId: dictionariesLanguage[i].dictionaries[j].sourceId, versionName: dictionariesLanguage[i].dictionaries[j].name, versionCode: dictionariesLanguage[i].dictionaries[j].code, metaData: mData, downloaded: false })
    //   }
    //   dictionary.push({ languageName: language, languageCode: languageCode, versionModels: versions })
    // }
    yield put(allContentSuccess([
      { contentType: "bible", content: bible },
      { contentType: "commentary", content: commentary },
      // { contentType: "dictionary", content: dictionary }
    ]))
    yield put(allContentFailure(null))

  } catch (e) {
    yield put(allContentFailure(e))
    yield put(allContentSuccess([]))
  }
}

function* fetchAllLanguage() {
  try {
    const response = yield call(fetchApi, 'https://api.vachanonline.net/v1/languages')
    yield put(allLanguageSuccess(response))
    yield put(allLanguageFailure(null))

  } catch (e) {
    yield put(allLanguageFailure(e))
    yield put(allLanguageSuccess([]))

  }
}

export const watchAllContent = [
  takeLatest(FETCH_ALL_CONTENT, fetchAllContent),
  takeLatest(FECTH_ALL_LANGUAGE, fetchAllLanguage),
]






