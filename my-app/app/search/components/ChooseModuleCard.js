import { View, Text, StyleSheet } from 'react-native';
import YellowButton from '../../components/YellowButton';

export default function ChooseModuleCard({ onSelectRegistros, onSelectVeiculos }){
  return (
    <View>
      <Text style={styles.title}>Selecione um módulo</Text>
      <View style={styles.buttons}> 
        <YellowButton title="Registros" onPress={onSelectRegistros} style={styles.buttonR} />
        <YellowButton title="Veículos" onPress={onSelectVeiculos} style={styles.buttonV} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title:{
    fontSize:24,
    fontWeight:'700',
    textAlign:'center',
    marginBottom:16,
    marginTop:50
  },
  
  buttons:{ 
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40
  },

  buttonR:{
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 12
  },

  buttonV:{
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 50,
    marginBottom: 30
  }
});
