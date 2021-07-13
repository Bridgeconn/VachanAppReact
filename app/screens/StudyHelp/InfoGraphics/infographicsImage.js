import React from 'react';
import { Animated, ActivityIndicator } from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  TouchableOpacity
} from 'react-native-gesture-handler';
import { Text, View } from 'native-base';
import { connect } from 'react-redux'
import { bookStyle } from './styles.js'
import Color from '../../../utils/colorConstants'


export class InfographicsImage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: (<Text style={{ fontSize: 18, color: Color.White, fontWeight: 'bold', marginRight: 12 }}>Image</Text>),
      headerRight: (
        <TouchableOpacity onPress={params.resetSize}>
          <Text style={{ fontSize: 18, color: Color.White, fontWeight: 'bold', marginRight: 12 }}>
            Reset Size
          </Text>
        </TouchableOpacity>
      )
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.navigation.state.params.url,
      fileName: this.props.navigation.state.params.fileName,
      image: null,
      isLoading: false
    }
    this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);

    /* Pinching */
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);
    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: this._pinchScale } }],
      { useNativeDriver: true }
    );

    /* Rotation */
    this._rotate = new Animated.Value(0);
    this._rotateStr = this._rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
      extrapolate: "clamp"
    });
    this._lastRotate = 0;
    this._onRotateGestureEvent = Animated.event(
      [{ nativeEvent: { rotation: this._rotate } }],
      { useNativeDriver: true }
    );

    /* Tilt */
    this.translateX = new Animated.Value(0)
    this.translateY = new Animated.Value(0)


    this._onTiltGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this.translateY, translationX: this.translateX } }],
      { useNativeDriver: true }
    );
  }
  _onRotateHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };
  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;

      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };
  _onTiltGestureStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.translateY.extractOffset()
      this.translateX.extractOffset()
    }
  };
  async componentDidMount() {
    this.props.navigation.setParams({
      resetSize: this.resetSize
    })
    this.setState({ image: this.state.url + this.state.fileName })
  }
  resetSize = () => {
    this._baseScale.setValue(1);
    this._rotate.setOffset(0);
    this.translateX.setOffset(0)
    this.translateY.setOffset(0)
  }

  render() {
    return (
      <View style={this.styles.wrapper}>
        {this.state.isLoading &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator animate={true} size={32} />
          </View>}
        {this.state.image &&
          <PanGestureHandler
            ref={this.panRef}
            onGestureEvent={this._onTiltGestureEvent}
            onHandlerStateChange={this._onTiltGestureStateChange}
            minDist={10}
            minPointers={1}
            maxPointers={2}
            avgTouches>
            <Animated.View style={this.styles.wrapper}>
              <RotationGestureHandler
                ref={this.rotationRef}
                simultaneousHandlers={this.pinchRef}
                onGestureEvent={this._onRotateGestureEvent}
                onHandlerStateChange={this._onRotateHandlerStateChange}>
                <Animated.View style={this.styles.wrapper}>
                  <PinchGestureHandler
                    ref={this.pinchRef}
                    simultaneousHandlers={this.rotationRef}
                    onGestureEvent={this._onPinchGestureEvent}
                    onHandlerStateChange={this._onPinchHandlerStateChange}>
                    <Animated.View style={this.styles.imagecontainer} collapsable={false}>
                      <Animated.Image
                        style={[
                          this.styles.pinchableImage,
                          {
                            transform: [
                              // { perspective: 200 },
                              { scale: this._scale },
                              { translateY: this.translateY },
                              { translateX: this.translateX },
                              { rotate: this._rotateStr },
                            ],
                          },
                        ]}
                        onLoadStart={(e) => this.setState({ isLoading: true })}
                        onLoadEnd={(e) => this.setState({ isLoading: false })}
                        source={{ uri: this.state.image }}

                      />
                    </Animated.View>
                  </PinchGestureHandler>
                </Animated.View>
              </RotationGestureHandler>
            </Animated.View>
          </PanGestureHandler>}
      </View>



    );
  }
}

const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    books: state.versionFetch.data,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    colorMode: state.updateStyling.colorMode
  }
}


export default connect(mapStateToProps, null)(InfographicsImage)
