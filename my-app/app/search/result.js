import { View, Text, StyleSheet, ScrollView } from 'react-native';
import YellowButton from '../components/YellowButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenWithBackground from '../components/ScreenWithBackground';

export default function SearchResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    plate,
    brand,
    model,
    year,
    color,
    renavam,
    chassis,
    municipality,
    state,
    enumDataVehicleCondition,
    enumTypeFuelVehicle,
    theftVehicleCondition,
    wrecked,
    judicialRestriction,
    auction,
    ownerName,
    ownerCpfCnpj,
    ownerCnh,
  } = params;

  return (
    <ScreenWithBackground>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <Text style={styles.title}>Resultado da Pesquisa</Text>
          <YellowButton title="Pesquisar novamente" onPress={()=> router.replace('/search?mode=veiculos&step=panel')} style={styles.btn} />
          <ScrollView contentContainerStyle={styles.grid}>
            <Field label="Placa" value={plate} />
            <Field label="Marca" value={brand} />
            <Field label="Modelo" value={model} />
            <Field label="Ano" value={String(year)} />
            <Field label="Cor" value={color} />
            <Field label="Renavam" value={renavam} />
            <Field label="Chassi" value={chassis} />
            <Field label="Município" value={municipality} />
            <Field label="Estado" value={state} />
            <Field label="Condição Dados" value={enumDataVehicleCondition} />
            <Field label="Combustível" value={enumTypeFuelVehicle} />
            <Field label="Condição Furto" value={theftVehicleCondition} />
            <Field label="Siniistro" value={toBool(wrecked)} />
            <Field label="Restrição Judicial" value={toBool(judicialRestriction)} />
            <Field label="Leilão" value={toBool(auction)} />
            <Field label="Proprietário" value={ownerName} />
            <Field label="CPF/CNPJ" value={ownerCpfCnpj} />
            <Field label="CNH" value={ownerCnh} />
          </ScrollView>
        </View>
      </View>
    </ScreenWithBackground>
  );
}

function Field({ label, value }){
  return (
    <View style={styles.fieldItem}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{String(value ?? '-')}</Text>
    </View>
  );
}

function toBool(v){
  return v === 'true' || v === true ? 'Sim' : 'Não';
}

const styles = StyleSheet.create({
  wrap:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  card:{
    width:'95%',
    maxWidth:900,
    padding:18,
    backgroundColor:'#ffffffee',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd'
  },
  title:{
    fontSize:22,
    fontWeight:'700',
    textAlign:'center',
    marginBottom:12
  },
  btn:{
    alignSelf:'center',
    width:'60%',
    maxWidth:320,
    marginBottom:8
  },
  grid:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  fieldItem:{
    width:'48%',
    minWidth:260,
    marginBottom:8
  },
  fieldLabel:{
    fontWeight:'600'
  },
  fieldValue:{
    color:'#333'
  }
});
