import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  visible, 
  message = 'Please wait...' 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ActivityIndicator size="small" color="#F75F15" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 2000,
  },
  overlay: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 10,
    fontFamily: 'HankenGrotesk_500Medium',
    color: '#3A3541',
  },
});

export default LoadingOverlay;