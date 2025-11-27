import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

// Bubble component for individual animated particles
const Bubble = ({ delay, duration, startX, endX, endY, emoji }:any) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: endY,
          duration: duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: endX - startX,
          duration: duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration * 0.2,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: duration * 0.3,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0,
            duration: duration * 0.3,
            delay: duration * 0.4,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.bubble,
        {
          left: startX,
          transform: [
            { translateY },
            { translateX },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

// Main BubbleSplash component
const BubbleSplash = ({ visible, onComplete }:any) => {
const bubbles = [
    { emoji: '🎉', startX: 30, endX: 10, endY: -300, delay: 0, duration: 1500 },
    { emoji: '✨', startX: 80, endX: 120, endY: -350, delay: 50, duration: 1600 },
    { emoji: '🪙', startX: 150, endX: 180, endY: -280, delay: 100, duration: 1400 },
    { emoji: '💫', startX: 220, endX: 250, endY: -320, delay: 150, duration: 1700 },
    { emoji: '⭐', startX: 280, endX: 310, endY: -290, delay: 80, duration: 1500 },
    { emoji: '🎊', startX: 50, endX: 40, endY: -340, delay: 120, duration: 1550 },
    { emoji: '💰', startX: 180, endX: 200, endY: -310, delay: 60, duration: 1450 },
    { emoji: '✨', startX: 120, endX: 90, endY: -300, delay: 140, duration: 1650 },
    { emoji: '🎉', startX: 250, endX: 280, endY: -330, delay: 90, duration: 1550 },
    { emoji: '💫', startX: 310, endX: 340, endY: -285, delay: 170, duration: 1480 },
    { emoji: '🪙', startX: 20, endX: 50, endY: -320, delay: 40, duration: 1520 },
    { emoji: '⭐', startX: 200, endX: 230, endY: -295, delay: 110, duration: 1580 },
    { emoji: '✨', startX: 330, endX: 360, endY: -310, delay: 130, duration: 1620 },
    { emoji: '🎊', startX: 90, endX: 70, endY: -290, delay: 70, duration: 1490 },
    { emoji: '💰', startX: 260, endX: 290, endY: -340, delay: 160, duration: 1560 },
    { emoji: '💫', startX: 140, endX: 160, endY: -305, delay: 95, duration: 1530 },
    { emoji: '🎉', startX: 60, endX: 30, endY: -315, delay: 35, duration: 1470 },
    { emoji: '⭐', startX: 190, endX: 210, endY: -325, delay: 125, duration: 1590 },
    { emoji: '✨', startX: 300, endX: 330, endY: -295, delay: 85, duration: 1510 },
    { emoji: '🪙', startX: 110, endX: 140, endY: -335, delay: 155, duration: 1600 },
  ];

  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 200000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {bubbles.map((bubble, index) => (
        <Bubble
          key={index}
          emoji={bubble.emoji}
          startX={bubble.startX}
          endX={bubble.endX}
          endY={bubble.endY}
          delay={bubble.delay}
          duration={bubble.duration}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 300,
    zIndex: 9999,
  },
  bubble: {
    position: 'absolute',
    fontSize: 32,
    top: 0,
  },
});

export default BubbleSplash;