"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Animated, Dimensions, Modal, TouchableWithoutFeedback, View } from "react-native"
import { PanGestureHandler, State } from "react-native-gesture-handler"

interface CustomModalProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  animationType?: "slide" | "fade"
  backdropOpacity?: number
}

const { height: screenHeight } = Dimensions.get("window")

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  animationType = "slide",
  backdropOpacity = 0.5,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const backdropAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Show modal animations
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: backdropOpacity,
          duration: 300,
          useNativeDriver: true,
        }),
        animationType === "slide"
          ? Animated.spring(slideAnim, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          : Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
      ]).start()
    } else {
      // Hide modal animations
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        animationType === "slide"
          ? Animated.timing(slideAnim, {
              toValue: screenHeight,
              duration: 250,
              useNativeDriver: true,
            })
          : Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
      ]).start()
    }
  }, [visible, animationType, backdropOpacity])

  const handleBackdropPress = () => {
    onClose()
  }

  const handleGestureEvent = Animated.event([{ nativeEvent: { translationY: slideAnim } }], { useNativeDriver: true })

  const handleGestureStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent

      // If dragged down significantly or with high velocity, close modal
      if (translationY > 100 || velocityY > 500) {
        onClose()
      } else {
        // Snap back to original position
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start()
      }
    }
  }

  if (!visible) return null

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              opacity: backdropAnim,
            }}
          />
        </TouchableWithoutFeedback>

        {/* Modal Content */}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
          pointerEvents="box-none"
        >
          {animationType === "slide" ? (
            <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureStateChange}>
              <Animated.View
                style={{
                  transform: [{ translateY: slideAnim }],
                  maxHeight: screenHeight * 0.9,
                }}
              >
                {children}
              </Animated.View>
            </PanGestureHandler>
          ) : (
            <Animated.View
              style={{
                opacity: fadeAnim,
                maxHeight: screenHeight * 0.9,
              }}
            >
              {children}
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  )
}

export default CustomModal
