// app/login.js
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import YellowButton from "./components/YellowButton";
import { mockLogin } from "../services/apiMock";
import { saveSessionUser } from "../services/session";
import ScreenWithBackground from "./components/ScreenWithBackground";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  function validarEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleLogin() {
    setErroEmail(""); setErroSenha(""); setErroGeral("");

    if (!email.trim()) { setErroEmail("O email é obrigatório."); return; }
    if (!validarEmail(email)) { setErroEmail("Informe um email válido."); return; }

    if (!senha.trim()) { setErroSenha("A senha é obrigatória."); return; }
    if (senha.length < 6) { setErroSenha("A senha deve ter pelo menos 6 caracteres."); return; }

    const resp = await mockLogin({ userEmail: email, userPassword: senha });
    if (!resp.isSuccess) { setErroGeral(resp.listMessageErrors[0] || "Erro ao logar."); return; }
    saveSessionUser(resp.content);
    router.push("/home");
  }

  return (
    <ScreenWithBackground>
      <View style={styles.topRightLogo} />
      <View style={styles.formWrap}>
        <View style={styles.card}>
          <Text style={styles.title}>Faça seu Login</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput placeholder="Email. Ex: usuario@gmail.com" placeholderTextColor="#999" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          {erroEmail ? <Text style={styles.errorField}>{erroEmail}</Text> : null}

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrap}>
            <TextInput placeholder="Senha. Ex: Abc@1234" placeholderTextColor="#999" secureTextEntry={!showSenha} style={styles.input} value={senha} onChangeText={setSenha} />
            <TouchableOpacity onPress={()=> setShowSenha((v)=> !v)} style={styles.eyeBtn}><Ionicons name={showSenha ? 'eye-off' : 'eye'} size={22} color="#333" /></TouchableOpacity>
          </View>
          {erroSenha ? <Text style={styles.errorField}>{erroSenha}</Text> : null}

          {erroGeral ? <Text style={styles.errorGeneral}>{erroGeral}</Text> : null}

          <YellowButton title="LOGIN" onPress={handleLogin} style={styles.btn} />

          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>Não tem conta?</Text>
            <Link href="/register" style={styles.link}>Acesse aqui</Link>
          </View>
        </View>
      </View>
    </ScreenWithBackground>
  );
}

const styles = StyleSheet.create({
  ScreenWithBackground: { 
    flex: 1, 
    paddingHorizontal: 16,
    backgroundColor: "transparent"
  },

  
  formWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "85%",
    minHeight: 360,
    maxWidth: 560,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#ffffffee",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  title: {
    marginTop:30,
    alignSelf: "Center",
    marginLeft: 6,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 60,
  },

  input: {
    width: "100%",
    maxWidth: 520,
    padding: 18,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#ffffff55",  
    borderColor: "#ccc",
    fontSize: 20,
    paddingRight: 42,
    color: '#000'
  },


  btn: { 
    alignSelf: "center",
    width: "60%", 
    maxWidth: 360, 
    marginTop: 30
  },
  inputWrap:{
    position:'relative',
    width:'100%',
    maxWidth:520
  },
  eyeBtn:{
    position:'absolute',
    right:12,
    top:0,
    bottom:0,
    justifyContent:'center'
  },

  signupRow:{
    marginTop: 70,
    flexDirection:'row',
    alignItems:'center'
  },
  signupPrompt:{
    fontSize: 20,
    marginRight: 6,
    color:'#686565ff'
  },
  link: { 
    color: "blue", 
    fontSize: 18
  },
  label:{
    fontWeight:'700',
    marginLeft:6,
    marginTop:8
  },

  errorField: { 
    width: "100%", 
    maxWidth: 520, 
    color: "#b80000", 
    marginTop: 6, 
    marginBottom: 6,
    fontSize: 20
  },

  errorGeneral: { 
    width: "100%", 
    maxWidth: 520, 
    color: "#9b1c1c", 
    backgroundColor: "#ffecec", 
    padding: 10, 
    borderRadius: 8, 
    textAlign: "center",
    fontSize: 20, 
    marginTop: 8 
  },

  topRightLogo: {
    position: 'absolute',
    top: 130, 
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
  }
});
