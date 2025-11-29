import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import YellowButton from "./components/YellowButton";
import { mockRegister, EnumUserRole } from "../services/apiMock";
import ScreenWithBackground from "./components/ScreenWithBackground";

  export default function Register() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
    const [errNome, setErrNome] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errSenha, setErrSenha] = useState("");
  const [errSenhaConfirm, setErrSenhaConfirm] = useState("");
  const [errGeral, setErrGeral] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showSenhaConfirm, setShowSenhaConfirm] = useState(false);

    function validarEmail(e) { return /\S+@\S+\.\S+/.test(e); }
    function validarSenhaForte(s) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(s);
    }

    async function handleRegister() {
      setErrNome(""); setErrEmail(""); setErrSenha(""); setErrSenhaConfirm(""); setErrGeral("");

      if (!nome.trim()) { setErrNome("O nome é obrigatório."); return; }
      if (!email.trim()) { setErrEmail("O email é obrigatório."); return; }
      if (!validarEmail(email)) { setErrEmail("Informe um email válido."); return; }

      if (!senha) { setErrSenha("A senha é obrigatória."); return; }
      if (!validarSenhaForte(senha)) {
        setErrSenha("A senha precisa ter no mínimo 8 caracteres, ao menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caracter especial.");
        return;
      }

      if (senha !== senhaConfirm) { setErrSenhaConfirm("As senhas não conferem."); return; }

      const resp = await mockRegister({ userName: nome, userEmail: email, userPassword: senha, userRole: EnumUserRole.Comum });
      if (!resp.isSuccess) { setErrGeral(resp.listMessageErrors[0] || "Erro ao registrar."); return; }
      router.push("/login");
    }

  return (
      <ScreenWithBackground>
        <View style={styles.topRightLogo} />

        <View style={styles.formWrap}>
          <View style={styles.card}>
            <Text style={styles.title}>Registrar</Text>
            <Text style={styles.label}>Nome</Text>
            <TextInput placeholder="Nome completo. Ex: João Silva" placeholderTextColor="#999" style={styles.input} value={nome} onChangeText={setNome} />
            {errNome ? <Text style={styles.errorField}>{errNome}</Text> : null}
            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Email. Ex: usuario@gmail.com" placeholderTextColor="#999" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
            {errEmail ? <Text style={styles.errorField}>{errEmail}</Text> : null}
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrap}>
              <TextInput placeholder="Senha forte. Ex: Abc@1234" placeholderTextColor="#999" secureTextEntry={!showSenha} style={styles.input} value={senha} onChangeText={setSenha} />
              <TouchableOpacity onPress={()=> setShowSenha((v)=> !v)} style={styles.eyeBtn}><Ionicons name={showSenha ? 'eye-off' : 'eye'} size={22} color="#333" /></TouchableOpacity>
            </View>
            {errSenha ? <Text style={styles.errorField}>{errSenha}</Text> : null}
            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={styles.inputWrap}>
              <TextInput placeholder="Confirme a senha. Ex: Abc@1234" placeholderTextColor="#999" secureTextEntry={!showSenhaConfirm} style={styles.input} value={senhaConfirm} onChangeText={setSenhaConfirm} />
              <TouchableOpacity onPress={()=> setShowSenhaConfirm((v)=> !v)} style={styles.eyeBtn}><Ionicons name={showSenhaConfirm ? 'eye-off' : 'eye'} size={22} color="#333" /></TouchableOpacity>
            </View>
            {errSenhaConfirm ? <Text style={styles.errorField}>{errSenhaConfirm}</Text> : null}

            {errGeral ? <Text style={styles.errorGeneral}>{errGeral}</Text> : null}

            <YellowButton title="Registrar-se" onPress={handleRegister} style={styles.btn} />
            <Link href="/login" style={styles.link}>Já tenho conta</Link>
          </View>
        </View>
      </ScreenWithBackground>
    );
  }

  const styles = StyleSheet.create({
    ScreenWithBackground:{ 
      flex:1, 
      paddingHorizontal:16,
      backgroundColor: "transparent"
    },

    formWrap:{ 
      flex:1, 
      justifyContent:"center", 
      alignItems:"center" 
    },

    card:{
      width:"85%",
      maxWidth:560,
      paddingVertical:18,
      paddingHorizontal:16,
      backgroundColor:"#ffffffee",
      borderRadius:12,
      borderWidth:1,
      borderColor:'#ddd'
    },

    title:{ 
      alignSelf:"Center", 
      marginLeft:6, 
      fontSize:28, 
      fontWeight:"700", 
      marginBottom:12 
    },

  input:{ 
    width:"100%", 
    maxWidth:520, 
    padding:18, 
    borderWidth:1, 
    borderRadius:8, 
    marginTop:8, 
    backgroundColor:"#ffffff55",   
    borderColor:"#ccc",
    fontSize:22,
    paddingRight:42,
    color:'#000' 
  },


  btn:{ 
    alignSelf:"center",
    width:"60%", 
    maxWidth:360, 
    marginTop:45
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

    link:{ 
      marginTop:60, 
      color:"blue", 
      fontSize:18 
    },
    label:{
      fontWeight:'700',
      marginLeft:6,
      marginTop:8
    },

    errorField:{ 
      width:"100%", 
      maxWidth:520, 
      color:"#b80000", 
      marginTop:6, 
      marginBottom:6 
    },

    errorGeneral:{ 
      width:"100%", 
      maxWidth:520, 
      color:"#9b1c1c", 
      backgroundColor: "#ffffff55",
      padding:10, 
      borderRadius:8, 
      textAlign:"center", 
      marginTop:8 
    },
    topRightLogo:{
      position:'absolute',
      top:130,
      right:20,
      width:60,
      height:60,
      backgroundColor:'transparent'
    }
  });
