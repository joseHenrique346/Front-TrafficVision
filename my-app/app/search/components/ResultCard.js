import { View, Text, ScrollView } from 'react-native';

function Field({ styles, label, value }){
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

export default function ResultCard({ styles, vehicle }){
  if (!vehicle) return null;
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>Resultado</Text>
      <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={styles.resultGrid}>
        <Text style={styles.sectionTitle}>Dados do Veículo</Text>
        <Field styles={styles} label="Placa" value={vehicle.plate} />
        <Field styles={styles} label="Marca" value={vehicle.brand} />
        <Field styles={styles} label="Modelo" value={vehicle.model} />
        <Field styles={styles} label="Ano" value={String(vehicle.year)} />
        <Field styles={styles} label="Cor" value={vehicle.color} />
        <Field styles={styles} label="Renavam" value={vehicle.renavam} />
        <Field styles={styles} label="Chassi" value={vehicle.chassis} />
        <Field styles={styles} label="Município" value={vehicle.municipality} />
        <Field styles={styles} label="Estado" value={vehicle.state} />
        <Field styles={styles} label="Condição Dados" value={vehicle.enumDataVehicleCondition} />
        <Field styles={styles} label="Combustível" value={vehicle.enumTypeFuelVehicle} />
        <Field styles={styles} label="Condição Furto" value={vehicle.theftVehicleCondition} />
        <Field styles={styles} label="Siniistro" value={toBool(vehicle.wrecked)} />
        <Field styles={styles} label="Restrição Judicial" value={toBool(vehicle.judicialRestriction)} />
        <Field styles={styles} label="Leilão" value={toBool(vehicle.auction)} />
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Dados do Proprietário</Text>
        <Field styles={styles} label="Proprietário" value={vehicle.ownerName} />
        <Field styles={styles} label="CPF/CNPJ" value={vehicle.ownerCpfCnpj} />
        <Field styles={styles} label="CNH" value={vehicle.ownerCnh} />
      </ScrollView>
    </View>
  );
}

