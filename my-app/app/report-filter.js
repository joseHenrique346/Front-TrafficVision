// app/report-filter.js
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import YellowButton from './components/YellowButton';
import ScreenWithBackground from './components/ScreenWithBackground';
import { useRouter } from 'expo-router';
import { apiListReports } from '../services/apiConection';
import { getSessionUser } from '../services/session';

export default function ReportFilter() {
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState(''); // 'daily' | 'weekly' | 'monthly' | 'specific'

  useEffect(()=>{
    const u = getSessionUser();
    if (!u) router.replace('/login');
  }, [router]);

  function formatBrDateInput(value){
    const digits = (value || '').replace(/\D/g, '').slice(0,8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0,2)}/${digits.slice(2)}`;
    return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`;
  }

  async function handleSearch(selectedMode) {
    setError('');
    const modeToUse = selectedMode || mode;
    let s = startDate, e = endDate;
    const quick = (function(){
      const today = new Date();
      const pad = (n)=> String(n).padStart(2,'0');
      const toBr = (d)=> `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
      if (modeToUse === 'daily'){
        const s = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0);
        const e = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59);
        return { start: toBr(s), end: toBr(e) };
      }
      if (modeToUse === 'weekly'){
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const end = new Date(today);
        return { start: toBr(start), end: toBr(end) };
      }
      if (modeToUse === 'monthly'){
        const start = new Date(today);
        start.setDate(today.getDate() - 30);
        const end = new Date(today);
        return { start: toBr(start), end: toBr(end) };
      }
      return null;
    })();
    if (modeToUse !== 'specific' && quick){
      s = quick.start;
      e = quick.end;
    } else {
      if (!startDate || !endDate) {
        setError('Informe data de início e término.');
        return;
      }
      if (!isValidBrDate(startDate) || !isValidBrDate(endDate)){
        setError('Use o formato brasileiro: dd/MM/yyyy');
        return;
      }
    }
    const resp = await apiListReports({ startDate: s, endDate: e });
    if (!resp.isSuccess) {
      setError(resp.listMessageErrors?.[0] || 'Erro ao consultar.');
      return;
    }
    const content = resp.content || [];
    if (content.length === 0){
      setError('Nada foi registrado no momento.');
      return;
    }
    router.push({ pathname: '/report-result', params: { startDate: s, endDate: e, data: JSON.stringify(content) } });
  }

  return (
    <ScreenWithBackground>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <Text style={styles.title}>Gerar Relatório por Período</Text>

          <Text style={styles.subtitle}>Escolha o tipo de relatório</Text>
          <View style={styles.row}>
            <YellowButton title={mode === 'specific' ? 'Ocultar relatório específico' : 'Relatório Específico'} onPress={()=> setMode((m)=> m === 'specific' ? '' : 'specific')} style={styles.btn} />
            {mode === 'specific' && (
              <View style={styles.specificBox}>
                <TextInput
                  placeholder="Data de início (Dia/Mês/Ano)"
                  placeholderTextColor="#999"
                  style={styles.input}
                  keyboardType="numeric"
                  value={startDate}
                  onChangeText={(v)=> setStartDate(formatBrDateInput(v))}
                />
                <TextInput
                  placeholder="Data de término (Dia/Mês/Ano)"
                  placeholderTextColor="#999"
                  style={styles.input}
                  keyboardType="numeric"
                  value={endDate}
                  onChangeText={(v)=> setEndDate(formatBrDateInput(v))}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <YellowButton title="Pesquisar" onPress={handleSearch} style={styles.btn} />
              </View>
            )}
            {mode !== 'specific' && (
              <>
                <YellowButton title="Relatório Diário" onPress={()=> { setMode('daily'); handleSearch('daily'); }} style={styles.btn} />
                <YellowButton title="Relatório Semanal" onPress={()=> { setMode('weekly'); handleSearch('weekly'); }} style={styles.btn} />
                <YellowButton title="Relatório Mensal" onPress={()=> { setMode('monthly'); handleSearch('monthly'); }} style={styles.btn} />
              </>
            )}
          </View>
        </View>
      </View>
    </ScreenWithBackground>
  );
}

function isValidBrDate(s){
  const m = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/(\d{4})$/.exec(s);
  if (!m) return false;
  const d = parseInt(m[1],10), mo = parseInt(m[2],10)-1, y = parseInt(m[3],10);
  const dt = new Date(y, mo, d);
  return dt.getFullYear()===y && dt.getMonth()===mo && dt.getDate()===d;
}

const styles = StyleSheet.create({
  wrap:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  card:{
    width:'90%',
    maxWidth:560,
    minHeight:320,
    padding:22,
    backgroundColor:'#ffffffee',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd'
  },
  title:{
    marginTop:30,
    fontSize:24,
    fontWeight:'700',
    textAlign:'center',
    marginBottom:24
  },
  subtitle:{
    fontSize:20,
    fontWeight:'600',
    textAlign:'center',
    marginBottom:28
  },
  input:{
    width:'100%',
    maxWidth:560,
    padding:18,
    borderWidth:1,
    borderRadius:8,
    backgroundColor:'#ffffff55',
    borderColor:'#ccc',
    marginTop:8,
    fontSize:18,
    color:'#000'
  },
  btn:{
    alignSelf:'center',
    width:'60%',
    maxWidth:360,
    marginTop:14,
    marginBottom:10
  },
  specificBox:{
    width:'100%',
    maxWidth:560,
    marginTop:10
  },
  wrapRaised:{
    marginTop:-40
  },
  error:{
    color:'#9b1c1c',
    marginTop:8
  },
  item:{
    padding:10,
    borderWidth:1,
    borderColor:'#eee',
    borderRadius:8,
    marginBottom:8,
    backgroundColor:'#fff'
  },
  row:{
    flexDirection:'column'
  }
});
