import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
  Dimensions,
  ScrollView
} from 'react-native';
import { aboutPage } from './styles.js'
import { connect } from 'react-redux'
const screenHeight = Dimensions.get('window').height
class About extends Component {
  static navigationOptions = {
    headerTitle: 'About Us',
  };
  constructor(props) {
    super(props);
    this.styles = aboutPage(this.props.colorFile, this.props.sizeFile);
  }

  render() {
    function padding(a, b, c, d) {
      return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
      }
    }
    return (
      <View style={[this.styles.container, { height: screenHeight }]}>
        <ScrollView >
          <View style={this.styles.textContainer}>
            <Text style={this.styles.textStyle} textBreakStrategy={'simple'}>
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>Introduction{'\n'}</Text>
              The VachanGo app is a Bible Study app developed to facilitate digital scripture engagement in Indian Languages. It is a companion app for the  <Text style={this.styles.linkText} onPress={() => { Linking.openURL('https://vachanonline.com') }}>https://vachanonline.com </Text>website.{'\n'}
              Both the VachanGo Bible app and the VachanOnline.com Bible website come to you under aegis of The Vachan Project initiative, established to provide free access to Bible Study tools in Indian Languages.{'\n'}
              Since the content is brought to you under multiple licensing arrangements, it is requested that it not be further redistributed in any other format or platform without explicit permission from the original copyright owners.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Content and Technology Partners{'\n'}</Text>
              VachanGo is being made available under a collaborative arrangement of Friends of Agape, unfoldingWord, Wycliffe Associates, Crossway, Bridgeway Publications, Dusty Sandals, BibleProject, Visual Unit, and is brought to you by Bridge Connectivity Solutions Pvt. Ltd. (BCS) <Text style={this.styles.linkText} onPress={() => { Linking.openURL('https://www.bridgeconn.com') }}>(https://www.bridgeconn.com)</Text> who is the localization and technology partner.{'\n'}

              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes (13/07/2021) v1.3.0</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Content Additions (using Vachan API’s):{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bibles: Dogri DSV{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Audio Bible: Oriya IRV NT, Dogri DSV{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Feature Additions:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bible Stories in various languages{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>M’Cheyne Bible Reading Plan{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Bug Fixes:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>Enhanced navigation icon{'\n'}
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>Colour tray has been hidden when not in use{'\n'}

              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes (30/05/2021) v1.2.1</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Bug Fixes:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>Fixed Google Sync and logout issue on state change{'\n'}

              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes (28/05/2021) v1.2.0</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Content Additions (Using Vachan API’s):{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>Bibles: ESV Bible, Haryanvi NT, Bilaspuri NT{'\n'}
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>Audio Bible: Hindi IRV OT, Punjabi IRV, Bilaspuri NT, Haryanvi NT{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Operations Update:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>usfm-grammar version upgrade to 2.0.0{'\n'}
             
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes (19/03/2021) v1.1.2</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Bug Fixes:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>Fixed bug on update version alert{'\n'}

              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes (17/03/2021) v1.1.1</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Bug Fixes:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon,{...padding}]}>{'\u2022' + " "}</Text>Fixed Google Authentication issue{'\n'}

              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes (05/03/2021) v1.1</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Content Additions (using Vachan API’s):{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bibles: Nagamese NT{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Commentary: Bridgeway Bible Commentary (Marathi & Gujarati){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Dictionary: Easton’s Bible Dictionary (English){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Videos: BibleProject (Bengali & Malayalam){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Feature Additions:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Multi-colour highlights{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Pinch zoom in and out for reading page{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added Hints section{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added appropriate user-friendly alerts for required screens{'\n'}

              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Bug Fixes:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Fixed known cosmetic issues{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Fixed known usability issues{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Fixed issues in bookmarks and notes{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Fixed issue in sync of Notes data{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Fixed issue of duplication in Video pane{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Fixed Parallel-view issues{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Operations Update:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added metadata-based filtering for only published bibles to be displayed on Vachan platforms{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Handle use-cases when Bible has only OT or NT books{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes v1.0{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={{ fontWeight: 'bold' }}>Platform: </Text>
              React-Native, powered by Postgres and Python APIs (VachanEngine) in the back-end.
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Content Available :{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bibles: Latest versions of IRV Bibles in all available Indian Gateway languages{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Commentary: IRV Notes (Hindi) +  Bridgeway Bible Commentary (English){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Dictionary: IRV Dictionary (Hindi){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Infographics: VisualUnit (Hindi) {'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Audio: IRV NT Bible (Hindi){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Video: BibleProject (English, Hindi & Telugu){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Features:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Clean Bible reading pane with section-headings.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Parallel 2-pane feature to display Bibles, Commentaries etc.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Personalization using simple login.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bookmarks, Highlights & Notes.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Basic Bible search.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.rlsNoteTitleText}>{'\n'}Backend Services:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>DigitalOcean Spaces with CDN to serve Audio & Video{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Firebase for personalisation and synchronisation{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Contact Us</Text>{'\n'}
              thevachanproject@gmail.com
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}

export default connect(mapStateToProps, null)(About)
