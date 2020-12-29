import React, { useState, useEffect } from 'react';
import { View,
        Dimensions,
        Pressable,
       } from 'react-native';
import Player from '../Player';
import Projectile from '../Projectile';
import styles from './styles'

const frames = 60;
const playerRadius = 25;
let animationId;

height = Dimensions.get('window').height
width = Dimensions.get('window').width


export default Game = () => {
  const [particles, setParticles] = useState({
    projectiles: [],
    enemies: [],
  });

  // add projectiles when press
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
    setParticles(prev => {
      return {
        ...prev,
        projectiles: [...prev.projectiles, newProjectile],
      }
    });
  }

  // create random enemies
  const spawnEnemies = () => {
    setInterval(() => {
      const radius = Math.random() * (30 - 5) + 5;

      let x;
      let y;
      if(Math.random() > 0.5){
        x = Math.random() < 0.5 ? 0 - radius : width + radius;
        y = Math.random() * height;
      } else {
        x = Math.random() * width;
        y = Math.random() < 0.5 ? 0 - radius : height + radius;
      }
      
      const color = 'green';
      const angle = Math.atan2(height / 2 - y, width / 2 - x)
      const velocity ={
        x: Math.cos(angle),
        y: Math.sin(angle)
      }
      const newEnemy = {
        x: x,
        y: y,
        radius: radius,
        color: color,
        velocity: velocity,
      }
      // setEnemies(prev => [...prev, newEnemy]);
      setParticles(prev => {
        return {
          ...prev,
          enemies: [...prev.enemies, newEnemy],
        }
      })
    }, 1000)
  }

  // each frame called to update positions of items
  const update = () => {

    setParticles(prev => {
      let updatedProjectiles;
      let updatedEnemies;

      updatedProjectiles = prev.projectiles.map(projectile => {return {
        ...projectile,
        x: projectile.x + projectile.velocity.x,
        y: projectile.y + projectile.velocity.y,
      }
    });

      updatedEnemies = prev.enemies.map(enemy => {return {
        ...enemy,
        x: enemy.x + enemy.velocity.x,
        y: enemy.y + enemy.velocity.y,
      }
    });


    // check for collide and check for projectiles leaving the view
    updatedEnemies.forEach((enemy, enemyIndex) => {

      const dist = Math.hypot(width / 2 - enemy.x, height / 2 - enemy.y);
      if(dist - enemy.radius - playerRadius < 1) {
        // end game
        clearInterval(animationId);
      }

      updatedProjectiles.forEach((projectile, projectileIndex) => {

        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        
        // objects touch
        if(dist - enemy.radius - projectile.radius < 1) {
          updatedEnemies.splice(enemyIndex, 1);
          updatedProjectiles.splice(projectileIndex, 1);
        }

        // projectiles leaving the view
        if(projectile.x - projectile.radius < 0 || projectile.x - projectile.radius > width || projectile.y - projectile.radius < 0  || projectile.y - projectile.radius > height) {
          updatedProjectiles.splice(projectileIndex, 1);
        }

      });
    });
    return ({
      projectiles: updatedProjectiles,
      enemies: updatedEnemies,
    })
  });
}

  
  // called at first render to start game 60 fps
  useEffect(() => {
    spawnEnemies();
    animationId = setInterval(() => {
      update();
    }, 1/frames);
    return () => clearInterval(animationId);
  },[]);

  console.log('proj :', particles.projectiles.length)
  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.pressable} />
        <Player 
          x={width/2}
          y={height/2}
          radius={playerRadius}
          color='blue'
        />
        {particles.enemies.map((enemy, index) => 
          <Projectile 
            key={index}
            x={enemy.x}
            y={enemy.y}
            radius={enemy.radius}
            color={enemy.color}
          />
        )}
        {particles.projectiles.map((projectile, index) => 
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
