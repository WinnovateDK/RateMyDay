import React, { useRef, useEffect, ReactNode } from 'react'
import { Animated, Dimensions, Easing, ImageSourcePropType, View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window')

const CLOUDS = [
  {
    source: require('../assets/clouds.png'),
    top: 100,
    speed: 30000,
    scale: 0.7,
    delay: 0,
  },
  {
    source: require('../assets/clouds.png'),
    top: 200,
    speed: 25000,
    scale: 0.6,
    delay: 5000,
  },
  {
    source: require('../assets/clouds.png'),
    top: 500,
    speed: 15000,
    scale: 0.5,
    delay: 12000,
  },
  {
    source: require('../assets/clouds.png'),
    top: 700,
    speed: 27000,
    scale: 0.4,
    delay: 15000,
  }
]

export function Background({ children }: { children: ReactNode }) {
  const cloudAnims = useRef(CLOUDS.map(() => new Animated.Value(-200))).current

  useEffect(() => {
    const animations = CLOUDS.map((cloud, index) => {
      const anim = cloudAnims[index]
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: width + 200,
            duration: cloud.speed,
            delay: cloud.delay,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: -200,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      )
    })

    animations.forEach(anim => anim.start())

    return () => {
      animations.forEach(anim => anim.stop())
    }
  }, [])

  return (
    <LinearGradient colors={["#034f84", "#3c6e71"]} style={{ flex: 1 }}>
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {CLOUDS.map((cloud, i) => (
          <Animated.Image
            key={i}
            source={cloud.source}
            style={{
              position: 'absolute',
              top: cloud.top,
              width: 200 * cloud.scale,
              height: 120 * cloud.scale,
              opacity: 0.8,
              transform: [{ translateX: cloudAnims[i] }],
            }}
            resizeMode="contain"
          />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </LinearGradient>
  )
}