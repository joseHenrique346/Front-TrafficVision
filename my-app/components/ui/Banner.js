import { View, Image, StyleSheet } from "react-native";

export default function Banner() {
  return (
    <View style={styles.banner}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 180,
    backgroundColor: "#ffffff55",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 260,
    height: 100,
  },
});
