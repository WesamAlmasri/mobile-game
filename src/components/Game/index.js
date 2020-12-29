import React, { useState, useEffect } from 'react';
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
    const angle = Math.atan2(e.nativeEvent.locationY - height / 2, e.nativeEvent.locationX - width / 2)
    const velocity ={
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    const newProjectile = {
      x: width / 2,
      y: height / 2,
      radius:10,
      color: 'red',
      velocity: velocity,
    }
    setProjectiles(prev => [...prev, newProjectile]);
  }

  const update = () => {
    setProjectiles(prev => {
      let updatedProjectiles;
      updatedProjectiles = prev.map(projectile => {return {
        ...projectile,
        x: projectile.x + projectile.velocity.x,
        y: projectile.y + projectile.velocity.y,
      }
    });
      return (updatedProjectiles)
    });
  }
  
  useEffect(() => {
    const tick = setInterval(() => {
      update();
    }, 17);
    return () => clearInterval(tick);
  },[]);


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
          />
        )}
    </View>
  );
}
