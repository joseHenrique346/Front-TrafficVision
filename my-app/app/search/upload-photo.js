import { View, Text, StyleSheet, Image, Platform } from "react-native";
import YellowButton from "../components/YellowButton";
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getSessionUser } from '../../services/session';

export default function UploadPhoto() {
  const router = useRouter();
  useEffect(()=>{
    const u = getSessionUser();
    if (!u) router.replace('/login');
  },
);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUri, setPreviewUri] = useState("");
  const [success, setSuccess] = useState("");

  function onFileChange(e){
    const file = e?.target?.files?.[0];
    if (file){
      setSelectedFile(file);
      try{ setPreviewUri(URL.createObjectURL(file)); }catch(_){ setPreviewUri(""); }
      setSuccess("");
    }
  }

  async function handleUploadSimulated(){
    if (!selectedFile){
      alert("Selecione uma imagem primeiro.");
      return;
    }
    setSuccess("registro feito com sucesso");

  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Foto</Text>
      {Platform.OS === 'web' ? (
        <View style={styles.webBlock}>
          <input type="file" accept="image/*" onChange={onFileChange} style={{marginTop:12}} />
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={styles.preview} />
          ) : null}
          {success ? (<Text style={styles.success}>{success}</Text>) : null}
          <YellowButton title="Enviar Foto" onPress={handleUploadSimulated} style={styles.btn} />
        </View>
      ) : (
        <View style={styles.nativeBlock}>
          <Text style={{textAlign:'center'}}>Seleção de imagem no mobile será integrada com expo-image-picker.</Text>
          <YellowButton title="Escolher Foto (em breve)" onPress={()=>{}} style={styles.btn} disabled />
        </View>
      )}
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
    fontSize:20,
    fontWeight:'700'
  },
  webBlock:{
    width:'95%',
    maxWidth:640,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#ffffffee',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd',
    padding:16,
    marginTop:10
  },
  nativeBlock:{
    width:'85%',
    maxWidth:500,
    alignItems:'center',
    justifyContent:'center',
    padding:16
  },
  preview:{
    width:360,
    height:220,
    objectFit:'contain',
    marginTop:12,
    borderRadius:8,
    borderWidth:1,
    borderColor:'#ddd'
  },
  success:{
    color:'#2e7d32',
    fontWeight:'600',
    marginTop:12
  },
  btn:{
    width:'60%',
    maxWidth:320,
    marginTop:16
  }
});
