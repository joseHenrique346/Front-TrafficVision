import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import YellowButton from '../../components/YellowButton';
// import { useRouter } from 'expo-router';
import { apiGenerateReport, EnumTheftVehicleCondition } from '../../../services/apiConection';

export default function ReportGeneratorCard({ styles, onBack }){
  const [reportMode, setReportMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [listColor, setListColor] = useState([]);
  const [listModel, setListModel] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listMunicipality, setListMunicipality] = useState([]);
  const [listState, setListState] = useState([]);
  const [wrecked, setWrecked] = useState(false);
  const [judicialRestriction, setJudicialRestriction] = useState(false);
  const [auction, setAuction] = useState(false);
  const [theftVehicleCondition, setTheftVehicleCondition] = useState(EnumTheftVehicleCondition.None);
  const [showListEditor, setShowListEditor] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarCursor, setCalendarCursor] = useState(new Date());

  function pad2(n){ return String(n).padStart(2,'0'); }
  function toBr(d){ return `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`; }
  function setDateFromDateObj(d){
    setSelectedDate(`${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`);
    setDateError('');
    setShowCalendar(false);
  }
  function isValidBrDate(s){
    const m = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/(\d{4})$/.exec(s || '');
    if (!m) return false;
    const d = parseInt(m[1],10), mo = parseInt(m[2],10)-1, y = parseInt(m[3],10);
    const dt = new Date(y, mo, d);
    return dt.getFullYear()===y && dt.getMonth()===mo && dt.getDate()===d;
  }
  function getRangeForMode(m){
    let base = new Date();
    if (isValidBrDate(selectedDate)){
      const [sd, sm, sy] = selectedDate.split('/').map(Number);
      base = new Date(sy, sm-1, sd);
    }
    if (m === 'daily'){
      const s = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0,0,0);
      const e = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23,59,59);
      return { start: toBr(s), end: toBr(e) };
    }
    if (m === 'weekly'){
      const start = new Date(base); start.setDate(base.getDate()-6);
      const end = new Date(base);
      return { start: toBr(start), end: toBr(end) };
    }
    if (m === 'monthly'){
      const start = new Date(base); start.setDate(base.getDate()-30);
      const end = new Date(base);
      return { start: toBr(start), end: toBr(end) };
    }
    return { start: toBr(base), end: toBr(base) };
  }
  function downloadBlob(blob, filename){
    try{
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }catch(_){
      alert('Falha ao iniciar download.');
    }
  }
  async function handleGenerateReport(){
    if (!isValidBrDate(selectedDate)){
      setDateError('Informe a data no formato Dia/Mês/Ano.');
      return;
    }
    const range = getRangeForMode(reportMode);
    try{
      const [sd, sm, sy] = range.start.split('/').map(Number);
      const [ed, em, ey] = range.end.split('/').map(Number);
      const initialDateIso = `${sy}-${String(sm).padStart(2,'0')}-${String(sd).padStart(2,'0')}T00:00:00.000Z`;
      const finalDateIso = `${ey}-${String(em).padStart(2,'0')}-${String(ed).padStart(2,'0')}T23:59:59.999Z`;
      const resp = await apiGenerateReport({
        userId: 1,
        initialDate: initialDateIso,
        finalDate: finalDateIso,
        listColor,
        wrecked,
        judicialRestriction,
        auction,
        listModel,
        listBrand,
        listMunicipality,
        listState,
        theftVehicleCondition,
      });
      if (!resp.isSuccess){ alert(resp.listMessageErrors?.[0] || 'Erro ao gerar o relatório.'); return; }
      const { blob, filename } = resp.content || {};
      if (!blob){ alert('Resposta inválida do servidor.'); return; }
      downloadBlob(blob, filename || `relatorio_${range.start.replace(/\//g,'-')}_${range.end.replace(/\//g,'-')}.pdf`);
    }catch(e){ alert(e?.message || 'Erro de rede'); }
  }

  return (
    <View>
      <Text style={styles.title}>Gerador de Relatório</Text>
      <View style={styles.btnCentered}><YellowButton title="Mudar opção" onPress={onBack} /></View>

      <View style={styles.insetBox}>
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabBtn, reportMode==='daily' && styles.tabActive]} onPress={()=> setReportMode('daily')}><Text>Diário</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, reportMode==='weekly' && styles.tabActive]} onPress={()=> setReportMode('weekly')}><Text>Semanal</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, reportMode==='monthly' && styles.tabActive]} onPress={()=> setReportMode('monthly')}><Text>Mensal</Text></TouchableOpacity>
        </View>
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={()=> setShowCalendar(true)} style={{ flexDirection:'row', alignItems:'center', flex:1 }}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={[styles.input,{flex:1, marginTop:0, paddingVertical:14}]}>{selectedDate || 'Selecionar data'}</Text>
          </TouchableOpacity>
          <View style={{ marginLeft:10 }}><YellowButton title="Selecionar data" onPress={()=> setShowCalendar(true)} /></View>
        </View>
        {dateError ? <Text style={styles.errorField}>{dateError}</Text> : null}

        <View style={styles.filterGrid}>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setShowListEditor('color')}>
            <View style={styles.checkBox} />
            <Text style={styles.checkLabel}>Cores ({listColor.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setShowListEditor('model')}>
            <View style={styles.checkBox} />
            <Text style={styles.checkLabel}>Modelos ({listModel.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setShowListEditor('brand')}>
            <View style={styles.checkBox} />
            <Text style={styles.checkLabel}>Marcas ({listBrand.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setShowListEditor('municipality')}>
            <View style={styles.checkBox} />
            <Text style={styles.checkLabel}>Municípios ({listMunicipality.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setShowListEditor('state')}>
            <View style={styles.checkBox} />
            <Text style={styles.checkLabel}>Estados ({listState.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:10 }}>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setWrecked((v)=> !v)}>
            <View style={[styles.checkBox, wrecked && styles.checkBoxChecked]} />
            <Text style={styles.checkLabel}>Sinistro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setJudicialRestriction((v)=> !v)}>
            <View style={[styles.checkBox, judicialRestriction && styles.checkBoxChecked]} />
            <Text style={styles.checkLabel}>Restrição Judicial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkItem} onPress={()=> setAuction((v)=> !v)}>
            <View style={[styles.checkBox, auction && styles.checkBoxChecked]} />
            <Text style={styles.checkLabel}>Leilão</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection:'row', alignItems:'center', marginTop:10 }}>
          <Text style={{ marginRight:10 }}>Condição Furto:</Text>
          {Object.values(EnumTheftVehicleCondition).map((opt)=> (
            <TouchableOpacity key={opt} onPress={()=> setTheftVehicleCondition(opt)} style={[styles.tabBtn, theftVehicleCondition===opt && styles.tabActive]}>
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showListEditor && (
          <View style={styles.overlay}>
            <View style={styles.overlayBackdrop} />
            <View style={styles.overlayCard}>
              <ScrollView style={{ maxHeight: '100%' }} contentContainerStyle={{ paddingBottom: 16 }}>
                <Text style={styles.label}>
                  {showListEditor==='color' ? 'Lista de Cores' : showListEditor==='model' ? 'Lista de Modelos' : showListEditor==='brand' ? 'Lista de Marcas' : showListEditor==='municipality' ? 'Lista de Municípios' : 'Lista de Estados'}
                </Text>
                <TextInput style={styles.input} value={newItem} onChangeText={setNewItem} placeholder="Adicionar item" placeholderTextColor="#999" />
                <View style={styles.btnCentered}><YellowButton title="Adicionar" onPress={()=>{
                  const s = (newItem||'').trim();
                  if (!s) return;
                  if (showListEditor==='color') setListColor((arr)=> [...arr, s]);
                  else if (showListEditor==='model') setListModel((arr)=> [...arr, s]);
                  else if (showListEditor==='brand') setListBrand((arr)=> [...arr, s]);
                  else if (showListEditor==='municipality') setListMunicipality((arr)=> [...arr, s]);
                  else setListState((arr)=> [...arr, s]);
                  setNewItem('');
                }} /></View>
                <View style={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' }}>
                  {(showListEditor==='color' ? listColor : showListEditor==='model' ? listModel : showListEditor==='brand' ? listBrand : showListEditor==='municipality' ? listMunicipality : listState).map((it, idx)=> (
                    <View key={idx} style={{ flexDirection:'row', alignItems:'center', marginBottom:8, borderWidth:1, borderColor:'#ccc', borderRadius:6, paddingHorizontal:8, paddingVertical:6 }}>
                      <Text>{it}</Text>
                      <TouchableOpacity onPress={()=>{
                        if (showListEditor==='color') setListColor((arr)=> arr.filter((_,i)=> i!==idx));
                        else if (showListEditor==='model') setListModel((arr)=> arr.filter((_,i)=> i!==idx));
                        else if (showListEditor==='brand') setListBrand((arr)=> arr.filter((_,i)=> i!==idx));
                        else if (showListEditor==='municipality') setListMunicipality((arr)=> arr.filter((_,i)=> i!==idx));
                        else setListState((arr)=> arr.filter((_,i)=> i!==idx));
                      }} style={{ marginLeft:10 }}><Text>✕</Text></TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.btnCentered}><YellowButton title="Continuar" onPress={()=> setShowListEditor(null)} /></View>
              </ScrollView>
            </View>
          </View>
        )}

        {showCalendar && (
          <View style={styles.overlay}>
            <View style={styles.overlayBackdrop} />
            <View style={styles.overlayCard}>
              <ScrollView style={{ maxHeight: '100%' }} contentContainerStyle={{ paddingBottom: 16 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <TouchableOpacity onPress={()=> { const d = new Date(calendarCursor); d.setMonth(d.getMonth()-1); setCalendarCursor(d); }} style={styles.tabBtn}><Text>{'<'}</Text></TouchableOpacity>
                  <Text style={{ fontWeight:'700' }}>{calendarCursor.toLocaleString(undefined,{ month:'long'})} {calendarCursor.getFullYear()}</Text>
                  <TouchableOpacity onPress={()=> { const d = new Date(calendarCursor); d.setMonth(d.getMonth()+1); setCalendarCursor(d); }} style={styles.tabBtn}><Text>{'>'}</Text></TouchableOpacity>
                </View>
                <View style={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' }}>
                  {Array.from({ length: new Date(calendarCursor.getFullYear(), calendarCursor.getMonth()+1, 0).getDate() }).map((_, i)=> {
                    const day = i+1;
                    const d = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), day);
                    return (
                      <TouchableOpacity key={day} onPress={()=> setDateFromDateObj(d)} style={{ width:'13%', minWidth:60, alignItems:'center', padding:8, marginBottom:6, borderWidth:1, borderColor:'#ccc', borderRadius:6, backgroundColor:'#fff' }}>
                        <Text>{day}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.btnCentered}><YellowButton title="Continuar" onPress={()=> setShowCalendar(false)} /></View>
              </ScrollView>
            </View>
          </View>
        )}

        <View style={styles.exportRow}>
          <Text style={styles.exportLabel}>Exportar como:</Text>
          <View style={styles.formatBox}><Text style={styles.formatText}>PDF</Text></View>
        </View>
        <View style={styles.btnCentered}><YellowButton title="Exportar" onPress={handleGenerateReport} /></View>
      </View>
    </View>
  );
}
