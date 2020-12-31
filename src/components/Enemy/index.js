import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


export default Enemy = (props) => {
  const { x, y, radius, color } = props;

  return (
    <LinearGradient 
      colors={[`rgba(${color}, 0.6)`, 'transparent', `rgba(${color}, 0.6)`]}
      style={{
      position: 'absolute',
      top: y - radius,
      left: x - radius,
      height: radius*2,
      width: radius*2,
      borderRadius: radius,
      shadowColor: `rgba(${color}, 0.3)`,
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0.3,
      shadowRadius: 0.5,
      elevation: 4,
    }} />
  );
}

