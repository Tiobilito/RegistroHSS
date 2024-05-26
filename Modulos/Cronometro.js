import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Cronometro = ({ startDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getElapsedTime = () => {
    const difference = currentTime - startDate;
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = getElapsedTime();

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
