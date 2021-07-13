// all of our routes
import { createStackNavigator, createDrawerNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'
import About from '../screens/About/'
import Search from '../screens/Search/'
import Settings from '../screens/Settings'
import Notes from '../screens/Note/index'
import EditNote from '../screens/Note/EditNote'
import Highlights from '../screens/Highlights/'
import History from '../screens/History/'

import Commentary from '../screens/StudyHelp/Commentary/'
import Dictionary from '../screens/StudyHelp/Dictionary/'
import DictionaryWords from '../screens/StudyHelp/Dictionary/DictionaryWords'
import Infographics from '../screens/StudyHelp/InfoGraphics/';
import InfographicsImage from '../screens/StudyHelp/InfoGraphics/infographicsImage';

import Reset from '../screens/Auth/Reset'
import Register from '../screens/Auth/Register'
import Login from '../screens/Auth/Login'
import ProfilePage from '../screens/Auth/ProfilePage'
import Auth from '../screens/Auth/'

import DrawerScreen from '../screens/DrawerScreen'
import Bible from '../screens/Bible'
import LanguageList from '../screens/LanguageList'

import SelectionTab from '../screens/ReferenceSelection/'
import BookMarks from '../screens/Bookmarks/';
import Color from '../utils/colorConstants'
import Video from '../screens/Video'
import PlayVideo from '../screens/Video/PlayVideo'
import Help from '../screens/Help'
import Feedback from '../screens/Help/Feedback'
import Hints from '../screens/Help/Hints'
import OBS from '../screens/StudyHelp/OBS/'
import BRP from '../screens/StudyHelp/BRP/'


const NavStack = createStackNavigator(
  {
    Bible: {
      screen: Bible,
      navigationOptions: () => ({
        headerTintColor: Color.White,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })
    },
    Search: { screen: Search },
    SelectionTab: {
      screen: SelectionTab,
      navigationOptions: { headerTitle: null }
    },
    Notes: {
      screen: Notes
    },
    LanguageList: { screen: LanguageList },
    EditNote: { screen: EditNote },
    Commentary: {
      screen: Commentary,
      navigationOptions: () => ({
        header: null
      })
    },
    Dictionary: { screen: Dictionary },
    DictionaryWords: { screen: DictionaryWords },
    About: { screen: About },
    Settings: { screen: Settings },
    History: { screen: History },
    BookMarks: { screen: BookMarks },
    Highlights: { screen: Highlights },
    Infographics: { screen: Infographics },
    InfographicsImage: { screen: InfographicsImage },
    Login: { screen: Login },
    Video: { screen: Video },
    PlayVideo: { screen: PlayVideo },
    Help: { screen: Help },
    Feedback: { screen: Feedback },
    Hints: { screen: Hints },
    Register: {
      screen: Register,
      navigationOptions: () => ({
        header: null
      })
    },
    Reset: {
      screen: Reset,
      navigationOptions: { headerTitle: "Forgot Passsword ?" }
    },
    OBS: {
      screen: OBS,
      navigationOptions: { headerTitle: "Bible Stories" }
    },
    BRP: {
      screen: BRP,
      navigationOptions: { headerTitle: "Reading Plans" }
    },
    ProfilePage: {
      screen: ProfilePage,
      navigationOptions: () => ({
        header: null
      }),
    },
    Auth: {
      screen: Auth,
      navigationOptions: () => ({
        header: null
      }),
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Color.Blue_Color,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: Color.White,
      headerTitleStyle: {
        fontWeight: 'bold',
        color: Color.White
      }
    },

  }
)

const DrawerNavigate = createDrawerNavigator({
  StackNavigate: {
    screen: NavStack
  },

},
  {
    contentComponent: DrawerScreen,
    drawerWidth: 250,
    overlayColor: 'rgba(52, 52, 52, 0.8)'
  },
);

const SwitchNavigator = createSwitchNavigator({
  DrawerNavigate: DrawerNavigate
});

export const AppNavigator = createAppContainer(SwitchNavigator);


