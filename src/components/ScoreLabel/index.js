import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default ScoreLabel = (props) => {
  const { score, style } = props;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textLabel}>
        score: {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    color: 'white',
    fontSize: 20,
  }
});
