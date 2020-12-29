import React from 'react';
import { View } from 'react-native';

export default Enemy = (props) => {
  const { x, y, radius, color } = props;

  return (
    <View style={{
      position: 'absolute',
      top: y - radius,
      left: x - radius,
      height: radius*2,
      width: radius*2,
      borderRadius: radius,
      backgroundColor: color,
    }} />
  );
}

