import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const InitialScreen = () => {
  
  return (
    <View style={styles.container}>
      <StatusBar style='light'/>
      
      <View>
        <Text className="text-white text-lg" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>KU Network</Text>
        <ActivityIndicator
            size={'large'}
            animating={true}
            color={'white'}
        />
      </View>
    </View>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#016FEC",
    alignItems: "center",
    justifyContent: "center",
  },
});
