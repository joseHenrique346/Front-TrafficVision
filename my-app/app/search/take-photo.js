import { View, Text, Button, StyleSheet} from "react-native";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getSessionUser } from '../../services/session';

export default function TakePhoto() {
  const router = useRouter();
  useEffect(()=>{
    const u = getSessionUser();
    if (!u) router.replace('/login');
  },
);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tirar Foto (simulado)</Text>
      <View style={{marginTop:20}}><Button title="Simular tirar foto" onPress={()=>alert('Foto simulada')} /></View>
    </View>
  );
}
const styles = StyleSheet.create({ 
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },

  title:{
    fontSize:20
  },
});
