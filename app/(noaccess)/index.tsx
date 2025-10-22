import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const InitialScreen = () => {
  
  return (
    <View style={styles.container}>
      <StatusBar style='light'/>
      
      <View>
        <ActivityIndicator
            size={'large'}
            animating={true}
            color={'#0066CC'}
        />
      </View>
    </View>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
