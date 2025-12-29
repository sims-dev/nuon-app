import React, { useEffect, useState } from 'react';
// Firebase app initialized in index.js
import { StatusBar, LogBox, View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { probeAndFixBase } from './src/services/api';
import { NuonIcon } from './src/components/NuonLogo';
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
        <View style={styles.logoCard}>
          <NuonIcon size={140} variant="default" style={{ tintColor: '#000000' }} />
        </View>
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
  logoCard: {
    backgroundColor: 'white',
    width: 180,
    height: 180,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 20,
  },
  loadingText: {
    color: '#00FFFF',
    fontSize: 18,
  },
});

export default App;