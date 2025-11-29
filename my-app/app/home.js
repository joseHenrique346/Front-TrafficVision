// app/home.js
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getSessionUser } from '../services/session';
import ScreenWithBackground from './components/ScreenWithBackground';
import FeatureCard from './components/FeatureCard';

export default function Home() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [bannerColor, setBannerColor] = useState('transparent');
  const BANNER_TARGET_RGBA = 'rgba(63,71,77,'; 
  useEffect(()=>{
    const u = getSessionUser();
    if (!u) router.replace('/login');
  },
);

  function go(path){
    const u = getSessionUser();
    if (!u) { router.replace('/login'); return; }
    router.push(path);
  }

  return (
    <ScreenWithBackground bannerColor={bannerColor} brandTextColor="#fff" navTextColor="#fff" contentPaddingTop={0} showBackground={true} rootBackgroundColor="#fff" backgroundHeight={height}>
      <ScrollView
        onScroll={(e)=>{
          const y = e.nativeEvent.contentOffset.y;
          const t = Math.max(0, Math.min(1, y / 220));
          setBannerColor(`${BANNER_TARGET_RGBA}${t})`);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <View style={[styles.section, { height }] }>
          <View style={styles.heroLeft}>
            <Text style={styles.heroTitle}>Traffic Vision,{ '\n' }Soluções para melhorar{ '\n' }o trânsito.</Text>

            <Text style={styles.heroSubtitle}>A Traffic Vision é perfeita para ajudar { '\n' }você a gerenciar o setor de trânsito{ '\n' }e transporte do seu município.</Text>
          </View>
          <View style={styles.accentTop} />
          <View style={styles.accentBottom} />
        </View>

        <View style={styles.whiteSection}>
          <View style={styles.cardsRow}>
            <FeatureCard title="Talonário Eletrônico" imageSource={require('../assets/images/cardHomeEsquerda.jpg')} disabled />
            <FeatureCard title="TRAFFIC VISION" imageSource={require('../assets/images/cardHomeMeio.png')} onPress={()=> go('/search')} />
            <FeatureCard title="Área Azul Eletrônica" imageSource={require('../assets/images/cardHomeDireita.jpg')} disabled />
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenWithBackground>
  );
}

const styles = StyleSheet.create({
  section:{
    width:'100%',
    justifyContent:'center'
  },
  whiteSection:{
    width:'100%',
    backgroundColor:'#fff',
    paddingTop:100,
    paddingBottom:200
  },
  cardsRow:{
    width:'95%',
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop: 20
  },
  leftWrap:{
    flexDirection:'row',
    alignItems:'flex-start'
  },
  card:{
    width:'90%',
    maxWidth:450,
    padding:22,
    height: 450,
    backgroundColor:'#ffffffee',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd',
    marginLeft: 24
  },
  
  title:{
    fontSize:28,
    fontWeight:'500',
    textAlign:'center',
    marginBottom:30,
    marginTop:30
  },
  btn:{
    alignSelf:'center',
    width:'70%',
    maxWidth:320,
    marginTop:45
  },
  btnAlt:{
    alignSelf:'flex-start',
    width:260,
    maxWidth:320,
    marginTop:24
  },
  heroLeft:{
    marginLeft: 80,
    width:'50%',
    maxWidth:580
  },
  heroLeftTextOnly:{
    marginLeft: 60,
    width:'40%',
    maxWidth:580
  },
  heroTitle:{
    color:'#fff',
    fontSize:82,
    fontWeight:'700',
    marginTop: 0,
    left: 100,
    lineHeight:80
  },
  heroSubtitle:{
    color:'#FFD500',
    fontSize:20,
    marginTop:24,
    left: 100,
    maxWidth:600
  },
  accentTop:{
    position:'absolute',
    top: 90,
    right: 70,
    width: 420,
    height: 150,
    backgroundColor:'#FFD500',
    borderRadius:8,
    transform:[{ skewX: '-15deg' }]
  },
  accentBottom:{
    position:'absolute',
    bottom: 80,
    right: 130,
    width: 720,
    height: 200,
    backgroundColor:'#FFD500',
    borderRadius:8,
    transform:[{ skewX: '-15deg' }]
  }
});
