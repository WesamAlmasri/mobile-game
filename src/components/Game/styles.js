import { StyleSheet, Dimensions } from 'react-native';


height = Dimensions.get('window').height
width = Dimensions.get('window').width

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      height: height,
      width: width,
    },
  });
  