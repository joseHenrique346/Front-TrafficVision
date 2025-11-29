import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function YellowButton({ title, onPress, style, disabled }){
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled ? styles.disabled : null]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button:{
    backgroundColor:'#FFD500',
    borderRadius:8,
    paddingVertical:12,
    paddingHorizontal:16,
    alignItems:'center',
    justifyContent:'center'
  },
  label:{
    color:'#000',
    fontSize:16,
    fontWeight:'600'
  },
  disabled:{
    opacity:0.6
  }
});