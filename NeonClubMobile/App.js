import React, { useEffect, useState } from 'react';
// Ensure Firebase default app is registered on the JS side before any auth calls
import '@react-native-firebase/app';
import { StatusBar, LogBox, View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { probeAndFixBase } from './src/services/api';
// import { auth as firebaseAuth } from './src/firebase';

function App() {
  const [isReady, setIsReady] = useState(false);

  // Ignore known noisy dev warnings (non-blocking)
  LogBox.ignoreLogs([
    /InteractionManager has been deprecated/i,
  ]);

  // On app start, quickly probe and set the best API base to avoid long timeouts on first requests
  useEffect(() => {
    (async () => {
      try {
        await probeAndFixBase();
      } catch {
        // Ignore errors
      }
      setIsReady(true);
    })();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  // Note: Avoid subscribing to Firebase auth here to prevent early initialization race.
  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <AppNavigator />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  loadingText: {
    color: '#00FFFF',
    fontSize: 18,
  },
});

export default App;