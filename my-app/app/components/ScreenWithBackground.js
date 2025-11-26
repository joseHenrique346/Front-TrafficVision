import { View, ImageBackground, Image, StyleSheet, TouchableOpacity, Linking, Text } from "react-native";
import { useRouter, useSegments } from 'expo-router';
import { getSessionUser } from '../../services/session';

export default function ScreenWithBackground({ children, bannerColor, brandTextColor, navTextColor, contentPaddingTop, showBackground = true, rootBackgroundColor, backgroundHeight }) {
  const router = useRouter();
  const segments = useSegments();
  const atLoginOrRegister = segments[0] === 'login' || segments[0] === 'register';
  const hideBrandTitle = atLoginOrRegister || segments[0] === 'home';

  function go(path){
    const u = getSessionUser();
    if (!u) { router.replace('/login'); return; }
    router.push(path);
  }

  return (
    <View style={[styles.root, rootBackgroundColor ? { backgroundColor: rootBackgroundColor } : null]}>
      {/* FUNDO */}
      {showBackground && (
        backgroundHeight ? (
          <View style={[styles.backgroundBox, { height: backgroundHeight }]}> 
            <ImageBackground
              source={require("../../assets/images/background.png")}
              style={styles.backgroundFit}
              resizeMode="cover"
            />
          </View>
        ) : (
          <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.background}
            resizeMode="cover"
          />
        )
      )}

      {/* BANNER */}
      <View style={[styles.banner, { backgroundColor: bannerColor ?? '#3F474D' }]}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        { !hideBrandTitle && (
          <Text style={[styles.brandTitle, { color: brandTextColor ?? '#fff' }]}>Ｔｒａｆｆｉｃ　Ｖｉｓｉｏｎ</Text>
        ) }

        {/* Links de navegação (ocultos em login/registro) */}
        {!atLoginOrRegister && (
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={()=> go('/home')} accessibilityRole="link" style={[styles.navLinkWrap, styles.navLinkFirst]}>
              <Text style={[styles.navLinkBlack, { color: navTextColor ?? '#fff' }]}>Home</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ícones sociais no canto direito */}
        <View style={[styles.socials, atLoginOrRegister ? { marginLeft: 'auto' } : { marginLeft: 4 }]}>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.instagram.com/dsintecnologia")}
            style={[styles.socialBtn, { marginLeft: 0 }]}
            accessibilityRole="link"
            accessibilityLabel="Abrir Instagram DSIN">
            <Image source={require("../../assets/images/Instagram.png")} style={styles.socialImg} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL("https://www.facebook.com/DSINTECNOLOGIA")}
            style={[styles.socialBtn, { marginLeft: 10 }]}
            accessibilityRole="link"
            accessibilityLabel="Abrir Facebook DSIN">
            <Image source={require("../../assets/images/Facebook.png")} style={styles.socialImg} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO */}
      <View style={[styles.content, { paddingTop: contentPaddingTop ?? 10 }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  backgroundBox:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    overflow:'hidden'
  },
  backgroundFit:{
    width:'100%',
    height:'100%'
  },

  banner: {
    width: "100%",
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 8,
    zIndex: 2,
  },

  logo: {
    width: 250,
    height: 90,
  },

  brandTitle:{
    marginLeft: 16,
    fontSize: 30,
    fontWeight: '700',
    color: '#000'
  },
  navLinks:{
    marginLeft: 'auto',
    flexDirection:'row',
    alignItems:'center'
  },
  navLinkWrap:{
    marginRight: 90
  },
  navLinkFirst:{
    marginLeft: 0
  },
  navLinkBlack:{
    color:'#000',
    fontSize:22,
    fontWeight:'600'
  },

  socials: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  socialBtn: {
    width: 104,
    height: 104,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  socialImg:{
    width: 72,
    height: 72,
  },

  content: {
    flex: 1,
    zIndex: 3,
    paddingTop: 10,
  },
});
