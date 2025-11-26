import { View, ImageBackground, StyleSheet, Text } from 'react-native';
import YellowButton from './YellowButton';

export default function FeatureCard({ title, imageSource, onPress, disabled, style, buttonTitle = 'Saiba mais' }){
  return (
    <View style={[styles.card, style]}>
      <ImageBackground source={imageSource} style={styles.image} imageStyle={styles.imageStyle} resizeMode="cover">
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
          <YellowButton title={buttonTitle} onPress={onPress} disabled={disabled} style={styles.button} />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{
    width:'33.3333%',
    minWidth:280,
    height:700,
    borderRadius:18,
    overflow:'hidden',
    position:'relative'
  },
  image:{
    flex:1
  },
  imageStyle:{
    minWidth:480,
    height:700,
    marginLeft: 120,
    borderRadius:18
  },
  overlay:{
    position:'absolute',
    top:0,
    left:60,
    right:0,
    bottom:0,
    padding:80,
    backgroundColor:'transparent',
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    color:'#fff',
    fontSize:28,
    fontWeight:'700',
    textAlign:'center',
    width:'100%',
    textShadowColor:'#000',
    textShadowOffset:{width:0,height:1},
    textShadowRadius:3,
    marginBottom:26
  },
  button:{
    width:280,
    alignSelf:'center',
    borderRadius:24
  }
});

