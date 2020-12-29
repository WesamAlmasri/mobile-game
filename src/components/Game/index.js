import React, { useState } from 'react';
import { View,
        Dimensions,
        Pressable,
       } from 'react-native';
import Player from '../Player';
import Projectile from '../Projectile';
import styles from './styles'

height = Dimensions.get('window').height
width = Dimensions.get('window').width

export default Game = () => {
  const [projectiles, setProjectiles] = useState([]);

  const handlePress = (e) => {
    const newProjectile = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
      radius:15,
      color: 'red',
      velocity: null,
    }
    setProjectiles(prev => [...prev, newProjectile]);
  }
  
  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.pressable} />
        <Player 
          x={width/2}
          y={height/2}
          radius={25}
          color='blue'
        />
        {projectiles.map((projectile, index) => 
          <Projectile 
            key={index}
            x={projectile.x}
            y={projectile.y}
            radius={projectile.radius}
            color={projectile.color}
            velocity={projectile.velocity}
          />
        )}
    </View>
  );
}
