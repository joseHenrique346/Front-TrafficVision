import { useState, useRef } from 'react';
import { View, Text, TextInput, Image, Platform, TouchableOpacity } from 'react-native';
import YellowButton from '../../components/YellowButton';
import { Link, useRouter } from 'expo-router';
import { apiReportRegistration } from '../../../services/apiConection';

export default function VehicleMonitorCard({ styles, onBack }){
  const router = useRouter();
  const [plate, setPlate] = useState('');
  const [error, setError] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUri, setPreviewUri] = useState('');
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [successManual, setSuccessManual] = useState('');
  const [successUpload, setSuccessUpload] = useState('');
  const [lastVehicle, setLastVehicle] = useState(null);

  function normalizePlate(p){
    return (p || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
  function isValidPlate(p){
    const oldPattern = /^[A-Z]{3}[0-9]{4}$/;
    const mercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return oldPattern.test(p) || mercosulPattern.test(p);
  }
  function mapDataCondition(v){ const arr = ['Válido','Antigo','Indisponível']; return arr?.[Number(v)] ?? v; }
  function mapFuel(v){ const arr = ['Diesel','Gasolina','GNV','Elétrico','Etanol','Flex']; return arr?.[Number(v)] ?? v; }
  function mapTheft(v){ const arr = ['Nenhum','Roubo','Furto']; return arr?.[Number(v)] ?? v; }
  function flattenVehicle(content){
    const veh = content?.vehicle || null;
    const spec = veh?.vehicleSpec || {};
    const restr = spec?.vehicleRestriction || {};
    const owner = spec?.owner || {};
    if (!veh || !spec) return null;
    return {
      plate: spec.plate,
      brand: veh.brand,
      model: veh.model,
      year: veh.year,
      color: veh.color,
      renavam: spec.renavam,
      chassis: spec.chassis,
      municipality: spec.municipality,
      state: spec.state,
      enumDataVehicleCondition: mapDataCondition(spec.dataVehicleCondition),
      enumTypeFuelVehicle: mapFuel(spec.enumTypeFuelVehicle),
      theftVehicleCondition: mapTheft(restr.theftVehicleCondition),
      wrecked: restr.wrecked,
      judicialRestriction: restr.judicialRestriction,
      auction: restr.auction,
      ownerName: owner.name,
      ownerCpfCnpj: owner.cpfCnpj,
      ownerCnh: owner.cnh,
    };
  }
  async function handleSearchPlate(){
    setError('');
    setSuccessManual('');
    if (!plate.trim()){ setError('A placa é obrigatória.'); return; }
    const normalized = normalizePlate(plate);
    if (!isValidPlate(normalized)){ setError('Placa inválida. Use ABC1234 ou ABC1D23.'); return; }
    try{
      const resp = await apiReportRegistration({ userId: 1, plate: normalized });
      if (!resp.isSuccess){ setError(resp.listMessageErrors?.[0] || 'Erro ao registrar.'); return; }
      const v = flattenVehicle(resp.content);
      setLastVehicle(v);
      setSuccessManual('registro feito com sucesso');
    }catch(e){ setError(e?.message || 'Erro de rede.'); }
  }
  function toggleUpload(){
    setShowUpload((prev)=>{
      if (prev){
        setSelectedFile(null);
        setPreviewUri('');
        if (Platform.OS === 'web' && fileInputRef.current){ try{ fileInputRef.current.value=''; }catch(_){} }
        setSuccessUpload('');
        setLastVehicle(null);
      }
      return !prev;
    });
  }
  function onFileChange(e){
    const file = e?.target?.files?.[0];
    if (file){
      setSelectedFile(file);
      try{ setPreviewUri(URL.createObjectURL(file)); }catch(_){ setPreviewUri(''); }
      setSuccessUpload('');
      setLastVehicle(null);
    }
  }
  async function handleUploadSimulated(){
    if (!selectedFile){ setUploadError('Selecione uma imagem primeiro.'); return; }
    try{
      const resp = await apiReportRegistration({ userId: 1, file: selectedFile });
      if (!resp.isSuccess){ setUploadError(resp.listMessageErrors?.[0] || 'Erro ao registrar imagem'); return; }
      const v = flattenVehicle(resp.content);
      setLastVehicle(v);
      setSuccessUpload('registro feito com sucesso');
      setSelectedFile(null);
      setPreviewUri('');
      setUploadError('');
    }catch(e){ alert(e?.message || 'Erro de rede'); }
  }
  function viewVehicle(){
    if (!lastVehicle) return;
    router.push({ pathname: '/search/result', params: lastVehicle });
  }

  return (
    <View>
      <Text style={styles.title}>Monitoramento veicular</Text>
      <View style={styles.btnCentered}><YellowButton title="Mudar opção" onPress={onBack} /></View>

      {!showUpload && (
        <View style={styles.btnCentered}><YellowButton title={showManual ? 'Ocultar monitoramento manual' : 'Efetuar monitoramento manualmente'} onPress={()=> setShowManual((v)=> !v)} /></View>
      )}

      {showManual && !showUpload && (
        <View>
          <Text style={styles.label}>Informe a Placa</Text>
          <TextInput
            placeholder="Informe a placa. Ex: ABC1234 ou ABC1D23"
            placeholderTextColor="#999"
            style={styles.input}
            value={plate}
            onChangeText={setPlate}
          />
          {error ? <Text style={styles.errorField}>{error}</Text> : null}
          {successManual ? <Text style={{ color:'#2e7d32', fontWeight:'600', textAlign:'center', marginTop:12 }}>{successManual}</Text> : null}
          <View style={styles.btnCentered}><YellowButton title="Buscar" onPress={handleSearchPlate} /></View>
          {lastVehicle ? (<View style={styles.btnCentered}><YellowButton title="Ver informações da placa" onPress={viewVehicle} /></View>) : null}
        </View>
      )}

      {!showManual && !showUpload && (
        <View style={styles.iconRow}>
          <Link href="/search/take-photo" asChild>
            <TouchableOpacity style={styles.iconAction}>
              <View style={styles.iconCircle}><Text style={styles.iconEmoji}>📷</Text></View>
              <Text style={styles.iconLabel}>Tirar foto com{ '\n' }a câmera</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.iconAction} onPress={toggleUpload}>
            <View style={styles.iconCircle}><Text style={styles.iconEmoji}>⬆️</Text></View>
            <Text style={styles.iconLabel}>Efetuar upload{ '\n' }de imagem</Text>
          </TouchableOpacity>
        </View>
      )}

      {showUpload && (
        Platform.OS === 'web' ? (
          <View style={styles.uploadWeb}>
            <YellowButton title="Ocultar envio de foto" onPress={toggleUpload} style={{ marginBottom: 16 }} />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} />
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.preview} />
            ) : null}
            {uploadError ? <Text style={styles.errorField}>{uploadError}</Text> : null}
            {successUpload ? <Text style={{ color:'#2e7d32', fontWeight:'600', textAlign:'center', marginTop:12 }}>{successUpload}</Text> : null}
            <View style={styles.btnCentered}><YellowButton title="Enviar Foto" onPress={handleUploadSimulated} /></View>
            {lastVehicle ? (<View style={styles.btnCentered}><YellowButton title="Ver informações da placa" onPress={viewVehicle} /></View>) : null}
          </View>
        ) : (
          <View style={styles.uploadNative}>
            <Text style={{textAlign:'center'}}>Seleção de imagem no mobile será integrada com expo-image-picker.</Text>
            <View style={styles.btnCentered}><YellowButton title="Escolher Foto (em breve)" onPress={()=>{}} disabled /></View>
          </View>
        )
      )}
    </View>
  );
}
