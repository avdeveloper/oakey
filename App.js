import './global.css';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-whiskey-dark">
      <Text className="text-5xl font-bold text-whiskey mb-3">Oakey</Text>
      <Text className="text-lg text-whiskey-light">Your whiskey taste profile awaits</Text>
      <StatusBar style="light" />
    </View>
  );
}
