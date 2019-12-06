import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const Controls = ({
  paused,
  shuffleOn,
  repeatOn,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  onPressShuffle,
  onPressRepeat,
  forwardDisabled,
}) => (
  <View style={styles.container}>
    {/* <TouchableOpacity activeOpacity={0.0} onPress={onPressShuffle}>
      <Icon style={[styles.secondaryControl, shuffleOn ? [] : styles.off]}
       name="shuffle" size={30} color="#fff"/>
    </TouchableOpacity> */}
    <View style={{width: 40}} />
    <TouchableOpacity onPress={onBack}>
      <Icon name="skip-previous" size={30} />
    </TouchableOpacity>
    <View style={{width: 20}} />
    {!paused ?
      <TouchableOpacity onPress={onPressPause}>
        <View style={styles.playButton}>
        <Icon name="pause" size={30}  style={[forwardDisabled && {opacity: 0.3}]}/>
        </View>
      </TouchableOpacity> :
      <TouchableOpacity onPress={onPressPlay}>
        <View style={styles.playButton}>
        <Icon name="play-arrow" size={30}/>
        </View>
      </TouchableOpacity>
    }
    <View style={{width: 20}} />
    <TouchableOpacity onPress={onForward}
      disabled={forwardDisabled}>
      <Icon name="skip-next" size={30}  />
    </TouchableOpacity>
    <View style={{width: 40}} />
    {/* <TouchableOpacity activeOpacity={0.0} onPress={onPressRepeat}>
    <Icon name="repeat" size={30} color="#fff"  style={[styles.secondaryControl, repeatOn ? [] : styles.off]}/>
    </TouchableOpacity> */}
  </View>
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 8,
  },
  playButton: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 72 / 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  secondaryControl: {
    height: 18,
    width: 18,
  },
  off: {
    opacity: 0.30,
  }
})