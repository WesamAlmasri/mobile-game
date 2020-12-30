import { StyleSheet, Dimensions } from 'react-native';


height = Dimensions.get('window').height;
width = Dimensions.get('window').width;

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      height: height,
      width: width,
    },
    pressable: {
      position: 'absolute',
      height: height,
      width: width,
      zIndex: 100,
      flex: 1,
    },
    ScoreLabel: {
      position: 'absolute',
      top: 25,
      left: 5,
      height: 30,
    },
  });
  