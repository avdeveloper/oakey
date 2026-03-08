import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oakey</Text>
      <Text style={styles.subtitle}>Your whiskey taste profile awaits</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#c8973a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#e8d5b0',
  },
});
