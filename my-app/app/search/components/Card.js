import { View, StyleSheet } from 'react-native';

export default function Card({ variant = 'registro', style, children }){
  return (
    <View style={[
      styles.base, 
      variant==='choose' ? 
      styles.choose : variant==='veiculo' ? 
      styles.veiculo : 
      styles.registro, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base:{
    width:'100%',
    maxWidth:560,
    left:250,
    paddingVertical:22,
    paddingHorizontal:22,
    minHeight:300,
    backgroundColor:'#ffffffee',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#ddd'
  },
  registro:{
    marginTop:10,
    marginLeft:100,
    minHeight:380
  },
  veiculo:{
    marginTop:160,
    marginLeft:130,
    minHeight:360
  },
  choose:{
    width:320,
    minHeight:300,
    marginTop:200,
    marginLeft:210
  }
});
