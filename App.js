import './global.css';
import { StatusBar } from 'expo-status-bar';
import { Text, View, useWindowDimensions } from 'react-native';

export default function App() {
  const { width } = useWindowDimensions();
  const isUnfolded = width >= 600;

  return (
    <View className={`flex-1 bg-whiskey-dark ${isUnfolded ? 'flex-row' : 'flex-col'} items-center justify-center`}>
      <View className={`items-center ${isUnfolded ? 'flex-1 border-r border-whiskey/30' : 'mb-6'}`}>
        <Text className="text-5xl font-bold text-whiskey mb-3">Oakey</Text>
        <Text className="text-lg text-whiskey-light">Your whiskey taste profile awaits</Text>
      </View>

      {isUnfolded && (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-whiskey-light text-center text-base opacity-60">
            Taste profile panel
          </Text>
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}
