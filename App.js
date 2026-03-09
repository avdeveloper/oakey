import './global.css';
import { StatusBar } from 'expo-status-bar';
import OakeyCaskScreen from './components/OakeyCaskScreen';

export default function App() {
  return (
    <>
      <OakeyCaskScreen />
      <StatusBar style="light" />
    </>
  );
}
