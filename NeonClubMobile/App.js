// Use the main navigation file under src/navigation so the full app flow (splash, auth, tabs)
// is loaded instead of a minimal placeholder `src/AppNavigator`.
import React from 'react';
import { View, Text, AppRegistry } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Removed unsupported AppRegistry.setErrorHandler usage for React Native 0.82.0

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center' }}>Something went wrong.</Text>
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppNavigator />
    </ErrorBoundary>
  );
}