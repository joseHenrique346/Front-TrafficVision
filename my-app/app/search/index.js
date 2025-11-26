import { useEffect, useState } from "react";
import { View, Text, StyleSheet} from "react-native";
import SearchCard from "./components/SearchCard";
import { useRouter, useLocalSearchParams } from "expo-router";
import ResultCard from "./components/ResultCard";
import ScreenWithBackground from "../components/ScreenWithBackground";
import { getSessionUser } from "../../services/session";

export default function SearchIndex() {
  const router = useRouter();
  const params = useLocalSearchParams();
  useEffect(()=>{
    const u = getSessionUser();
    if (!u) router.replace('/login');
  }, [router]);
  const [initFromParams, setInitFromParams] = useState(false);
  useEffect(()=>{
    if (!initFromParams){
      if (params?.mode){ setMode(String(params.mode)); }
      if (params?.step){ setStep(String(params.step)); }
      setInitFromParams(true);
    }
  }, [params, initFromParams]);
  
  const [mode, setMode] = useState('veiculos');
  const [step, setStep] = useState('choose');
  const [vehicle] = useState(null);

  /**
   * Normaliza a placa para letras/números maiúsculos
   * @param {string} p
   * @returns {string}
   */
  
  
  return (
    <ScreenWithBackground>
      <View style={styles.wrap}>
        <View style={styles.leftCol}>
          <SearchCard
            type={step==='choose' ? 'choose' : (mode==='veiculos' ? 'veiculos' : 'registros')}
            styles={styles}
            onSelectMode={(m)=> { setMode(m); setStep('panel'); }}
            onBack={()=> setStep('choose')}
          />
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.heroText}>Facilidade, tecnologia e{ '\n' }eficiência na gestão do{ '\n' }trânsito.</Text>
          <Text style={styles.heroSub}>Desenvolvemos, implantamos e gerenciamos softwares inteligentes que irão facilitar e modernizar o setor de trânsito e transporte do seu município.</Text>
        </View>
        {vehicle && (<ResultCard styles={styles} vehicle={vehicle} />)}
      </View>
    </ScreenWithBackground>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    flex: 1, 
    flexDirection:'row',
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  leftCol:{
    width:'48%',
    maxWidth:600
  },
  rightCol:{
    width:'48%',
    maxWidth:600,
    paddingLeft:20,
  },

  card: {
    width: '100%',
    maxWidth: 560,
    left: 250,
    paddingVertical: 22,
    paddingHorizontal: 22,
    minHeight: 260,
    backgroundColor: '#ffffffee',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 40,
    marginLeft: 100
  },

  cardRegistro: {
    width: '100%',
    maxWidth: 560,
    left: 250,
    paddingVertical: 22,
    paddingHorizontal: 22,
    minHeight: 260,
    backgroundColor: '#ffffffee',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
    marginLeft: 100
  },

  cardVeiculo: {
    width: '100%',
    maxWidth: 560,
    left: 250,
    paddingVertical: 22,
    paddingHorizontal: 22,
    minHeight: 260,
    backgroundColor: '#ffffffee',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 160,
    marginLeft: 130
  },

  cardChoose:{
    width: 320,
    minHeight: 480,
    marginTop: 120,
    marginLeft: 210
  },
  switchRow:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:14
  },
  switchBtn:{
    backgroundColor:'#eee',
    paddingVertical:10,
    paddingHorizontal:14,
    borderRadius:20,
    marginHorizontal:6
  },
  switchBtnActive:{
    backgroundColor:'#FFD500'
  },
  switchLabel:{
    color:'#000',
    fontWeight:'600'
  },
  heroText:{
    color:'#fff',
    fontSize:86,
    fontWeight:'750',
    lineHeight:80,
    right:200,
    marginTop:160
  },
  heroSub:{
    color:'#FFD500',
    fontSize:22,
    marginTop:24,
    right:200,
    
  },

  title: { 
    fontSize: 26, 
    marginBottom: 12,
    textAlign:'center',
    fontWeight: "700",
    marginTop:10
  },

  label: {
    fontSize: 24,
    marginBottom: 6,
    fontWeight: '600'
  },

  input: {
    width: "100%",
    maxWidth: 520,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#ffffff55",
    borderColor: "#ccc",
    fontSize: 18,
    color: '#000'
  },
  btnCentered:{
    alignSelf:'center',
    width:'60%',
    maxWidth:360,
    marginTop:24,
    marginBottom:20
  },
  actionColumn:{
    marginTop: 50,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  btnStack:{
    width:'60%',
    marginTop: 10,
    maxWidth:360,
    marginVertical:6,
  },
  uploadWeb:{
    marginTop:8,
    width:'100%',
    maxWidth:560,
    alignSelf:'center',
    alignItems:'center',
    backgroundColor:'#ffffffee',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd',
    padding:10
  },
  uploadNative:{
    marginTop:16,
    width:'100%',
    maxWidth:560,
    alignSelf:'center',
    alignItems:'center'
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

  errorField: { 
    color: "#b80000", 
    marginTop: 6 
  },

  resultCard:{
    width:'85%',
    maxWidth:700,
    padding:16,
    backgroundColor:'#ffffffee',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd',
    marginTop:14
  },
  iconRow:{
    marginTop: 36,
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  iconAction:{ alignItems:'center' },
  iconCircle:{
    width:96, height:96, borderRadius:48,
    borderWidth:2, borderColor:'#000', backgroundColor:'#fff',
    justifyContent:'center', alignItems:'center'
  },
  iconEmoji:{ fontSize:36 },
  iconLabel:{ textAlign:'center', marginTop:6 },
  linkRow:{ alignItems:'center', marginTop:16 },
  linkBlue:{ color:'#2f74ff' },

  insetBox:{
    marginTop:8,
    padding:16,
    backgroundColor:'#eeeeee',
    borderRadius:10
  },

  tabRow:{ 
    flexDirection:'row', 
    justifyContent:'space-around', 
    marginBottom:12 
  },

  tabBtn:{ 
    backgroundColor:'#ddd', 
    paddingVertical:6, 
    paddingHorizontal:12, 
    borderRadius:16 
  },

  tabActive:{ 
    backgroundColor:'#FFD500' 
  },

  chooseButtons:{ 
    flexDirection:'column', 
    justifyContent:'flex-start', 
    alignItems:'center', 
    marginTop:12 
  },

  chooseBtn:{ 
    width:'80%', 
    alignSelf:'center', 
    paddingVertical:18, 
    borderRadius:20, 
    marginBottom:12 
  },

  chooseTitle:{
    fontSize:24,
    marginBottom:16
  },
  
  dateRow:{ 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    backgroundColor:'#fff',
    padding:10, 
    borderRadius:8 
  },

  dateIcon:{ 
    fontSize:18 
  },

  dateText:{ 
    fontSize:16, 
    fontWeight:'600' 
  },

  dateCaret:{ 
    fontSize:16 
  },
  
  filterGrid:{ 
    flexDirection:'row', 
    flexWrap:'wrap', 
    justifyContent:'space-between', 
    marginTop:14 
  },
  
  checkItem:{ 
    width:'48%', 
    flexDirection:'row', 
    alignItems:'center',
     marginBottom:10 
    },

  checkBox:{ 
    width:18, 
    height:18, 
    borderWidth:1, 
    borderColor:'#444', 
    marginRight:8, 
    borderRadius:4,
    backgroundColor:'transparent' 
  },

  checkBoxChecked:{ 
    backgroundColor:'#000' 
  },

  checkLabel:{ 
    fontSize:16 
  },
  
  exportRow:{ 
    flexDirection:'row', 
    alignItems:'center', 
    marginTop:12 
  },

  exportLabel:{ 
    fontSize:16 
  },

  exportCaret:{ 
    marginLeft:8 
  },
  
  formatBox:{ 
    marginLeft:10, 
    borderWidth:1, 
    borderColor:'#444', 
    borderRadius:6, 
    paddingVertical:6, 
    paddingHorizontal:10, 
    backgroundColor:'#fff' 
  },

  formatText:{ 
    fontWeight:'700'
  },
  
  resultTitle:{
    fontSize:20,
    fontWeight:'700',
    marginBottom:8,
    textAlign:'center'
  },
  sectionTitle:{
    width:'100%',
    fontSize:16,
    fontWeight:'700',
    marginBottom:6
  },
  resultGrid:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  fieldItem:{
    width:'31%',
    minWidth:220,
    marginBottom:8
  },
  fieldLabel:{
    fontWeight:'600'
  },
  fieldValue:{
    color:'#333'
  },
  overlay:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    justifyContent:'center',
    alignItems:'center',
    zIndex: 1000
  },
  overlayBackdrop:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'rgba(0,0,0,0.4)',
    zIndex: 999
  },
  overlayCard:{
    width:'80%',
    maxWidth:700,
    maxHeight:'80%',
    backgroundColor:'#ffffff',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd',
    padding:16,
    zIndex: 1001
  }
});
