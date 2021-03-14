import React, { useState, useEffect } from 'react';
import { Dimensions,
        Pressable,
        SafeAreaView,
       } from 'react-native';
import Player from '../Player';
import Projectile from '../Projectile';
import Enemy from '../Enemy';
import Fragment from '../Fragment';
import styles from './styles'
import ScoreLabel from '../ScoreLabel';
import CustomModal from '../CustomModal';
import {HIGHESTSCORE, storeData, getData} from '../helper';
import { Audio } from 'expo-av';


const playerRadius = 10;
const friction = 0.98;
let animationId;
let gameEnded = false;
let spawnEnemyId;

height = Dimensions.get('window').height;
width = Dimensions.get('window').width;


export default Game = () => {
  const [particles, setParticles] = useState({
    projectiles: [],
    enemies: [],
    fragments: [],
    score: 0,
  });
  const [modalVisible, setModalVisible] = useState(true);
  const [sound, setSound] = useState();
  const [highestScore, setHighestScore] = useState(0);


  useEffect(() => {
    let cleaned = false;

    (async() => {
      const lastHightScore =  await getData(HIGHESTSCORE);
      if(!cleaned){
        lastHightScore !== null &&
        setHighestScore(lastHightScore);
      }
    })();
    
    return () => cleaned = true;
  }, [])

  useEffect(() => {
    if(particles.score && particles.score > highestScore){
      setHighestScore(particles.score);
      storeData(HIGHESTSCORE, particles.score);
    }
  }, [modalVisible])


  const onModalPressButton = () => {
    setParticles({
      projectiles: [],
      enemies: [],
      fragments: [],
      score: 0,
    });
    setModalVisible(false);
  }

  // add projectiles when press
  const handlePress = (e) => {
    // playSound('fire');
    const angle = Math.atan2(e.nativeEvent.locationY - height / 2, e.nativeEvent.locationX - width / 2)
    const velocity ={
      x: Math.cos(angle) * 8,
      y: Math.sin(angle) * 8,
    }
    const newProjectile = {
      x: width / 2,
      y: height / 2,
      radius:5,
      color: 'white',
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
    spawnEnemyId = setInterval(() => {
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
      
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
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
      let updatedEFragments;
      let updatedScore;

      updatedScore = prev.score;

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

    updatedEFragments = prev.fragments.map(fragment => {return {
      ...fragment,
      x: fragment.x + fragment.velocity.x,
      y: fragment.y + fragment.velocity.y,
    }
  });

    // decrese fragments opacity and delete them after certian value
    updatedEFragments.forEach((fragment, fragmentIndex) => {
      fragment.velocity.x *= friction;
      fragment.velocity.y *= friction;
      fragment.alpha -= 0.01;
      if(fragment.alpha <= 0.05){
        updatedEFragments.splice(fragmentIndex, 1);
      }
    })

    // check for collide and check for projectiles leaving the view
    updatedEnemies.forEach((enemy, enemyIndex) => {

      const dist = Math.hypot(width / 2 - enemy.x, height / 2 - enemy.y);
      if(dist - enemy.radius - playerRadius < 1) {
        // end game
        gameEnded = true;
        clearInterval(spawnEnemyId);
        setModalVisible(true);
      }

      updatedProjectiles.forEach((projectile, projectileIndex) => {

        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        
        // when projectile touch
        if(dist - enemy.radius - projectile.radius < 1) {

          // create explotions
          for(let i = 0; i < enemy.radius / 2; i++) {
            updatedEFragments.push({
              x: projectile.x,
              y: projectile.y,
              radius: Math.random() * 3,
              color: enemy.color,
              velocity: {x: (Math.random() -0.5) * (Math.random() * 6), y: (Math.random() -0.5) * (Math.random() * 6)},
              alpha: 0.35,
            })
          }

          if(enemy.radius - 10 > 5) {
            // playSound('hit');
            //increase score
            updatedScore += 100;
            // enemy shrink
            enemy.radius -= 5;
            updatedProjectiles.splice(projectileIndex, 1);
          } else {
            // playSound('explode');
            //increase score
            updatedScore += 250;
            //remove from the scene
            updatedEnemies.splice(enemyIndex, 1);
            updatedProjectiles.splice(projectileIndex, 1);
          }
          
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
      fragments: updatedEFragments,
      score: updatedScore,
    })
  });
  if(!gameEnded){
    animationId = requestAnimationFrame(update);
  }
}

// async function playSound(action) {
//     if(action === 'fire'){
//       const { sound } = await Audio.Sound.createAsync(
//         require('../assets/audio/Bullet_Ricochet_Sharp.mp3')
//       );
//       setSound(sound);
//       await sound.playAsync();
//     }else if (action === 'hit'){
//       const { sound } = await Audio.Sound.createAsync(
//         require('../assets/audio/Bullet_Hit_Body.mp3')
//       );
//       setSound(sound);
//       await sound.playAsync();
//     }else if(action === 'explode'){
//       const { sound } = await Audio.Sound.createAsync(
//         require('../assets/audio/Bomb.mp3')
//       );
//       setSound(sound);
//       await sound.playAsync();
//     }

//    }

//   useEffect(() => {
//     return sound
//       ? () => {
//           sound.unloadAsync(); }
//       : undefined;
//   }, [sound]);
  
  // called at first render to start game 60 fps
  useEffect(() => {
    if(!modalVisible){
       spawnEnemies();
       animationId = requestAnimationFrame(update);
    }
    return () => {
      gameEnded = false;
      cancelAnimationFrame(animationId);
      clearInterval(spawnEnemyId);
    }
  },[modalVisible]);


  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={handlePress} style={styles.pressable} />
        <Player 
          x={width/2}
          y={height/2}
          radius={playerRadius}
          color='white'
        />
        {particles.enemies.map((enemy, index) => 
          <Enemy 
            key={index}
            x={enemy.x}
            y={enemy.y}
            radius={enemy.radius}
            color={enemy.color}
          />
        )}
        {particles.fragments.map((fragment, index) => 
          <Fragment 
            key={index}
            x={fragment.x}
            y={fragment.y}
            radius={fragment.radius}
            color={fragment.color}
            alpha={fragment.alpha}
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
        <ScoreLabel 
          style={styles.ScoreLabel}
          score={particles.score} 
        />
        <CustomModal 
          modalVisible={modalVisible}
          onPressButton={onModalPressButton}
          modalText1={particles.score}
          modalText2='Points'
          modalText3={`Highest score : ${highestScore || ''}`}
          buttonText='Start Game'
        />
    </SafeAreaView>
  );
}
