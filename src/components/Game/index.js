import React from 'react';
import { View,
        Dimensions,
       } from 'react-native';
import Player from '../Player';
import styles from './styles'

height = Dimensions.get('window').height
width = Dimensions.get('window').width

export default Game = () => {
  return (
    <View style={styles.container}>
      <Player 
        x={width/2}
        y={height/2}
        radius={25}
        color='blue'
      />
    </View>
  );
}
